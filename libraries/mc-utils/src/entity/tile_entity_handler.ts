import { Block, Entity, EntityDieAfterEvent } from "@minecraft/server";

import { EntityHandler } from "./entity_handler";
import { EntityTickEvent } from "../event";

/**
 * Event payload for tile entity callbacks.
 */
export class TileEntityEvent {
  constructor(entity: Entity, block: Block) {
    this.entity = entity;
    this.block = block;
  }

  readonly entity: Entity;
  readonly block: Block;
}

/**
 * Event payload for tile entity tick callbacks.
 */
export class TileEntityTickEvent extends TileEntityEvent {}

/**
 * Handler for tile entity.
 */
export class TileEntityHandler extends EntityHandler {
  constructor(entity: string) {
    super({ type: entity });
    this.onDie = this.onDie.bind(this);
    this.onTick = this.onTick.bind(this);
  }

  /**
   * Get the block for this tile.
   * @param {Entity} entity
   * @returns {Block|undefined}
   */
  getBlock(entity: Entity): Block | undefined {
    return entity.dimension.getBlock(entity.location);
  }

  // EVENTS

  onDie(event: EntityDieAfterEvent): void {
    event.deadEntity.dimension.setBlockType(event.deadEntity.location, "air");
  }

  onTick(event: EntityTickEvent): void {
    const blockName = event.entity.getDynamicProperty("common:tile.block") as string;
    if (!blockName) return;
    const block = event.entity.dimension.getBlock(event.entity.location);
    if (!block) return;
    if (block.matches(blockName)) return event.entity.remove();
    if (this.onTileTick) this.onTileTick(new TileEntityTickEvent(event.entity, block));
  }

  onTileTick?(event: TileEntityTickEvent): void;
}
