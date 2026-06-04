import { Player } from "@minecraft/server";
import { MacroIntent, MacroIntentData } from "./base";

/**
 * Provides toggle game mode intent behavior.
 */
export class ToggleGameModeIntent extends MacroIntent {
  static readonly intentId = "toggle_game_mode";

  constructor() {
    super(ToggleGameModeIntent.intentId, {
      name: "Toggle Game Mode",
    });
  }

  execute(player: Player, options: MacroIntentData): void {
    player.sendMessage("Action not implemented.");
  }
}

// Initialize
new ToggleGameModeIntent();
