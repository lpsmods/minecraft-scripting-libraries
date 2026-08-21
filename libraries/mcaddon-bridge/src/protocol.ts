export const BRIDGE_PROTOCOL_VERSION = 1;

export type BridgeMethod = "connect" | "docs" | "get" | "set" | "has" | "call";

export interface BridgeRequest {
  method: BridgeMethod;
  addon: string;
  version?: string;
  protocolVersion?: number;
  property?: string;
  value?: unknown;
  args?: unknown[];
  player?: unknown;
}

export interface BridgeResponse<T = unknown> {
  error: boolean;
  message?: string;
  code?: string;
  value?: T;
  addon?: string;
  version?: string;
  protocolVersion?: number;
}
