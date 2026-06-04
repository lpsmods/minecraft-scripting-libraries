import {
  Block,
  CustomComponentParameters,
  BlockCustomComponent,
  BlockComponentRedstoneUpdateEvent,
} from "@minecraft/server";
import { BlockStateSuperset } from "@minecraft/vanilla-data";
import { MathUtils } from "@lpsmods/mc-common";
import { create, defaulted, number, object, string, Struct } from "superstruct";

import { BlockBaseComponent } from "./base";
import { AddonUtils } from "../utils/addon";
import { BlockUtils } from "../block/utils";

/**
 * Options for configuring the redstone lamp.
 */
export interface RedstoneLampOptions {
  lit_state: keyof BlockStateSuperset;
  delay: number;
}

/**
 * Custom component that implements redstone lamp behavior.
 */
export class RedstoneLampComponent extends BlockBaseComponent implements BlockCustomComponent {
  static readonly componentId = AddonUtils.makeId("redstone_lamp");
  struct: Struct<any, any> = object({
    lit_state: defaulted(string(), "mcutils:lit"),
    delay: defaulted(number(), 0),
  });

  /**
   * Vanilla redstone lamp block behavior.
   *
   * Requires `minecraft:redstone_consumer`
   */
  constructor() {
    super();
    this.onRedstoneUpdate = this.onRedstoneUpdate.bind(this);
  }

  updateNeighbors(block: Block, value: boolean, options: RedstoneLampOptions): void {
    MathUtils.taxicabDistance(block.location, 1, (pos) => {
      const blk = block.dimension.getBlock(pos);
      if (!blk || blk.typeId != block.typeId) return;
      BlockUtils.setState(blk, options.lit_state, value);
    });
  }

  // EVENTS

  onRedstoneUpdate(event: BlockComponentRedstoneUpdateEvent, args: CustomComponentParameters): void {
    const options = create(args.params, this.struct) as RedstoneLampOptions;
    if (!event.powerLevel) {
      return this.updateNeighbors(event.block, false, options);
    }
    this.updateNeighbors(event.block, true, options);
  }
}
