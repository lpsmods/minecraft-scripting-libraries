import { ScriptEventCommandMessageAfterEvent, system } from "@minecraft/server";
import { uuid } from "./utils";
import { DataUtils, EventSignal } from "@lpsmods/mc-common";
import { BridgeTimeoutError } from "./errors";

/**
 * Packet payload data keyed by string.
 */
export type pData = Record<string, unknown>;

/**
 * Structured data for the packet.
 */
export type PacketData = Record<string, any>;

export interface PacketHeaders {
  type: "request" | "response";
  sender: string;
  target?: string;
  id: string;
}

export interface PacketSendOptions {
  target?: string;
}

export interface PacketSyncOptions extends PacketSendOptions {
  /** Number of game ticks before rejecting. Set to 0 to disable the timeout. */
  timeoutTicks?: number;
}

/**
 * Event payload for packet callbacks.
 */
export class PacketEvent {
  readonly id: string;
  readonly packet: PacketData;

  readonly sender?: string;
  readonly target?: string;

  constructor(id: string, packet: PacketData, sender?: string, target?: string) {
    this.id = id;
    this.packet = packet;
    this.sender = sender;
    this.target = target;
  }
}

/**
 * Event payload for packet receive callbacks.
 */
export class PacketReceiveEvent extends PacketEvent {
  response: unknown | Promise<unknown>;

  constructor(id: string, packet: PacketData, response?: unknown | Promise<unknown>, sender?: string, target?: string) {
    super(id, packet, sender, target);
    this.response = response;
  }
}

/**
 * Options for configuring the packet receive event.
 */
export interface PacketReceiveEventOptions {
  namespaces?: string[];
}

/**
 * Event payload for packet response callbacks.
 */
export class PacketResponseEvent extends PacketEvent {
  constructor(id: string, packet: PacketData, sender?: string, target?: string) {
    super(id, packet, sender, target);
  }
}

/**
 * Options for configuring the packet response event.
 */
export interface PacketResponseEventOptions {
  namespaces?: string[];
}

// export interface PacketListener {
//   callback: (event: any) => void;
//   options?: PacketReceiveEventOptions;
// }

/**
 * Event signal for subscribing to packet receive events.
 */
export class PacketReceiveEventSignal extends EventSignal<PacketReceiveEvent, PacketReceiveEventOptions> {
  // private listeners: PacketListener[] = [];
  // constructor() {}
  // size(): number {
  //   return this.listeners.length;
  // }
  // subscribe(
  //   callback: (event: PacketReceiveEvent) => void,
  //   options?: PacketReceiveEventOptions,
  // ): (event: PacketReceiveEvent) => void {
  //   this.listeners.push({ callback, options });
  //   return callback;
  // }
  // unsubscribe(callback: (event: PacketReceiveEvent) => void): void {
  //   this.listeners = this.listeners.filter((fn) => fn.callback !== callback);
  // }
  // apply(event: PacketReceiveEvent): void {
  //   for (const fn of this.listeners) {
  //     try {
  //       fn.callback(event);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  // }
}

/**
 * Event signal for subscribing to packet response events.
 */
export class PacketResponseEventSignal extends EventSignal<PacketResponseEvent, PacketResponseEventOptions> {
  // private listeners: PacketListener[] = [];
  // constructor() {}
  // size(): number {
  //   return this.listeners.length;
  // }
  // subscribe(
  //   callback: (event: PacketResponseEvent) => void,
  //   options?: PacketResponseEventOptions,
  // ): (event: PacketResponseEvent) => void {
  //   this.listeners.push({ callback, options });
  //   return callback;
  // }
  // unsubscribe(callback: (event: PacketResponseEvent) => void): void {
  //   this.listeners = this.listeners.filter((fn) => fn.callback !== callback);
  // }
  // apply(event: PacketResponseEvent): void {
  //   for (const fn of this.listeners) {
  //     try {
  //       fn.callback(event);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  // }
}

/**
 * Provides packet behavior.
 */
