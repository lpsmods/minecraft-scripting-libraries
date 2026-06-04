import {
  Block,
  BlockComponentOnPlaceEvent,
  BlockComponentTickEvent,
  BlockCustomComponent,
  CustomComponentParameters,
} from "@minecraft/server";
import { Identifier, MathUtils } from "@lpsmods/mc-common";
import { create, defaulted, number, object, optional, Struct, string, min } from "superstruct";

import { AddonUtils } from "../utils/addon";
import { isBlock } from "../validation";
import { BlockBaseComponent, NeighborUpdateEvent } from "./base";
import { BlockUtils } from "../block/utils";

/**
 * Options for configuring the sponge.
 */
export interface SpongeOptions {
  block?: string;
  liquid_block: string;
  air_block: string;
  size: number;
  sound_event: string;
}

/**
 * Custom component that implements sponge behavior.
 */
export class SpongeComponent extends BlockBaseComponent implements BlockCustomComponent {
  static readonly componentId = AddonUtils.makeId("sponge");
  struct: Struct<any, any> = object({
    block: optional(isBlock),
    liquid_block: defaulted(isBlock, "water"),
    air_block: defaulted(isBlock, "air"),
    size: defaulted(min(number(), 1), 7),
    sound_event: defaulted(string(), "random.toast"), // TODO: use correct sound.
  });

  /**
   * Vanilla sponge block behavior.
   *
   * Requires `minecraft:tick`
   */
  constructor() {
    super();
    this.onPlace = this.onPlace.bind(this);
    this.onTick = this.onTick.bind(this);
  }

  getWetBlock(block: Block, options: SpongeOptions): string {
    const id = Identifier.parse(block.typeId);
    return options.block ?? id.prefix("wet_").toString();
  }

  // TODO: Only replace water that is touching the sponge.
  // Replace water with air
  absorbLiquid(block: Block, options: SpongeOptions): boolean | undefined {
    return MathUtils.taxicabDistance<boolean>(block.location, options.size ?? 7, (pos) => {
      const blk = block.dimension.getBlock(pos);
      if (blk?.matches(options.liquid_block ?? "water")) {
        blk.setType(options.air_block ?? "air");
        return true;
      }
      return undefined;
    });
  }

  checkLiquid(block: Block, options: SpongeOptions): void {
    const bool = this.absorbLiquid(block, options);
    if (!bool) return;
    BlockUtils.setType(block, this.getWetBlock(block, options));
  }

  // EVENTS

  onTick(event: BlockComponentTickEvent, args: CustomComponentParameters): void {
    super.neighborTick(event, args);
  }

  onPlace(event: BlockComponentOnPlaceEvent, args: CustomComponentParameters): void {
    const options = create(args.params, this.struct) as SpongeOptions;
    this.checkLiquid(event.block, options);
  }

  onNeighborUpdate(event: NeighborUpdateEvent, args: CustomComponentParameters): void {
    const options = create(args.params, this.struct) as SpongeOptions;
    this.checkLiquid(event.block, options);
  }
}
