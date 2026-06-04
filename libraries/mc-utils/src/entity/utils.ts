import {
  Direction,
  Entity,
  EntityQueryOptions,
  EquipmentSlot,
  ItemLockMode,
  ItemStack,
  Vector3,
} from "@minecraft/server";
import { forAllDimensions } from "../utils";
import { DirectionUtils } from "../utils/direction";
import { Vector3Utils } from "@minecraft/math";

export abstract class EntityUtils {
  /**
   * Drops all items in the entities inventory.
   * @param {Entity} entity
   * @param {Vector3} location
   * @returns {boolean}
   */
  static dropAll(entity: Entity, location?: Vector3): boolean {
    const container = entity.getComponent("inventory")?.container;
    if (!container) return false;
    for (let slot = 0; slot < container.size; slot++) {
      const itemStack = container.getItem(slot);
      if (!itemStack || itemStack.lockMode !== ItemLockMode.none) continue;
      entity.dimension.spawnItem(itemStack, location ?? entity.location);
    }
    return true;
  }

  /**
   * Get the direction the entity is facing.
   * @param {Entity} entity
   * @returns {Direction}
   */
  static getFacingDirection(entity: Entity): Direction {
    return DirectionUtils.fromRotation(entity.getRotation());
  }

  /**
   * Remove all entities from all dimensions that match options.
   * @param {EntityQueryOptions} options
   */
  static removeAll(options: EntityQueryOptions) {
    forAllDimensions((dim) => dim.getEntities(options).forEach((entity) => entity.isValid && entity.remove()));
  }

  /**
   * Get the item that the entity is holding.
   * @param {Entity} entity
   * @returns {ItemStack|undefined}
   */
  static getSelectedItem(entity: Entity): ItemStack | undefined {
    const equ = entity.getComponent("equippable");
    if (!equ) return;
    return equ.getEquipment(EquipmentSlot.Mainhand);
  }

  /**
   * Check if the entity has moved since the last call.
   * @param {Entity} entity
   * @returns {boolean}
   */
  static isMoving(entity: Entity): boolean {
    if (entity.isSwimming || entity.isSprinting || entity.isFalling) return true;
    const value = (entity.getDynamicProperty("mcutils:prev_location") as string) ?? "0,0,0";
    if (!value) throw new Error("Invalid prev_location value");
    const prevPos = Vector3Utils.fromString(value);
    if (!prevPos) throw new Error("Invalid prev_location value");
    const pos = entity.location;
    pos.x = Math.round(pos.x * 100) / 100;
    pos.y = Math.round(pos.y * 100) / 100;
    pos.z = Math.round(pos.z * 100) / 100;
    if (Vector3Utils.equals(prevPos, pos)) return false;
    entity.setDynamicProperty("mcutils:prev_location", Vector3Utils.toString(pos));
    return true;
  }
}
