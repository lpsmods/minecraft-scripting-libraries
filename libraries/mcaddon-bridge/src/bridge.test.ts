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
    new Bridge("test");
    const event = new PacketReceiveEvent("bridge", {
      addon: "test",
      method: "unknown",
    });

    Bridge.receive(event);

    expect(event.response).toEqual({ error: true, code: "UNKNOWN_METHOD", message: "Unknown method 'unknown'." });
  });

  it("enforces descriptors and supports lifecycle management", () => {
    const api = new Bridge("test", { enableDocs: false });
    api.defineProperty("readonly", { value: 1 });
    api.defineProperty("temporary", { value: 2, configurable: true, enumerable: false });

    expect(api.options.enableDocs).toBe(false);
    expect(() => api.set("readonly", 2)).toThrow("not writable");
    expect(api.keys()).toEqual(["readonly"]);
    expect(api.deleteProperty("temporary")).toBe(true);
    api.dispose();
    expect(Bridge.all.has("test")).toBe(false);
  });

  it("rejects duplicate bridge registrations", () => {
    new Bridge("test");
    expect(() => new Bridge("test")).toThrow("already registered");
  });

  it("awaits asynchronous bridge calls", async () => {
    const api = new Bridge("test");
    api.defineProperty("answer", { value: async () => 42 });
    const event = new PacketReceiveEvent("bridge", { addon: "test", method: "call", property: "answer", args: [] });

    Bridge.receive(event);

    await expect(event.response).resolves.toEqual({ error: false, value: 42 });
  });

  it("negotiates versions and supports async authorization", async () => {
    const api = new Bridge("test", { version: "2.1.0", authorize: async (request) => request.method === "connect" });
    const compatible = new PacketReceiveEvent("bridge", {
      addon: "test",
      method: "connect",
      version: "^2.0.0",
      protocolVersion: 1,
    });
    Bridge.receive(compatible);
    await expect(compatible.response).resolves.toMatchObject({ error: false, version: "2.1.0" });

    const denied = new PacketReceiveEvent("bridge", { addon: "test", method: "get", property: "name" });
    Bridge.receive(denied);
    await expect(denied.response).resolves.toMatchObject({ error: true, code: "UNAUTHORIZED" });

    api.dispose();
  });
});
