import {
  Block,
  BlockComponentTickEvent,
  Direction,
  BlockComponentOnPlaceEvent,
  CustomComponentParameters,
  Entity,
  Vector3,
} from "@minecraft/server";
import { DataStorageOptions, Hasher, DynamicStorage } from "@lpsmods/mc-common";
import { Vector2Utils, VECTOR3_ZERO } from "@minecraft/math";
import { Struct, object } from "superstruct";

import { BlockUtils } from "../block/utils";
import { BlockEvent } from "../event/block";
import { EntityEnterBlockEvent, EntityInBlockTickEvent, EntityLeaveBlockEvent } from "../event";
import { DirectionUtils } from "../utils/direction";

export class NeighborUpdateEvent extends BlockEvent {
  constructor(block: Block, sourceBlock: Block, direction?: Direction) {
    super(block);
    this.sourceBlock = sourceBlock;
    this.direction = direction;
  }

  /**
   * The block that was updated next to `block`
   */
  readonly sourceBlock: Block;

  /**
   * The direction the update came from.
   */
  readonly direction?: Direction;
}

export class NearbyEntityBlockEvent extends BlockEvent {
  constructor(block: Block, entity: Entity) {
    super(block);
    this.entity = entity;
  }

  /**
   * The nearby entity.
   */
  readonly entity: Entity;
}

export class ScheduledBlockEvent extends BlockEvent {}

export interface ScheduledEvent {
  callback: (event: ScheduledBlockEvent, args: CustomComponentParameters) => void;
  timeLeft: number;
  totalTimeLeft: number;
  block: Block;
}

/**
 * Custom block component containing additional block events.
 */
export abstract class BlockBaseComponent {
  static readonly componentId: string;

  static components: BlockBaseComponent[] = [];
  private scheduledEvents = new Set<ScheduledEvent>();
  private storageCache = new Map<string, DynamicStorage>();
  struct: Struct<any, any> = object({});

  constructor() {}

  // #region Dynamic Properties

  /**
   * Get the data storage used for the block.
   * @param {Block} block
   * @param {number} formatVersion
   * @param {DataStorageOptions} options
   * @returns {DynamicStorage}
   */
  getStorage(block: Block, formatVersion?: number, options?: DataStorageOptions): DynamicStorage {
    const k = `${block.dimension.id},${Vector2Utils.toString(block.location)}`;
    const cached = this.storageCache.get(k);
    if (!cached) {
      const store = BlockUtils.getStorage(block, formatVersion, options);
      this.storageCache.set(k, store);
      return store;
    }
    return cached;
  }

  /**
   * @remarks
   * Clears all dynamic properties that have been set on this
   * block.
   *
   * @throws This function can throw errors.
   */
  clearDynamicProperties(block: Block): void {
    BlockUtils.clearDynamicProperties(block);
  }

  /**
   * @remarks
   * Returns a property value.
   *
   * @param identifier
   * The property identifier.
   * @returns
   * Returns the value for the property, or undefined if the
   * property has not been set.
   * @throws This function can throw errors.
   */
  getDynamicProperty(block: Block, identifier: string): boolean | number | string | Vector3 | undefined {
    return BlockUtils.getDynamicProperty(block, identifier);
  }

  /**
   * @remarks
   * Returns the available set of dynamic property identifiers
   * that have been used on this block.
   *
   * @returns
   * A string array of the dynamic properties set on this block.
   * @throws This function can throw errors.
   */
  getDynamicPropertyIds(block: Block): string[] {
    return BlockUtils.getDynamicPropertyIds(block);
  }

  /**
   * @remarks
   * Returns the total size, in bytes, of all the dynamic
   * properties that are currently stored for this block. This
   * includes the size of both the key and the value.  This can
   * be useful for diagnosing performance warning signs - if, for
   * example, a block has many megabytes of associated dynamic
   * properties, it may be slow to load on various devices.
   *
   * @throws This function can throw errors.
   */
  getDynamicPropertyTotalByteCount(block: Block): number {
    return BlockUtils.getDynamicPropertyTotalByteCount(block);
  }

  /**
   * @remarks
   * Sets a specified property to a value.
   *
   * @param identifier
   * The property identifier.
   * @param value
   * Data value of the property to set.
   * @throws This function can throw errors.
   */
  setDynamicProperty(block: Block, identifier: string, value?: boolean | number | string | Vector3): void {
    BlockUtils.setDynamicProperty(block, identifier, value);
  }

  // #endregion

  destroy = BlockUtils.destroy;

  baseTick(event: BlockComponentTickEvent, args: CustomComponentParameters): void {
    this.afterTick(event, args);
    this.enterLeaveTick(event, args);
    this.neighborTick(event, args);
  }

  basePlace(event: BlockComponentOnPlaceEvent, args: CustomComponentParameters): void {
    if (event.block.isAir) return;
    for (const direction in Direction) {
      const sourceBlock = event.block.offset(DirectionUtils.toOffset(direction));
      if (!sourceBlock) continue;
      const updateEvent = new NeighborUpdateEvent(event.block, sourceBlock, direction as Direction);
      if (this.onNeighborUpdate) this.onNeighborUpdate(updateEvent, args);
    }
  }

