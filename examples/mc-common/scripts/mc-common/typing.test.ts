import {
  BlockPermutation,
  BlockTypes,
  DimensionTypes,
  EffectTypes,
  EnchantmentTypes,
  EntityTypes,
  ItemTypes,
  world,
} from "@minecraft/server";
import { Typing } from "./typing";

export default () => {
  const dynamicSafe = {
    string: "Hello, World",
    number: 67,
    boolean: true,
    vector2: { x: 1, y: 2 },
    vector3: { x: 1, y: 2, z: 3 },
    vectorxz: { x: 1, z: 2 },
  };

  const blockType = BlockTypes.get("stone_stairs");

  const data = {
    ...dynamicSafe,
    blockType,
    blockPermutation: BlockPermutation.resolve("stone_stairs"),
    itemType: ItemTypes.get("paper"),
    entityType: EntityTypes.get("creeper"),
    enchantmentType: EnchantmentTypes.get("mending"),
    effectType: EffectTypes.get("haste"),
    dimensionType: DimensionTypes.get("overworld"),
    dimension: world.getDimension("overworld"),
    block: world.getDimension("overworld").getBlock(world.getDefaultSpawnLocation()),
    entity: world.getAllPlayers()[0],
    date: new Date(),
    regexp: /abc/gi,
    bigInt: BigInt(5),
    array: [...Object.values(dynamicSafe), blockType],
    object: { ...dynamicSafe, blockType },
    // map: new Map(Object.entries(dynamicSafe)),
    // set: new Set(Object.values(dynamicSafe)),
  };

  const json = Typing.toJson(data);
  Typing.fromJson(json);

  const str = Typing.toString(data);
  // console.warn(str);
  // Typing.fromString(str);
};
