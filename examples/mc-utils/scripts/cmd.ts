import { PlaceCommand, CustomEffectCommand, CustomEnchantCommand, DataInspectorCommand } from "@lpsmods/mc-utils";
import { CustomCommandRegistry } from "@minecraft/server";

export function registerCommands(reg: CustomCommandRegistry): void {
  PlaceCommand.register(reg);
  CustomEffectCommand.register(reg);
  CustomEnchantCommand.register(reg);
  DataInspectorCommand.register(reg);
}
