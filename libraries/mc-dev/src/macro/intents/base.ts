import { Player } from "@minecraft/server";

export interface MacroIntentData {
  type: "run_command" | "toggle_game_mode" | string;
  command?: string;
}

export interface MacroIntentOptions {
  name?: string;
}

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
