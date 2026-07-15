import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { system } from "@minecraft/server";
import { DataUtils } from "@lpsmods/mc-common";
import { Packet, PacketEvents, PacketReceiveEvent, PacketResponseEvent } from "./packet";

function encodePacket(data: unknown): string {
  return JSON.stringify(DataUtils.dumpJson(data));
}

function decodePacket(message: string): any {
  return DataUtils.loadJson(JSON.parse(message));
}

describe("Packet", () => {
  beforeEach(() => {
    PacketEvents.receive.listeners = [];
    PacketEvents.response.listeners = [];
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends request packets through script events", () => {
    const sendScriptEvent = vi.fn();
    system.sendScriptEvent = sendScriptEvent;

    Packet.send("bridge", { method: "get", property: "answer" });

    expect(sendScriptEvent).toHaveBeenCalledOnce();
    const [eventId, message] = sendScriptEvent.mock.calls[0];
    expect(eventId).toMatch(/^packet:/);
    expect(decodePacket(message)).toEqual({
      headers: { type: "request", sender: Packet.sender, id: "bridge" },
      body: { method: "get", property: "answer" },
    });
  });

  it("applies receive listeners and sends a response when one is set", () => {
    const sendScriptEvent = vi.fn();
    system.sendScriptEvent = sendScriptEvent;
    const receive = vi.fn((event: PacketReceiveEvent) => {
      event.response = { ok: true, value: event.packet.value };
    });
    PacketEvents.receive.subscribe(receive);

    Packet.packetReceive({
      id: "packet:request",
      message: encodePacket({
        headers: { type: "request", sender: "other", id: "bridge" },
        body: { value: 7 },
      }),
    } as any);

    expect(receive).toHaveBeenCalledWith(expect.objectContaining({ id: "bridge", packet: { value: 7 } }));
    expect(sendScriptEvent).toHaveBeenCalledOnce();
    const [eventId, message] = sendScriptEvent.mock.calls[0];
    expect(eventId).toBe("packet:request");
    expect(decodePacket(message)).toEqual({
      headers: { type: "response", sender: Packet.sender, id: "bridge" },
      body: { ok: true, value: 7 },
    });
  });

  it("does not send a response when receive listeners leave response empty", () => {
    const sendScriptEvent = vi.fn();
    system.sendScriptEvent = sendScriptEvent;
    PacketEvents.receive.subscribe(() => {});

    Packet.packetReceive({
      id: "packet:request",
      message: encodePacket({
        headers: { type: "request", sender: "other", id: "bridge" },
        body: { value: 7 },
      }),
    } as any);

    expect(sendScriptEvent).not.toHaveBeenCalled();
  });

  it("applies response listeners with the response body", () => {
    const response = vi.fn();
    PacketEvents.response.subscribe(response);

    Packet.packetReceive({
      id: "packet:response",
      message: encodePacket({
        headers: { type: "response", sender: "other", id: "bridge" },
        body: { ok: true },
      }),
    } as any);

    expect(response).toHaveBeenCalledWith(new PacketResponseEvent("bridge", { ok: true }));
  });

  it("resolves sendSync with the matching response packet", async () => {
    system.sendScriptEvent = vi.fn();
    const promise = Packet.sendSync("bridge", { value: 7 });

    PacketEvents.response.apply(new PacketResponseEvent("other", { ignored: true }));
    PacketEvents.response.apply(new PacketResponseEvent("bridge", { ok: true }));

    await expect(promise).resolves.toEqual({ ok: true });
    expect(PacketEvents.response.size).toBe(0);
  });

  it("throws for unknown packet header types", () => {
    expect(() =>
      Packet.packetReceive({
        id: "packet:invalid",
        message: encodePacket({
          headers: { type: "wat", sender: "other", id: "bridge" },
          body: {},
        }),
      } as any),
    ).toThrow("'wat' is not a valid packet type!");
  });
});
