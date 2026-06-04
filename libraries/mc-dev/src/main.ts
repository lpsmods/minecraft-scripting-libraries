import { StartupEvent, system } from "@minecraft/server";
import { DevCommand, MacroCommand } from "./command";
import { DeveloperTools } from "./developer_tools";

export function initializeDev(environment: string = "development", namespace: string = "mcdev"): void {
  if (environment !== "development") return;
  // Initialize
  const devTools = new DeveloperTools({ namespace: namespace });

  // Register command.
  function startup(event: StartupEvent): void {
    DevCommand.register(event.customCommandRegistry);
    MacroCommand.register(event.customCommandRegistry);
  }

  system.beforeEvents.startup.subscribe(startup);
}
