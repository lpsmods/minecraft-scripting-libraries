import { BlockComponentTickEvent, BlockCustomComponent, CustomComponentParameters, world } from "@minecraft/server";
import { object, Struct } from "superstruct";

import { AddonUtils } from "../utils/addon";
import { BlockBaseComponent, NearbyEntityBlockEvent } from "./base";

/**
 * Options for configuring the block portal.
 */
export interface BlockPortalOptions {
  dimensionId: string;
}

/**
 * Custom component that implements block portal behavior.
 */
export class BlockPortalComponent extends BlockBaseComponent implements BlockCustomComponent {
  static readonly componentId = AddonUtils.makeId("portal");
  struct: Struct<any, any> = object({});

  /**
   * Portal block behavior.
   */
  constructor() {
    super();
    this.onTick = this.onTick.bind(this);
  }

  // Events

  onNearbyEntityTick(event: NearbyEntityBlockEvent, args: CustomComponentParameters): void {
    const options = this.struct.create(args.params) as BlockPortalOptions;
    const dimension = world.getDimension(options.dimensionId ?? "overworld");
    event.entity.teleport({ x: 0, y: 0, z: 0 }, { dimension });
  }

  onTick(event: BlockComponentTickEvent, args: CustomComponentParameters) {
    super.enterLeaveTick(event, args);
  }
}
