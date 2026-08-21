import { Player } from "@minecraft/server";
import { BridgeNotFoundError, BridgeProtocolError, BridgeRemoteError, BridgeVersionError } from "./errors";
import { Packet } from "./packet";
import { BRIDGE_PROTOCOL_VERSION, BridgeRequest, BridgeResponse } from "./protocol";
import { uuid } from "./utils";

export interface ConnectionOptions {
  /** Compatible API version requested from the remote bridge. */
  version?: string;
  /** Number of game ticks before each request rejects. Set to 0 to disable. */
  timeoutTicks?: number;
}

/** Provides connection behavior. */
export class Connection {
  readonly addonId: string;
  readonly options: ConnectionOptions;
  isConnected = false;
  remoteVersion?: string;

  constructor(addonId: string, options: ConnectionOptions = {}) {
    this.addonId = addonId;
    this.options = options;
  }

  async connect(version = this.options.version): Promise<Connection> {
    const response = await this.request({ method: "connect", version });
    this.isConnected = true;
    this.remoteVersion = response.version;
    return this;
  }

  disconnect(): void {
    this.isConnected = false;
  }

  async docs(player: Player): Promise<void> {
    await this.request({ method: "docs", player });
  }

  async get<T = unknown>(property: string): Promise<T> {
    const response = await this.request<T>({ method: "get", property });
    return response.value as T;
  }

  async set<T = unknown>(property: string, value: T): Promise<void> {
    await this.request({ method: "set", property, value });
  }

  async has(property: string): Promise<boolean> {
    const response = await this.request<boolean>({ method: "has", property });
    return response.value === true;
  }

  async call<T = unknown>(property: string, ...args: unknown[]): Promise<T> {
    const response = await this.request<T>({ method: "call", property, args });
    return response.value as T;
  }

  private async request<T = unknown>(request: Omit<BridgeRequest, "addon" | "protocolVersion">): Promise<BridgeResponse<T>> {
    const id = `bridge:${uuid()}`;
    const response = await Packet.sendSync<BridgeResponse<T>>(
      id,
      { ...request, addon: this.addonId, protocolVersion: BRIDGE_PROTOCOL_VERSION },
      { timeoutTicks: this.options.timeoutTicks },
    );

    if (!response || typeof response !== "object" || typeof response.error !== "boolean") {
      throw new BridgeProtocolError("The remote bridge returned an invalid response.", {
        addonId: this.addonId,
        method: request.method,
        id,
      });
    }
    if (response.error) this.throwRemoteError(response, request.method, id);
    return response;
  }

  private throwRemoteError(response: BridgeResponse, method: string, id: string): never {
    const message = response.message ?? "Remote bridge request failed.";
    if (response.code === "NOT_FOUND") throw new BridgeNotFoundError(this.addonId);
    if (response.code === "VERSION_MISMATCH") {
      throw new BridgeVersionError(this.options.version ?? "unknown", response.version ?? "unknown");
    }
    throw new BridgeRemoteError(message, { addonId: this.addonId, method, id, remoteCode: response.code });
  }
}

export function connect(addonId: string, version?: string): Promise<Connection>;
export function connect(addonId: string, options?: ConnectionOptions): Promise<Connection>;
export function connect(addonId: string, versionOrOptions?: string | ConnectionOptions): Promise<Connection> {
  const options = typeof versionOrOptions === "string" ? { version: versionOrOptions } : (versionOrOptions ?? {});
  return new Connection(addonId, options).connect();
}
