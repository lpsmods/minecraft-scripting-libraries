import { BlockLootHandler } from "@lpsmods/mc-utils";

export default () => {
  const grass = new BlockLootHandler("short_grass");
  grass.addTable("loot_tables/lpsmods/custom/short_grass");
};
