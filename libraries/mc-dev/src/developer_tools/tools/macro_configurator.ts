import { Player } from "@minecraft/server";
import { DevTool } from "./base";
import { Macros } from "../../macro";

class MacroConfiguratorTool extends DevTool {
  static readonly toolId = "macro_configurator";

  constructor() {
    super(MacroConfiguratorTool.toolId, {
      name: "Macro Configurator",
      description: "Configure your macro commands.\n",
    });
  }

  show(player: Player): void {
    Macros.show(player, this.options.name, this.options.description);
  }
}

// Initialize
new MacroConfiguratorTool();
