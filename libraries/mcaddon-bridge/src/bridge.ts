import { Player, RawMessage } from "@minecraft/server";
import { PacketData, PacketEvents, PacketReceiveEvent } from "./packet";
import { ActionFormData, ActionFormResponse } from "@minecraft/server-ui";
import { errorPacket } from "./utils";
import { BRIDGE_PROTOCOL_VERSION, BridgeRequest } from "./protocol";

/**
 * Interface describing a bridge descriptor.
 */
export interface BridgeDescriptor {
  /**
   * Sets the property’s value
   */
  value?: any;

  /**
   * Can the value be changed?
   */
  writeable?: boolean;

  /** Standard spelling of writeable. Takes precedence when both are supplied. */
  writable?: boolean;

  /**
   * Shows in loops/Object.keys()?
   */
  enumerable?: boolean;

  /**
   * Can the property be deleted or modified?
   */
  configurable?: boolean;

  /**
   * A description to show in the docs.
   */
  description?: string;

  /**
   * Function to call when reading the property
   * @returns {any}
   */
  get?: () => any;

  /**
   * Function to call when setting the property
   * @param {any} value
   */
  set?: (value: any) => void;
}

/**
 * Options for configuring the bridge.
 */
export interface BridgeOptions {
  version?: string;
  name?: string | RawMessage;
  description?: string | RawMessage;
  enableDocs?: boolean;
  /** Optionally authorize requests. Add-ons in one world should otherwise be considered trusted. */
  authorize?: (request: Readonly<BridgeRequest>, sender?: string) => boolean | Promise<boolean>;
}

/**
 * Provides bridge behavior.
 */
export class Bridge {
  static readonly all = new Map<string, Bridge>();

  private descriptors = new Map<string, BridgeDescriptor>();
  readonly addonId: string;
  options: BridgeOptions;

  /**
   * A new Bridge instance.
   * @param {string} addonId
   * @param {BridgeOptions} options
   */
  constructor(addonId: string, options?: BridgeOptions) {
    this.addonId = addonId;
    this.options = options ?? {};
    this.options.version ??= "1.0.0";
    this.options.enableDocs ??= true;
    if (Bridge.all.has(this.addonId)) throw new Error(`Bridge '${this.addonId}' is already registered.`);
    Bridge.all.set(this.addonId, this);
  }

  /**
   * Get a property.
   * @param {string} name
   * @returns {any}
   */
  get(name: string): any {
    const prop = this.descriptors.get(name);
    if (!prop) throw new Error(`${name} not found`);
    if (prop.get) return prop.get();
    return prop.value;
  }

  /**
   * Set property.
   * @param {string} name
   * @param {any} value
   * @returns {Bridge}
   */
  set(name: string, value: any): Bridge {
    const prop = this.descriptors.get(name);
    if (!prop) throw new Error(`${name} not found`);
    if (prop.set) {
      prop.set(value);
      return this;
    }
    if (!(prop.writable ?? prop.writeable ?? false)) throw new Error(`Property '${name}' is not writable.`);
    prop.value = value;
    return this;
  }

  /**
   * Check if property name.
   * @param {string} name
   * @returns {boolean}
   */
  has(name: string): boolean {
    const prop = this.descriptors.get(name);
    return !!prop;
  }

  /** Returns enumerable property names. */
  keys(): string[] {
    return [...this.descriptors].filter(([, descriptor]) => descriptor.enumerable !== false).map(([name]) => name);
  }

  /** Deletes a configurable property. */
  deleteProperty(name: string): boolean {
    const prop = this.descriptors.get(name);
    if (!prop) return false;
    if (prop.configurable !== true) throw new Error(`Property '${name}' is not configurable.`);
    return this.descriptors.delete(name);
  }

  /** Removes this bridge from the registry. */
  dispose(): void {
    if (Bridge.all.get(this.addonId) === this) Bridge.all.delete(this.addonId);
  }

  static unregister(addonId: string): boolean {
    return Bridge.all.delete(addonId);
  }

  /**
   * Call a function
   * @param {string} name
   * @param {any[]} args
   * @returns {any}
   */
  call(name: string, args?: any[]): any {
    const prop = this.descriptors.get(name);
    if (!prop) throw new Error(`${name} not found`);

    // Check if function
    if (!prop.value || typeof prop.value !== "function") {
      throw new Error(`Property '${name}' is not a function.`);
    }
    return prop.value.apply(this, args ?? []);
  }

  private receive_connect(event: PacketReceiveEvent, data: PacketData): void {
    if (this.addonId !== data.addon) {
      const result = errorPacket("Not found!");
      result.addon = this.addonId;
      event.response = result;
      return;
    }
    if (data.protocolVersion !== undefined && data.protocolVersion !== BRIDGE_PROTOCOL_VERSION) {
      event.response = {
        error: true,
        code: "PROTOCOL_VERSION_MISMATCH",
        message: `Protocol version ${data.protocolVersion} is not supported.`,
        protocolVersion: BRIDGE_PROTOCOL_VERSION,
      };
      return;
    }
    if (data.version && !Bridge.versionsCompatible(data.version, this.options.version as string)) {
      event.response = {
        error: true,
        code: "VERSION_MISMATCH",
        message: `Bridge version ${this.options.version} is incompatible with requested version ${data.version}.`,
        version: this.options.version,
      };
      return;
    }
    event.response = {
      error: false,
      addon: this.addonId,
      version: this.options.version,
      protocolVersion: BRIDGE_PROTOCOL_VERSION,
      message: `Connected to ${this.addonId}`,
    };
  }

