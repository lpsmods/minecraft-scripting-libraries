import { Player, WorldLoadAfterEvent } from "@minecraft/server";
import { ChunkTickEvent, EntityTickEvent, PlayerChunkLoadEvent, PlayerChunkUnloadEvent } from "@lpsmods/mc-utils";
import { Settings } from "@lpsmods/mc-common";

/**
 * Options for configuring the dev tool.
 */
export interface DevToolOptions {
  name?: string;
  description?: string;
  icon?: string;
}

class DevToolSettings extends Settings {
  tool: DevTool;

  constructor(id: string, tool: DevTool) {
    super(id);
    this.tool = tool;
    this.defineProperty("enabled", {
      type: "boolean",
      value: false,
      title: `Enable ${this.tool.options.name ?? this.tool.id}`,
    });
  }

  update(data: { [key: string]: any }): void {
    super.update(data);

    if (data.enabled) {
      this.tool.enable();
    } else {
      this.tool.disable();
    }
  }
}

/**
 * Provides dev tool behavior.
 */
export abstract class DevTool {
  static all = new Map<string, DevTool>();

  readonly id: string;
  options: DevToolOptions;
  store: Settings;

  constructor(id: string, options?: DevToolOptions) {
    this.id = id;
    this.options = options ?? {};
    DevTool.all.set(id, this);
    this.store = new DevToolSettings(`dev:${this.id}`, this);
    this.buildSettings(this.store);
  }

  get isEnabled(): boolean {
    return this.store.get("enabled") ?? false;
  }

  show(player: Player): void {
    this.store.show(player, this.options.name ?? this.id);
  }

  load(event: WorldLoadAfterEvent): void {
    if (this.onLoad) this.onLoad(event);
    if (this.isEnabled) {
      this.enable();
    }
  }

  /**
   * Enable this tool.
   * @param {Player} player
   */
  enable(player?: Player): void {
    if (this.onEnable) this.onEnable(player);
  }

  /**
   * Disable this tool.
   * @param {Player} player
   */
  disable(player?: Player): void {
    if (this.onDisable) this.onDisable(player);
  }

  // Events

  onTick?(event: EntityTickEvent): void;

  onChunkLoad?(event: PlayerChunkLoadEvent): void;

  onChunkUnload?(event: PlayerChunkUnloadEvent): void;

  onChunkTick?(event: ChunkTickEvent): void;

  onEnable?(player?: Player): void;

  onDisable?(player?: Player): void;

  onLoad?(event: WorldLoadAfterEvent): void;

  // Hooks

  buildSettings(settings: Settings): void {}
}
