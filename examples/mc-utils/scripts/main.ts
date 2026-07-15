import { StartupEvent, system } from "@minecraft/server";
import { registerBlocks } from "./block";
import { registerItems } from "./item";
import { registerCommands } from "./cmd";
import "./entity/index";
// import "./feature.js";
import "./registry";
import { runAllTests } from "./tests/index";
import { setup } from "@lpsmods/mc-utils";

setup();
runAllTests();

function startup(event: StartupEvent): void {
  registerBlocks(event.blockComponentRegistry);
  registerItems(event.itemComponentRegistry);
  registerCommands(event.customCommandRegistry);
}

system.beforeEvents.startup.subscribe(startup);

// Dynamic light test
// function spawned(event: PlayerSpawnAfterEvent): void {
//   new DynamicLight(event.player);
// }
// world.afterEvents.playerSpawn.subscribe(spawned);
