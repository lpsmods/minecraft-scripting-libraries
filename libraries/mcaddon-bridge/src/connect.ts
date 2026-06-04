import { Player } from "@minecraft/server";
import { Packet } from "./packet";
import { uuid } from "./utils";

export class Connection {
  readonly addonId: string;
  isConnected: boolean = false;

  constructor(addonId: string) {
    this.addonId = addonId;
  }

  /**
   * Pings the addon to check if it is available.
   *
   * This function can be called in early-execution mode.
   * @param {string} version
   * @returns {Promise<Connection>}
   */
  async connect(version?: string): Promise<Connection> {
    return new Promise((resolve, reject) => {
      const id = `bridge:${uuid()}`;
      const data = {
        method: "connect",
        addon: this.addonId,
        version,
      };
      Packet.sendSync(id, data)
        // Got response
        .then((packet) => {
          if (packet.body.error) return reject(new Error(packet.body.message ?? "Connection failed"));
          this.isConnected = true;
          resolve(this);
        })
        // Timed out
        .catch((err) => {
          console.error(`Connection timeout: ${String(err)}`);
        });
    });
  }

  async docs(player: Player): Promise<void> {
    return new Promise((resolve, reject) => {
      const id = `bridge:${uuid()}`;
      const data = {
        method: "docs",
        addon: this.addonId,
        player,
      };
      Packet.sendSync(id, data)
        .then((res) => {
          if (res.body.error) {
            reject(res.body.message);
            return;
          }
          resolve();
        })
        .catch((err) => {
          console.warn(`Failed to open docs: ${String(err)}`);
        });
    });
  }

  /**
   * Get a property.
   * @param {string} property
   * @returns {Promise<any>}
   */
  async get(property: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = `bridge:${uuid()}`;
      const data = {
        method: "get",
        addon: this.addonId,
        property,
      };
      Packet.sendSync(id, data)
        .then((packet) => {
          if (packet.get("body.error")) {
            reject(packet.get("body.message"));
            return;
          }
          // console.warn(packet);

          resolve(packet.get("body.value"));
        })
        .catch((err) => {
          console.warn(`Connection timeout: ${String(err)}`);
        });
    });
  }

  /**
   * Set a property.
   * @param {string} property
   * @param {any} value
   * @returns {Promise<void>}
   */
  async set(property: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const id = `bridge:${uuid()}`;
      const data = {
        method: "set",
        addon: this.addonId,
        property,
        value,
      };
      Packet.sendSync(id, data)
        .then((res) => {
          if (res.body.error) {
            reject(res.body.message);
            return;
          }
          resolve();
        })
        .catch((err) => {
          console.warn(`Connection timeout: ${String(err)}`);
        });
    });
  }

  /**
   * Whether or not the property exists.
   * @param {string} property
   * @returns {Promise<void>}
   */
  async has(property: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const id = `bridge:${uuid()}`;
      const data = {
        method: "has",
        addon: this.addonId,
        property,
      };
      Packet.sendSync(id, data)
        .then((res) => {
          if (res.body.error) {
            reject(res.body.message);
            return;
          }
          resolve(res.body.value);
        })
        .catch((err) => {
          console.warn(`Connection timeout: ${String(err)}`);
        });
    });
  }

  /**
   * CAll a function on an object.
   * @param {string} property
   * @param {...any} args
   * @returns {Promise<any>}
   */
  async call(property: string, ...args: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = `bridge:${uuid()}`;
      const data = {
        method: "call",
        addon: this.addonId,
        property,
        args,
      };
      Packet.sendSync(id, data)
        .then((res) => {
          if (res.body.error) {
            reject(res.body.message);
            return;
          }
          resolve(res.body.value);
        })
        .catch((err) => {
          console.warn(`Connection timeout: ${String(err)}`);
        });
    });
  }
}

/**
 * Connect to an addon.
 * @param {string} addonId
 * @param {string} version
 * @returns {Promise<Connection>}
 */
export function connect(addonId: string, version?: string): Promise<Connection> {
  const c = new Connection(addonId);
  return c.connect(version);
}
