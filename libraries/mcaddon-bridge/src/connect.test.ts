import { afterEach, describe, expect, it, vi } from "vitest";
import { Connection, connect } from "./connect";
import { Packet } from "./packet";

describe("Connection", () => {
  afterEach(() => vi.restoreAllMocks());

  it("connects using the response body and records remote metadata", async () => {
    const send = vi.spyOn(Packet, "sendSync").mockResolvedValue({ error: false, version: "1.2.0" });

    const connection = await connect("example", { version: "^1.0.0", timeoutTicks: 20 });

    expect(connection.isConnected).toBe(true);
    expect(connection.remoteVersion).toBe("1.2.0");
    expect(send).toHaveBeenCalledWith(
      expect.stringMatching(/^bridge:/),
      expect.objectContaining({ addon: "example", method: "connect", version: "^1.0.0", protocolVersion: 1 }),
      { timeoutTicks: 20 },
    );
  });

  it("supports typed get, set, has, and call operations", async () => {
    vi.spyOn(Packet, "sendSync")
      .mockResolvedValueOnce({ error: false, value: "Alex" })
      .mockResolvedValueOnce({ error: false })
      .mockResolvedValueOnce({ error: false, value: true })
      .mockResolvedValueOnce({ error: false, value: 42 });
    const connection = new Connection("example");

    await expect(connection.get<string>("name")).resolves.toBe("Alex");
    await expect(connection.set("name", "Steve")).resolves.toBeUndefined();
    await expect(connection.has("name")).resolves.toBe(true);
    await expect(connection.call<number>("mul", 6, 7)).resolves.toBe(42);
  });

  it("rejects malformed and remote error responses", async () => {
    const send = vi.spyOn(Packet, "sendSync").mockResolvedValueOnce({ value: 1 }).mockResolvedValueOnce({
      error: true,
      code: "DENIED",
      message: "No access",
    });
    const connection = new Connection("example");

    await expect(connection.get("name")).rejects.toMatchObject({ code: "PROTOCOL_ERROR" });
    await expect(connection.get("name")).rejects.toMatchObject({ code: "REMOTE_ERROR", message: "No access" });
    expect(send).toHaveBeenCalledTimes(2);
  });

  it("disconnects locally", () => {
    const connection = new Connection("example");
    connection.isConnected = true;
    connection.disconnect();
    expect(connection.isConnected).toBe(false);
  });
});
