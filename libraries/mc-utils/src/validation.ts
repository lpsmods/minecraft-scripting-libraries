import {
  BlockType,
  BlockTypes,
  DimensionType,
  DimensionTypes,
  EffectType,
  EffectTypes,
  EnchantmentType,
  EnchantmentTypes,
  EntityType,
  EntityTypes,
  ItemType,
  ItemTypes,
} from "@minecraft/server";
import { array, assign, boolean, define, number, object, optional, string } from "superstruct";

/**
 * Utility helpers for condition.
 */
export class ConditionUtils {
  static isGzipped(value: any): boolean {
    if (typeof value !== "string") return false;
    return value.toString().startsWith("H4sIAAAAAAAA");
  }

  static isUuid4(value: any): boolean {
    const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/gm;
    return regex.test(value);
  }

  static isBlock(value: any): boolean {
    return BlockTypes.get(value instanceof BlockType ? value.id : value) !== undefined;
  }

  static isItem(value: any): boolean {
    return ItemTypes.get(value instanceof ItemType ? value.id : value) !== undefined;
  }

  static isEntity(value: any): boolean {
    return EntityTypes.get(value instanceof EntityType ? value.id : value) !== undefined;
  }

  static isEffect(value: any): boolean {
    return EffectTypes.get(value instanceof EffectType ? value.getName() : value) !== undefined;
  }

  static isEnchant(value: any): boolean {
    return EnchantmentTypes.get(value instanceof EnchantmentType ? value.id : value) !== undefined;
  }

  static isDimension(value: any): boolean {
    return DimensionTypes.get(value instanceof DimensionType ? value.typeId : value) !== undefined;
  }

  static isVec3(value: any): boolean {
    return Array.isArray(value) && value.length >= 3 && value.length <= 3;
  }

  static isVec2(value: any): boolean {
    return Array.isArray(value) && value.length >= 2 && value.length <= 2;
  }
}

/**
 * Predicate that checks whether a value is a gzip.
 */
export const isGzip = define("gzip", ConditionUtils.isGzipped);

/**
 * Predicate that checks whether a value is an uuid4.
 */
export const isUuid4 = define("uuid4", ConditionUtils.isUuid4);

/**
 * Predicate that checks whether a value is a block.
 */
export const isBlock = define("BlockType", ConditionUtils.isBlock);

/**
 * Predicate that checks whether a value is an item.
 */
export const isItem = define("ItemType", ConditionUtils.isItem);

/**
 * Predicate that checks whether a value is an entity.
 */
export const isEntity = define("EntityType", ConditionUtils.isEntity);

/**
 * Predicate that checks whether a value is an effect.
 */
export const isEffect = define("EffectType", ConditionUtils.isEffect);

/**
 * Predicate that checks whether a value is an enchant.
 */
export const isEnchant = define("EnchantmentType", ConditionUtils.isEnchant);

/**
 * Predicate that checks whether a value is a dimension.
 */
export const isDimension = define("DimensionType", ConditionUtils.isDimension);

/**
 * Shared vec3 value.
 */
export const vec3 = define("Vector3", ConditionUtils.isVec3);

/**
 * Shared vec2 value.
 */
export const vec2 = define("Vector2", ConditionUtils.isVec2);

/**
 * Shared entity filter property options value.
 */
export const entityFilterPropertyOptions = object({
  propertyId: string(),
  exclude: optional(boolean()),
  value: optional(string()),
});

/**
 * Shared entity filter score options value.
 */
export const entityFilterScoreOptions = object({
  exclude: optional(boolean()),
  maxScore: optional(number()),
  minScore: optional(number()),
  objective: optional(string()),
});

/**
 * Shared entity filter value.
 */
export const entityFilter = object({
  excludeFamilies: optional(array(string())),
  excludeGameModes: optional(array(string())),
  excludeNames: optional(array(string())),
  excludeTags: optional(array(string())),
  excludeTypes: optional(array(string())),
  families: optional(array(string())),
  gameMode: optional(string()),
  maxHorizontalRotation: optional(number()),
  maxLevel: optional(number()),
  maxVerticalRotation: optional(number()),
  minHorizontalRotation: optional(number()),
  minLevel: optional(number()),
  minVerticalRotation: optional(number()),
  name: optional(string()),
  propertyOptions: optional(array(entityFilterPropertyOptions)),
  scoreOptions: optional(array(entityFilterScoreOptions)),
  tags: optional(array(string())),
  type: optional(string()),
});

/**
 * Shared entity query value.
 */
export const entityQuery = assign(
  entityFilter,
  object({
    closest: optional(number()),
    farthest: optional(number()),
    location: optional(vec3),
    maxDistance: optional(number()),
    minDistance: optional(number()),
    volume: optional(vec3),
  }),
);
