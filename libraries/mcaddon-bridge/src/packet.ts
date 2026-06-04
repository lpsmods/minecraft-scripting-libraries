import { ScriptEventCommandMessageAfterEvent, system } from "@minecraft/server";
import { uuid } from "./utils";
import { DataUtils, EventSignal } from "@lpsmods/mc-common";

export type pData = { [key: string]: any };

export type PacketData = { [key: string]: any };

export class PacketEvent {
  readonly id: string;
  readonly packet: PacketData;

  constructor(id: string, packet: PacketData) {
    this.id = id;
    this.packet = packet;
  }
}

export class PacketReceiveEvent extends PacketEvent {
  response: any;

  constructor(id: string, packet: PacketData, response?: any) {
    super(id, packet);
    this.response = response ?? null;
  }
}

export interface PacketReceiveEventOptions {
  namespaces?: string[];
}

export class PacketResponseEvent extends PacketEvent {
  constructor(id: string, packet: PacketData) {
    super(id, packet);
  }
}

export interface PacketResponseEventOptions {
  namespaces?: string[];
}

// export interface PacketListener {
//   callback: (event: any) => void;
//   options?: PacketReceiveEventOptions;
// }

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

export class Packet {
  static readonly sender = uuid(); // per addon

  static send(identifier: string, data: PacketData): void {
    const eId = `packet:${uuid()}`; // Don't use identifier because of namespace issues.
    const payload = DataUtils.dumpJson({
      headers: { type: "request", sender: Packet.sender, id: identifier },
      body: data,
    });
    system.sendScriptEvent(eId, JSON.stringify(payload));
  }

  // TODO: Timeout
  static async sendSync(identifier: string, data: PacketData): Promise<PacketData> {
    return new Promise((resolve, reject) => {
      function cb(event: PacketResponseEvent): void {
        if (event.id !== identifier) return;
        resolve(event.packet);
        PacketEvents.response.unsubscribe(cb);
      }

      PacketEvents.response.subscribe(cb);
      this.send(identifier, data);
    });
  }

  static packetReceive(event: ScriptEventCommandMessageAfterEvent): void {
    const data = DataUtils.loadJson(JSON.parse(event.message));
    const id = data.headers.id;

    switch (data.headers.type) {
      case "request": // dst
        const pEvent = new PacketReceiveEvent(id.toString(), data.body);
        PacketEvents.receive.apply(pEvent);
        if (!pEvent.response) return;
        const payload = DataUtils.dumpJson({
          headers: {
            type: "response",
            sender: Packet.sender,
            id: id.toString(),
          },
          body: pEvent.response,
        });
        system.sendScriptEvent(event.id, JSON.stringify(payload));
        return;

      case "response": // src
        PacketEvents.response.apply(new PacketResponseEvent(id, data));
        return;
      default:
        throw new Error(`'${data.headers.type}' is not a valid packet type!`);
    }
  }
}

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