  isInBlock(block: Block, entity: Entity): boolean {
    return (
      Math.floor(entity.location.x) == block.location.x &&
      Math.floor(entity.location.y) == block.location.y &&
      Math.floor(entity.location.z) == block.location.z
    );
  }

  // TODO: Tick is per block instance (more blocks screws w/ timing)
  afterTick(event: BlockComponentTickEvent, args: CustomComponentParameters): void {
    for (const e of this.scheduledEvents) {
      if (e.timeLeft > 0) {
        e.timeLeft--;
        continue;
      }
      try {
        if (event.block.typeId !== e.block.typeId) return;
        const sEvent = new ScheduledBlockEvent(e.block);
        e.callback(sEvent, args);
      } finally {
        this.scheduledEvents.delete(e);
      }
    }
  }

  enterLeaveTick(event: BlockComponentTickEvent, args: CustomComponentParameters): void {
    const entities = event.dimension.getEntities({
      maxDistance: 1.5,
      location: event.block.location,
    });
    const hash = Hasher.stringify(event.block);
    for (const entity of entities) {
      this.onNearbyEntityTick(new NearbyEntityBlockEvent(event.block, entity), args);
      let eBlock = entity.dimension.getBlock(entity.location);
      let blk = entity.getDynamicProperty("mcutils:in_block") as string;
      let block = Hasher.parseBlock(blk);
      let bl = this.isInBlock(event.block, entity);
      if (bl && this.inBlockTick) this.inBlockTick(new EntityInBlockTickEvent(entity, event.block), args);
      if (bl && blk !== hash) {
        entity.setDynamicProperty("mcutils:in_block", hash);
        if (this.onEnter) this.onEnter(new EntityEnterBlockEvent(entity, event.block, block), args);
        continue;
      }
      if (!bl && blk === hash) {
        let same = event.block?.typeId == eBlock?.typeId;
        if (this.onLeave) this.onLeave(new EntityLeaveBlockEvent(entity, event.block, block), args);
        entity.setDynamicProperty("mcutils:in_block", Hasher.stringify(eBlock));
      }
    }
  }

  neighborTick(event: BlockComponentTickEvent, args: CustomComponentParameters): void {
    const direction = BlockUtils.getNeighborUpdate(event);
    if (!direction) return;
    const updateBlock = event.block.offset(DirectionUtils.toOffset(direction));
    if (!updateBlock) return;
    if (this.onNeighborUpdate)
      this.onNeighborUpdate(new NeighborUpdateEvent(event.block, updateBlock, direction), args);
  }

  update(block: Block, args: CustomComponentParameters): void {
    const event = new NeighborUpdateEvent(block, block);
    if (this.onNeighborUpdate) this.onNeighborUpdate(event, args);
  }

  spawnParticle(block: Block, effectName: string, location?: Vector3) {
    const loc = location ?? VECTOR3_ZERO;
    const pos = {
      x: block.location.x + 0.5 + loc.x / 16,
      y: block.location.y + loc.y / 16,
      z: block.location.z + 0.5 + loc.z / 16,
    };
    block.dimension.spawnParticle(effectName, pos);
  }

  after(
    block: Block,
    callback: (event: ScheduledBlockEvent, args: CustomComponentParameters) => void,
    tickDelay: number,
  ) {
    this.scheduledEvents.add({
      callback: callback,
      block: block,
      totalTimeLeft: tickDelay,
      timeLeft: tickDelay,
    });
  }

  // CUSTOM EVENTS

  /**
   * This function will be called when an entity is nearby. (Requires {@link baseTick} or {@link enterLeaveTick})
   * @param {NearbyEntityBlockEvent} event
   */
  onNearbyEntityTick(event: NearbyEntityBlockEvent, args: CustomComponentParameters): void {}

  /**
   * @deprecated This function will be called when a block has been placed/updated next to this block. (Requires {@link baseTick} or {@link neighborTick})
   * @param {NeighborUpdateEvent} event
   */
  onNeighborUpdate?(event: NeighborUpdateEvent, args: CustomComponentParameters): void;

  /**
   * This function will be called when an entity has entered the block. (Requires {@link baseTick} or {@link enterLeaveTick})
   * @param {EntityEnterBlockEvent} event
   * @param {CustomComponentParameters} args
   */
  onEnter?(event: EntityEnterBlockEvent, args: CustomComponentParameters): void;

  /**
   * This function will be called when an entity has left the block. (Requires {@link baseTick} or {@link enterLeaveTick})
   * @param {EntityLeaveBlockEvent} event
   * @param {CustomComponentParameters} args
   */
  onLeave?(event: EntityLeaveBlockEvent, args: CustomComponentParameters): void;

  /**
   * This function will be called when an entity is in the block. (Requires {@link baseTick} or {@link enterLeaveTick})
   * @param {EntityInBlockTickEvent} event
   * @param {CustomComponentParameters} args
   */
  inBlockTick?(event: EntityInBlockTickEvent, args: CustomComponentParameters): void;
}
