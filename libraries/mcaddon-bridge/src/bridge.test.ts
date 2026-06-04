import { beforeEach, describe, expect, it, vi } from "vitest";
import { world } from "@minecraft/server";
import { Bridge } from "./bridge";
import { PacketReceiveEvent } from "./packet";

function mockWorldDynamicProperties(): void {
  const properties = new Map<string, any>();
  world.getDynamicProperty = vi.fn((name: string) => properties.get(name));
  world.setDynamicProperty = vi.fn((name: string, value: any) => {
    if (value === undefined) {
      properties.delete(name);
    } else {
      properties.set(name, value);
    }
  });
}

describe("Bridge", () => {
  beforeEach(() => {
    Bridge.all.clear();
    mockWorldDynamicProperties();
  });

  it("defines, reads, writes, and calls bridge properties", () => {
    const api = new Bridge("test");
    let setterValue = "";

    api.defineProperty("name", { value: "Steve", writeable: true });
    api.defineProperty("fullName", {
      get() {
        const firstName = world.getDynamicProperty("first_name");
        const lastName = world.getDynamicProperty("last_name");
        return `${firstName} ${lastName}`;
      },
      set(value: string) {
        const parts = value.split(" ");
        world.setDynamicProperty("first_name", parts[0]);
        world.setDynamicProperty("last_name", parts[1]);
        setterValue = value;
      },
    });
    api.defineProperty("mul", {
      value(num1: number, num2: number) {
        return num1 * num2;
      },
    });

    api.set("name", "Alex");
    api.set("fullName", "Alex Smith");

    expect(api.get("name")).toBe("Alex");
    expect(api.get("fullName")).toBe("Alex Smith");
    expect(setterValue).toBe("Alex Smith");
    expect(api.call("mul", [6, 7])).toBe(42);
  });

  it("reports whether a property exists", () => {
    const api = new Bridge("test");
    api.defineProperty("name", { value: "Steve" });

    expect(api.has("name")).toBe(true);
    expect(api.has("missing")).toBe(false);
  });

  it("rejects duplicate and missing properties", () => {
    const api = new Bridge("test");
    api.defineProperty("name", { value: "Steve" });

    expect(() => api.defineProperty("name", { value: "Alex" })).toThrow("name is already defined");
    expect(() => api.get("missing")).toThrow("missing not found");
    expect(() => api.set("missing", "Alex")).toThrow("missing not found");
    expect(() => api.call("name")).toThrow("Property 'name' is not a function.");
  });

  it("dispatches packet requests to the targeted bridge", () => {
    const api = new Bridge("test");
    api.defineProperty("answer", { value: 42 });
    const event = new PacketReceiveEvent("bridge", {
      addon: "test",
      method: "get",
      property: "answer",
    });

    Bridge.receive(event);

    expect(event.response).toEqual({ error: false, value: 42 });
  });

  it("returns packet errors from failed bridge requests", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    new Bridge("test");
    const event = new PacketReceiveEvent("bridge", {
      addon: "test",
      method: "unknown",
    });

    Bridge.receive(event);

    expect(error).toHaveBeenCalledWith('Method "receive_unknown" not found or not a function.');
  });
});
