import { BlockComponentTickEvent, BlockCustomComponent, CustomComponentParameters, Player } from "@minecraft/server";
import { object, Struct } from "superstruct";

import { AddonUtils } from "../utils/addon";
import { BlockBaseComponent, NearbyEntityBlockEvent } from "./base";

export interface ClimbableComponentOptions {}

export class ClimbableComponent extends BlockBaseComponent implements BlockCustomComponent {
  static readonly componentId = AddonUtils.makeId("climbable");
  struct: Struct<any, any> = object({});

  /**
   * Climbable block behavior.
   *
   * Requires `minecraft:tick`
   */
  constructor() {
    super();
    this.onTick = this.onTick.bind(this);
  }

  // EVENTS

  onNearbyEntityTick(event: NearbyEntityBlockEvent, args: CustomComponentParameters): void {
    const vel = event.entity.getVelocity();
    event.entity.applyKnockback({ x: 0, z: 0 }, 0.08);
    const jumping = event.entity instanceof Player ? event.entity.isJumping : true;
    if (jumping) {
      event.entity.applyImpulse({
        x: vel.x,
        y: 0.2,
        z: vel.z,
      });
    }
  }

  onTick(event: BlockComponentTickEvent, args: CustomComponentParameters) {
    super.enterLeaveTick(event, args);
  }
}
