import { BlockComponentRedstoneUpdateEvent, BlockCustomComponent, CustomComponentParameters } from "@minecraft/server";
import { BlockStateSuperset } from "@minecraft/vanilla-data";
import { create, defaulted, object, string, Struct } from "superstruct";

import { BlockBaseComponent } from "./base";
import { BlockUtils } from "../block/utils";
import { AddonUtils } from "../utils/addon";

/**
 * Options for configuring the copper bulb.
 */
export interface CopperBulbOptions {
  lit_state: keyof BlockStateSuperset;
  powered_state: keyof BlockStateSuperset;
}

/**
 * Custom component that implements copper bulb behavior.
 */
export class CopperBulbComponent extends BlockBaseComponent implements BlockCustomComponent {
  static readonly componentId = AddonUtils.makeId("copper_bulb");
  struct: Struct<any, any> = object({
    lit_state: defaulted(string(), "mcutils:lit"),
    powered_state: defaulted(string(), "mcutils:powered"),
  });

  /**
   * Vanilla copper bulb block behavior.
   *
   * Requires `minecraft:redstone_consumer`
   */
  constructor() {
    super();
    this.onRedstoneUpdate = this.onRedstoneUpdate.bind(this);
  }

  // EVENTS

  onRedstoneUpdate(event: BlockComponentRedstoneUpdateEvent, args: CustomComponentParameters): void {
    const options = create(args.params, this.struct) as CopperBulbOptions;
    const lit = event.block.permutation.getState(options.lit_state);
    if (!event.powerLevel) {
      return BlockUtils.setState(event.block, options.powered_state, false);
    }
    BlockUtils.setState(event.block, options.powered_state, true);
    BlockUtils.setState(event.block, options.lit_state, !lit);
  }
}
