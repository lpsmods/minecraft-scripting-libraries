import {
  Block,
  BlockComponentOnPlaceEvent,
  BlockComponentTickEvent,
  BlockCustomComponent,
  CustomComponentParameters,
  Direction,
} from "@minecraft/server";
import { defaulted, number, object, Struct } from "superstruct";

import { BlockBaseComponent, NeighborUpdateEvent } from "./base";
import { FallingBlockEvent, FallingBlockHandler } from "../entity/falling_block_handler";
import { AddonUtils } from "../utils/addon";
import { isEntity } from "../validation";

export interface FallingBlockOptions {
  entity: string;
  y_rotation_offset: number;
}

export class FallingBlockComponent extends BlockBaseComponent implements BlockCustomComponent {
  static readonly componentId = AddonUtils.makeId("falling_block");
  struct: Struct<any, any> = object({
    entity: isEntity,
    y_rotation_offset: defaulted(number(), 0),
  });

  /**
   * Vanilla falling block behavior.
   *
   * Requires `minecraft:tick`
   */
  constructor() {
    super();
    this.onTick = this.onTick.bind(this);
    this.onPlace = this.onPlace.bind(this);
  }

  fall(block: Block, args: CustomComponentParameters): void {
    const options = this.struct.create(args.params) as FallingBlockOptions;
    FallingBlockHandler.create(this, block, options);
  }

  // CUSTOM EVENTS

  /**
   * This function will be called when the block falls.
   * @param {FallingBlockEvent} event
   * @param {CustomComponentParameters} args
   */
  onFall?(event: FallingBlockEvent, args: CustomComponentParameters): void;

  /**
   * This function will be called when the block has landed.
   * @param {FallingBlockEvent} event
   * @param {CustomComponentParameters} args
   */
  onLand?(event: FallingBlockEvent, args: CustomComponentParameters): void;

  // EVENTS

  onNeighborUpdate(event: NeighborUpdateEvent, args: CustomComponentParameters): void {
    if (event.direction !== Direction.Down) return;
    if (!event.sourceBlock.isAir) return;
    this.fall(event.block, args);
  }

  onTick(event: BlockComponentTickEvent, args: CustomComponentParameters): void {
    this.neighborTick(event, args);
  }

  onPlace(event: BlockComponentOnPlaceEvent, args: CustomComponentParameters): void {
    const down = event.block.below();
    if (!down || !down.isAir) return;
    this.fall(event.block, args);
  }
}
