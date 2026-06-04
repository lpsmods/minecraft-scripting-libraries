// TODO: Implement

import { Block, Dimension } from "@minecraft/server";
import { EventSignal } from "@lpsmods/mc-common";

let initialized = false;

/**
 * Event payload for block callbacks.
 */
export abstract class BlockEvent {
  constructor(block: Block, dimension?: Dimension) {
    this.block = block;
    this.dimension = dimension ?? block.dimension;
    if (!initialized) init();
  }

  readonly block: Block;
  readonly dimension: Dimension;
}

/**
 * Event payload for block nearby entity tick callbacks.
 */
export class BlockNearbyEntityTickEvent extends BlockEvent {}

/**
 * Event payload for block neighbor update callbacks.
 */
export class BlockNeighborUpdateEvent extends BlockEvent {}

/**
 * Event signal for subscribing to block nearby entity tick events.
 */
export class BlockNearbyEntityTickEventSignal extends EventSignal<BlockNearbyEntityTickEvent> {
  constructor() {
    super();
  }
}
/**
 * Event signal for subscribing to block neighbor update events.
 */
export class BlockNeighborUpdateEventSignal extends EventSignal<BlockNeighborUpdateEvent> {
  constructor() {
    super();
  }
}
/**
 * Custom block events.
 */
export class BlockEvents {
  private constructor() {}

  /**
   * This event fires every tick a entity is near a block.
   * @eventProperty
   */
  static readonly nearbyEntityTick = new BlockNearbyEntityTickEventSignal();

  /**
   * This event fires when a block has updated.
   * @eventProperty
   */
  static readonly neighborUpdate = new BlockNeighborUpdateEventSignal();

  static get size(): number {
    return this.nearbyEntityTick.size + this.neighborUpdate.size;
  }
}

function init() {
  initialized = true;
}
