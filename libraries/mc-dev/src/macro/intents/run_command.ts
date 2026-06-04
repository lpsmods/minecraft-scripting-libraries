import { Player } from "@minecraft/server";
import { MacroIntent, MacroIntentData } from "./base";

export class RunCommandIntent extends MacroIntent {
  static readonly intentId = "run_command";

  constructor() {
    super(RunCommandIntent.intentId, {
      name: "Run Command",
    });
  }

  execute(player: Player, options: MacroIntentData): void {
    if (options.command) player.runCommand(options.command);
  }
}

// Initialize
new RunCommandIntent();
