import { array, assign, boolean, define, number, object, optional, string } from "superstruct";
import { ConditionUtils } from "@lpsmods/mc-common";

/**
 * A valid uuid4.
 */
export const isUuid4 = define("uuid4", ConditionUtils.isUuid4);

/**
 * A valid block id.
 */
export const isBlock = define("BlockType", ConditionUtils.isBlock);

/**
 * A valid item id.
 */
export const isItem = define("ItemType", ConditionUtils.isItem);

/**
 * A valid entity id.
 */
export const isEntity = define("EntityType", ConditionUtils.isEntity);

/**
 * A valid effect id.
 */
export const isEffect = define("EffectType", ConditionUtils.isEffect);

/**
 * A valid enchantment id.
 */
export const isEnchant = define("EnchantmentType", ConditionUtils.isEnchant);

/**
 * A valid dimension id.
 */
export const isDimension = define("DimensionType", ConditionUtils.isDimension);

/**
 * A 3D vector as [x, y, z]
 */
export const vec3 = define("Vector3", ConditionUtils.isVec3);

/**
 * A 2D vector as [x, y]
 */
export const vec2 = define("Vector2", ConditionUtils.isVec2);

/**
 * A 2D vector as [x, z]
 */
export const vecXZ = define("VectorXZ", ConditionUtils.isVecXZ);

/**
 * Contains options for filtering a property.
 */
export const entityFilterPropertyOptions = object({
  propertyId: string(),
  exclude: optional(boolean()),
  value: optional(string()),
});

/**
 * Contains options for filtering a score.
 */
export const entityFilterScoreOptions = object({
  exclude: optional(boolean()),
  maxScore: optional(number()),
  minScore: optional(number()),
  objective: optional(string()),
});

/**
 * Contains options for filtering entities.
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
 * Contains options for selecting entities within an area.
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
