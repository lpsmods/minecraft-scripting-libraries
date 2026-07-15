import { world } from "@minecraft/server";
// import world1 from "./data/utils.test";
// import world2 from "./data/utils.test";
import world3 from "./typing.test";

function run(): void {
  world.afterEvents.worldLoad.subscribe((event) => {
    // world1();
    // world2();
    world3();
  });
}

export function runAllTests(): void {
  console.warn("Running tests...");
  try {
    run();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`An error occurred:`);
      console.error("Message:", err.message);
      console.error("Stack trace:", err.stack);
    } else {
      console.error("An unknown error occurred:", err);
    }
  }
}