  private receive_get(event: PacketReceiveEvent, data: PacketData): void {
    try {
      event.response = {
        error: false,
        value: this.get(data.property),
      };
    } catch (err) {
      event.response = errorPacket(err);
    }
  }

  private receive_set(event: PacketReceiveEvent, data: PacketData): void {
    try {
      this.set(data.property, data.value);
      event.response = { error: false };
    } catch (err) {
      event.response = errorPacket(err);
    }
  }

  private receive_has(event: PacketReceiveEvent, data: PacketData): void {
    try {
      event.response = { error: false, value: this.has(data.property) };
    } catch (err) {
      event.response = errorPacket(err);
    }
  }

  private receive_call(event: PacketReceiveEvent, data: PacketData): void {
    event.response = Promise.resolve()
      .then(() => this.call(data.property, data.args))
      .then((value) => ({ error: false, value }))
      .catch((err) => errorPacket(err));
  }

  private receive_docs(event: PacketReceiveEvent, data: PacketData): void {
    const result = {
      error: false,
      message: "",
    };
    const player = data.player;
    if (!this.options.enableDocs) {
      event.response = errorPacket(`${this.options.name ?? this.addonId} docs are disabled.`);
      return;
    }
    if (!player || !(player instanceof Player)) {
      event.response = errorPacket("Player not found!");
      return;
    }
    this.showDocs(player);
    result.message = `Showing ${this.options.name ?? this.addonId} docs for ${player.name}`;
    event.response = result;
  }

  /**
   * Create a new property.
   * @param {string} property The property name.
   * @param {BridgeDescriptor} descriptor A descriptor of the property to be added or changed
   */
  defineProperty(property: string, descriptor: BridgeDescriptor): void {
    if (this.descriptors.has(property)) throw new Error(`${property} is already defined`);
    this.descriptors.set(property, descriptor);
  }

  private showProperty(player: Player, propertyName: string): void {
    const res = this.descriptors.get(propertyName);
    if (!res) return;
    const ui = new ActionFormData();
    ui.title(`${propertyName} Bridge`);
    const type = res.value != undefined ? typeof res.value : "setter / getter";
    ui.body(
      `${res.description ?? ""}\n\n§lWritable§r: ${res.writable ?? res.writeable ?? false}\n\n§lType:§r ${type}\n\n§lEnumerable§r: ${
        res.enumerable
      }\n\n§lConfigurable§r: ${res.configurable}\n\n`,
    );
    ui.show(player);
  }

  private showProperties(player: Player): void {
    const ui = new ActionFormData();
    ui.title(`${this.addonId} Bridge Properties`);
    ui.body(`All properties for ${this.addonId}`);

    for (const k of this.keys()) {
      // for (const [kk, vv] of v) {
      //   ui.button(`${kk} (${k})`);
      //   btns.push([k, kk]);
      // }
      ui.button(k);
    }

    ui.show(player)
      .then((event: ActionFormResponse) => {
        if (event.canceled) return;
        // const btn = btns[event.selection as number];
        const key = this.keys()[event.selection ?? 0];
        this.showProperty(player, key);
      })
      .catch((err) => {
        console.warn(`Properties form error: ${String(err)}`);
      });
  }

  /**1
   * Show docs UI for this Add-On bridge.
   * @param {Player} player
   */
  showDocs(player: Player): void {
    const ui = new ActionFormData();
    ui.title(`${this.addonId} Bridge [${this.options.version}]`);
    ui.body(this.options.description ?? "");
    ui.button("Properties");
    ui.show(player)
      .then((event: ActionFormResponse) => {
        if (event.canceled) return;
        switch (event.selection) {
          case 0:
            this.showProperties(player);
            break;
        }
      })
      .catch((err) => {
        console.warn(`Docs form error: ${String(err)}`);
      });
  }

  static receive(event: PacketReceiveEvent): void {
    const addonId = event.packet.addon;
    const bridge = Bridge.all.get(addonId);
    if (!bridge) return; // No bridge in this pack.
    const request = event.packet as BridgeRequest;
    const dispatch = (): unknown | Promise<unknown> => {
      const methodName = `receive_${request.method}`;
      const func = bridge[methodName as keyof Bridge];
      if (typeof func !== "function") return { error: true, code: "UNKNOWN_METHOD", message: `Unknown method '${request.method}'.` };
      (func as Function).bind(bridge)(event, request);
      return event.response;
    };

    if (!bridge.options.authorize) {
      event.response = dispatch();
      return;
    }
    event.response = Promise.resolve(bridge.options.authorize(request, event.sender)).then((allowed) => {
      if (!allowed) return { error: true, code: "UNAUTHORIZED", message: "Bridge request was not authorized." };
      return dispatch();
    });
  }

  private static versionsCompatible(requested: string, available: string): boolean {
    const major = (version: string): string | undefined => version.replace(/^[~^]/, "").match(/^\d+/)?.[0];
    return major(requested) !== undefined && major(requested) === major(available);
  }
}

function setup() {
  PacketEvents.receive.subscribe(Bridge.receive, { namespaces: ["bridge"] });
}

setup();
