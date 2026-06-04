import { Player } from "@minecraft/server";

/**
 * Interface describing a macro intent data.
 */
export interface MacroIntentData {
  type: "run_command" | "toggle_game_mode" | string;
  command?: string;
}

/**
 * Options for configuring the macro intent.
 */
export interface MacroIntentOptions {
  name?: string;
}

/**
 * Provides macro intent behavior.
 */
export abstract class MacroIntent {
  static all = new Map<string, MacroIntent>();

  readonly id: string;
  options: MacroIntentOptions;

  constructor(id: string, options: MacroIntentOptions) {
    this.id = id;
    this.options = options;
    MacroIntent.all.set(this.id, this);
  }

  abstract execute(player: Player, options: MacroIntentData): void;
}
