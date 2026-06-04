import {
  Block,
  BlockComponentPlayerInteractEvent,
  BlockComponentRedstoneUpdateEvent,
  BlockCustomComponent,
  CustomComponentParameters,
} from "@minecraft/server";
import { defaulted, number, object, string, Struct } from "superstruct";

import { AddonUtils } from "../utils/addon";
import { ItemUtils } from "../item";
import { BlockUtils } from "../block/utils";

/**
 * Options for configuring the tnt block.
 */
export interface TntBlockOptions {
  entity: string;
  y_rotation_offset: number;
}

/**
 * Custom component that implements tnt block behavior.
 */
export class TntBlockComponent implements BlockCustomComponent {
  static readonly componentId = AddonUtils.makeId("tnt");
  struct: Struct<any, any> = object({
    entity: defaulted(string(), "tnt"),
    y_rotation_offset: defaulted(number(), 0),
  });

  /**
   * Vanilla time detector block behavior. (like; daylight detector)
   *
   * Requires `minecraft:redstone_consumer`
   */
  constructor() {
    this.onPlayerInteract = this.onPlayerInteract.bind(this);
    this.onRedstoneUpdate = this.onRedstoneUpdate.bind(this);
  }

  ignite(block: Block, options: TntBlockOptions): void {
    const blockId = block.typeId; // Get ID before block change.
    const entity = BlockUtils.spawnBlockEntity(block, options.entity, {
      initialRotation: options.y_rotation_offset,
      removeBlock: true,
    });
    try {
      entity.triggerEvent(blockId);
    } catch (err) {}
  }

  // EVENTS

  onRedstoneUpdate(event: BlockComponentRedstoneUpdateEvent, args: CustomComponentParameters): void {
    const options = this.struct.create(args.params) as TntBlockOptions;
    this.ignite(event.block, options);
  }

  onPlayerInteract(event: BlockComponentPlayerInteractEvent, args: CustomComponentParameters): void {
    const options = this.struct.create(args.params) as TntBlockOptions;
    if (!event.player || !ItemUtils.useIgnitable(event.player)) return;
    this.ignite(event.block, options);
  }
}
