import { Block, BlockPermutation, Entity, ItemStack } from "@minecraft/server";
import { DataUtils } from "@lpsmods/mc-common";

import { SpecificEntityHandler } from "./specific_entity_handler";
import { EntityFallOnEvent } from "../event/entity";
import { BlockUtils } from "../block";
import { FallingBlockOptions } from "../blockcomponent";

export class FallingBlockEvent {
  constructor(block: Block, beforePermutation: BlockPermutation, entity: Entity) {
    this.block = block;
    this.beforePermutation = beforePermutation;
    this.entity = entity;
    this.cancel = false;
  }

  readonly block: Block;
  readonly beforePermutation: BlockPermutation;
  readonly entity: Entity;
  cancel: boolean;
}

export class FallingBlockHandler extends SpecificEntityHandler {
  component: any;
  blockOptions: FallingBlockOptions;

  constructor(component: any, options: FallingBlockOptions, entity: Entity) {
    super(entity);
    this.component = component;
    this.blockOptions = options;
    this.onFallOn = this.onFallOn.bind(this);
  }

  static create(component: any, block: Block, options: FallingBlockOptions): FallingBlockHandler | undefined {
    const before = block.permutation;
    const blockId = block.typeId; // Get ID before block change.
    const entity = BlockUtils.spawnBlockEntity(block, options.entity, {
      initialRotation: options.y_rotation_offset,
      removeBlock: true,
    });
    DataUtils.setDynamicProperty(entity, "block", {
      name: blockId,
      states: before.getAllStates(),
    });
    try {
      // TODO: trigger additional event including blockstates.
      entity.triggerEvent(blockId);
    } catch (err) {}
    const handler = new FallingBlockHandler(component, options, entity);
    const fallEvent = new FallingBlockEvent(block, before, entity);
    if (component.onFall) component.onFall(fallEvent, options);
    if (fallEvent.cancel) {
      handler.delete();
      return undefined;
    }
    return handler;
  }

  onFallOn(event: EntityFallOnEvent): void {
    const block = event.entity.dimension.getBlock(event.entity.location);
    if (!block || !block.isAir) return this.drop(event);
    const data = DataUtils.getDynamicProperty(event.entity, "block");
    if (data) {
      const perm = BlockPermutation.resolve(data.name, data.states);
      block.setPermutation(perm);
    }
    const before = block.permutation;
    const fallEvent = new FallingBlockEvent(block, before, event.entity);
    if (this.component.onLand) this.component.onLand(fallEvent, this.options);
    if (fallEvent.cancel) {
      block.setPermutation(before);
      return;
    }
    event.entity.remove();
    this.delete();
  }

  drop(event: EntityFallOnEvent): void {
    try {
      const data = DataUtils.getDynamicProperty(event.entity, "block");
      if (data && data.name) {
        const stack = new ItemStack(data.name);
        event.entity.dimension.spawnItem(stack, event.entity.location);
      }
    } finally {
      event.entity.remove();
      this.delete();
    }
  }
}