export class Packet {
  static readonly sender = uuid(); // per addon

  static send(identifier: string, data: PacketData, options: PacketSendOptions = {}): void {
    const eId = `packet:${uuid()}`; // Don't use identifier because of namespace issues.
    const payload = DataUtils.dumpJson({
      headers: { type: "request", sender: Packet.sender, target: options.target, id: identifier },
      body: data,
    });
    system.sendScriptEvent(eId, JSON.stringify(payload));
  }

  static async sendSync<T = PacketData>(identifier: string, data: PacketData, options: PacketSyncOptions = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutTicks = options.timeoutTicks ?? 100;
      let timeoutId: number | undefined;

      const cleanup = (): void => {
        PacketEvents.response.unsubscribe(cb);
        if (timeoutId !== undefined) system.clearRun(timeoutId);
      };

      function cb(event: PacketResponseEvent): void {
        if (event.id !== identifier) return;
        if (event.target !== undefined && event.target !== Packet.sender) return;
        if (options.target !== undefined && event.sender !== undefined && event.sender !== options.target) return;
        cleanup();
        resolve(event.packet as T);
      }

      PacketEvents.response.subscribe(cb);
      if (timeoutTicks > 0) {
        timeoutId = system.runTimeout(() => {
          cleanup();
          reject(new BridgeTimeoutError(identifier, timeoutTicks));
        }, timeoutTicks);
      }

      try {
        this.send(identifier, data, options);
      } catch (err) {
        cleanup();
        reject(err);
      }
    });
  }

  static packetReceive(event: ScriptEventCommandMessageAfterEvent): void {
    let data: unknown;
    try {
      data = DataUtils.loadJson(JSON.parse(event.message));
    } catch {
      return;
    }
    if (!Packet.isEnvelope(data)) return;
    const { headers, body } = data;
    if (headers.target !== undefined && headers.target !== Packet.sender) return;
    const id = headers.id;

    switch (headers.type) {
      case "request": // dst
        const pEvent = new PacketReceiveEvent(id, body, undefined, headers.sender, headers.target);
        PacketEvents.receive.apply(pEvent);
        if (pEvent.response === undefined) return;
        if (pEvent.response instanceof Promise) {
          pEvent.response
            .then((response) => Packet.sendResponse(event.id, id, headers.sender, response))
            .catch((err) => Packet.sendResponse(event.id, id, headers.sender, { error: true, message: String(err) }));
        } else {
          Packet.sendResponse(event.id, id, headers.sender, pEvent.response);
        }
        return;

      case "response": // src
        PacketEvents.response.apply(new PacketResponseEvent(id, body, headers.sender, headers.target));
        return;
    }
  }

  private static sendResponse(eventId: string, id: string, target: string, body: unknown): void {
    const payload = DataUtils.dumpJson({
      headers: { type: "response", sender: Packet.sender, target, id },
      body,
    });
    system.sendScriptEvent(eventId, JSON.stringify(payload));
  }

  private static isEnvelope(value: unknown): value is { headers: PacketHeaders; body: PacketData } {
    if (!value || typeof value !== "object") return false;
    const headers = (value as { headers?: unknown }).headers;
    if (!headers || typeof headers !== "object") return false;
    const candidate = headers as Partial<PacketHeaders>;
    return (
      (candidate.type === "request" || candidate.type === "response") &&
      typeof candidate.sender === "string" &&
      typeof candidate.id === "string" &&
      (candidate.target === undefined || typeof candidate.target === "string")
    );
  }
}

/**
 * Provides packet events behavior.
 */
export class PacketEvents {
  /**
   * This event fires when a packet is received.
   */
  static readonly receive = new PacketReceiveEventSignal();

  /**
   * This event fires when a packet has been responded.
   */
  static readonly response = new PacketResponseEventSignal();
}

function setup() {
  system.afterEvents.scriptEventReceive.subscribe(Packet.packetReceive, {
    namespaces: ["packet"],
  });
}

setup();
