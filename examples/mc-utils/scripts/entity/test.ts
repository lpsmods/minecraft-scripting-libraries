import { EntitySpawnAfterEvent } from "@minecraft/server";
import { EntityHandler } from "@lpsmods/mc-utils";

class Test extends EntityHandler {
  constructor() {
    super({ type: "lpsmods:test" });
    this.onSpawn = this.onSpawn.bind(this);
  }

  onSpawn(event: EntitySpawnAfterEvent): void {
    const entity = event.entity;
    const equ = entity.getComponent("equippable"); // item, inventory
    // if (!equ) return;
    console.warn(JSON.stringify(entity.getComponents()));
  }
}

new Test();
