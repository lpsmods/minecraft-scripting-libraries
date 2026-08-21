/** Base error for mcaddon-bridge failures. */
export class BridgeError extends Error {
  constructor(message: string, readonly code: string, readonly details?: Record<string, unknown>) {
    super(message);
    this.name = new.target.name;
  }
}

export class BridgeTimeoutError extends BridgeError {
  constructor(id: string, timeoutTicks: number) {
    super(`Request "${id}" timed out after ${timeoutTicks} ticks.`, "TIMEOUT", { id, timeoutTicks });
  }
}

export class BridgeNotFoundError extends BridgeError {
  constructor(addonId: string) {
    super(`Bridge "${addonId}" was not found.`, "NOT_FOUND", { addonId });
  }
}

export class BridgeRemoteError extends BridgeError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "REMOTE_ERROR", details);
  }
}

export class BridgeProtocolError extends BridgeError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "PROTOCOL_ERROR", details);
  }
}

export class BridgeVersionError extends BridgeError {
  constructor(requested: string, available: string) {
    super(`Bridge version ${available} is incompatible with requested version ${requested}.`, "VERSION_MISMATCH", {
      requested,
      available,
    });
  }
}
