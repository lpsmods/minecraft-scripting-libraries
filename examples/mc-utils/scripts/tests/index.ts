import { StartupEvent, system, world, WorldLoadAfterEvent } from "@minecraft/server";

// import early1 from "./ui/progress_bar";
import early10 from "./effect/custom";
import early11 from "./enchantment/custom";
import early12 from "./registry/index";
import early2 from "./area_detector";
import early3 from "./loot/block_loot_handler";
import early4 from "./loot/entity_loot_handler";
import early6 from "./entity/text_display";
import early7 from "./event/index";
import early8 from "./entity/entity_handler";
import early9 from "./entity/player_handler";

// import world1 from "./world/world_border";
// import world2 from "./drawer";
// import world3 from "./utils/text";
import world4 from "./settings";
import world5 from "./data/data_storage";
import world6, { cmd as cmd9 } from "./data/utils";

import startup1 from "./blockcomponent/index";
import startup2 from "./itemcomponent/index";

import cmd1 from "./ui/action_form";
import cmd2 from "./ui/modal_form";
import cmd3 from "./chunk/chunk_queue";
import cmd4 from "./queue";
import cmd7 from "./utils/molang";
import cmd8 from "./ui/paged_action_form";
import cmd10 from "./ui/message_box";
import cmd11 from "./ui/simple_dialog";
import { TestCommand } from "@lpsmods/mc-utils";
// import { TestCommand, unitTests } from "./command";
// import { RandomUtils } from "./utils/random";

// Add unit tests.
cmd1(TestCommand.unitTests);
cmd2(TestCommand.unitTests);
cmd3(TestCommand.unitTests);
cmd4(TestCommand.unitTests);
cmd7(TestCommand.unitTests);
cmd8(TestCommand.unitTests);
cmd9(TestCommand.unitTests);
cmd10(TestCommand.unitTests);
cmd11(TestCommand.unitTests);

export function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg || "Assertion failed");
  }
}

export function assertProperty(propName: string, value: any, matchValue: any = true) {
  return assert(value === matchValue, `${propName} failed! "${value}" != "${matchValue}"`);
}

function run() {
  //   early1();
  early2();
  early3();
  early4();
  early6();
  early7();
  early8();
  early9();
  early10();
  early11();
  early12();

  system.beforeEvents.startup.subscribe((event: StartupEvent) => {
    startup1(event.blockComponentRegistry);
    startup2(event.itemComponentRegistry);

    // Test command
    try {
      TestCommand.register(event.customCommandRegistry);
    } catch (err) {
      console.warn(err);
    }
  });

  world.afterEvents.worldLoad.subscribe((event: WorldLoadAfterEvent) => {
    // world1();
    // world2();
    // world3();
    world4();
    world5();
    world6();
  });
}

export function runAllTests() {
  console.warn("Running tests...");
  try {
    run();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("An error occurred:");
      console.error("Message:", err.message);
      console.error("Stack trace:", err.stack);
    } else {
      console.error("An unknown error occurred:", err);
    }
  }
}
