import { EntityLootHandler } from "@lpsmods/mc-utils";

export default () => {
  const creeper = new EntityLootHandler("creeper");
  creeper.replaceTable("loot_tables/lpsmods/custom/creeper");
};
