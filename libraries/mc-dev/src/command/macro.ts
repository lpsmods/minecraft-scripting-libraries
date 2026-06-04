import {
  CommandPermissionLevel,
  CustomCommand,
  CustomCommandOrigin,
  CustomCommandRegistry,
  CustomCommandResult,
} from "@minecraft/server";
import { DeveloperTools } from "../developer_tools";
import { Macros } from "../macro";
import { CustomCommandUtils } from "@lpsmods/mc-utils";

/**
 * Command implementation for macro.
 */
export class MacroCommand {
  private static registered: boolean = false;

  static execute(macro: number, ctx: CustomCommandOrigin): CustomCommandResult | undefined {
    const player = CustomCommandUtils.getPlayer(ctx);
    Macros.execute(macro, player);
    return undefined;
  }

  static register(registry: CustomCommandRegistry): void {
    if (this.registered) return;
    for (let i = 1; i <= 10; i++) {
      const namespace = DeveloperTools.instance?.devOptions.namespace ?? "mcdev";
      const options: CustomCommand = {
        name: `${namespace}:macro${i}`,
        description: `Run macro ${i}.`,
        permissionLevel: CommandPermissionLevel.Admin,
      };
      registry.registerCommand(options, (ctx) => MacroCommand.execute(i, ctx));
    }
    this.registered = true;
  }
}
