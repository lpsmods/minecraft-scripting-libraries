import { BlockType, BlockTypes, ItemType, world } from "@minecraft/server";
import { Id, Identifier, COLORS } from "@lpsmods/mc-common";

import { Registry } from "./registry";

export abstract class CustomTagRegistry<T> extends Registry<string[]> {
  register(name: string, object: (T | string)[], replace: boolean = false): string[] | undefined {
    if (replace || !this.has(name)) {
      return super.register(
        name,
        this.resolve(
          name,
          object.map((item) => this.transform(item)),
        ),
      );
    }
    const reg = this.get(name);
    if (!reg) return;
    object.forEach((item) => reg.push(this.transform(item)));
    return super.register(name, this.resolve(name, reg));
  }

  matches(tag: string, object: T | string): boolean {
    const reg = this.get(tag);
    if (!reg) return false;
    const str = Identifier.parse(this.transform(object)).toString();
    return reg.some((item) => item === str);
  }

  transform(object: T | string): string {
    return Identifier.parse(object as Id).toString();
  }

  private resolve(tagName: string, object: string[]): string[] {
    let items: string[] = [];
    for (const item of object) {
      // Resolve tags
      if (item.charAt(0) === "#") {
        const name = Identifier.string(item.slice(1));
        if (name === tagName) continue; // Circular reference.
        const tag = this.get(name);
        if (!tag) continue;
        items = [...items, ...tag];
        continue;
      }
      items.push(item);
    }
    return items;
  }
}

export class CustomItemTags extends CustomTagRegistry<ItemType> {
  static readonly registryId = "item_tags";
}

export class CustomBlockTags extends CustomTagRegistry<BlockType> {
  static readonly registryId = "block_tags";
}

export class CustomTags {
  static readonly items = new CustomItemTags();
  static readonly blocks = new CustomBlockTags();
}

// ITEMS

CustomTags.items.register("ignitable", ["flint_and_steel", "fire_charge"]);
CustomTags.items.register("waxable", ["honeycomb"]);
CustomTags.items.register(
  "concrete",
  COLORS.map((color) => `${color}_concrete`),
);
CustomTags.items.register(
  "concrete_powder",
  COLORS.map((color) => `${color}_concrete_powder`),
);
CustomTags.items.register(
  "wool",
  COLORS.map((color) => `${color}_wool`),
);
CustomTags.items.register("candle", ["candle", ...COLORS.map((color) => `${color}_candle`)]);
CustomTags.items.register("terracotta", ["terracotta", ...COLORS.map((color) => `${color}_terracotta`)]);
CustomTags.items.register(
  "glazed_terracotta",
  COLORS.map((color) => `${color}_glazed_terracotta`),
);
CustomTags.items.register(
  "carpet",
  COLORS.map((color) => `${color}_carpet`),
);
CustomTags.items.register(
  "stained_glass",
  COLORS.map((color) => `${color}_stained_glass`),
);
CustomTags.items.register(
  "stained_glass_pane",
  COLORS.map((color) => `${color}_stained_glass_pane`),
);
CustomTags.items.register(
  "harness",
  COLORS.map((color) => `${color}_harness`),
);
CustomTags.items.register("bundle", ["bundle", ...COLORS.map((color) => `${color}_bundle`)]);
CustomTags.items.register("shulker_box", ["undyed_shulker_box", ...COLORS.map((color) => `${color}_shulker_box`)]);
CustomTags.items.register(
  "banner",
  COLORS.map((color) => `${color}_banner`),
);

// BLOCKS

CustomTags.blocks.register(
  "concrete",
  COLORS.map((color) => `${color}_concrete`),
);
CustomTags.blocks.register(
  "concrete_powder",
  COLORS.map((color) => `${color}_concrete_powder`),
);
CustomTags.items.register(
  "wool",
  COLORS.map((color) => `${color}_wool`),
);
CustomTags.blocks.register("candle", ["candle", ...COLORS.map((color) => `${color}_candle`)]);
CustomTags.blocks.register("terracotta", ["terracotta", ...COLORS.map((color) => `${color}_terracotta`)]);
CustomTags.blocks.register(
  "glazed_terracotta",
  COLORS.map((color) => `${color}_glazed_terracotta`),
);
CustomTags.blocks.register(
  "carpet",
  COLORS.map((color) => `${color}_carpet`),
);
CustomTags.blocks.register(
  "stained_glass",
  COLORS.map((color) => `${color}_stained_glass`),
);
CustomTags.blocks.register(
  "stained_glass_pane",
  COLORS.map((color) => `${color}_stained_glass_pane`),
);
CustomTags.blocks.register("shulker_box", ["undyed_shulker_box", ...COLORS.map((color) => `${color}_shulker_box`)]);
CustomTags.blocks.register(
  "banner",
  COLORS.map((color) => `${color}_banner`),
);
CustomTags.blocks.register("copper_chests", [
  "copper_chest",
  "exposed_copper_chest",
  "weathered_copper_chest",
  "oxidized_copper_chest",
  "waxed_copper_chest",
  "waxed_exposed_copper_chest",
  "waxed_weathered_copper_chest",
  "waxed_oxidized_copper_chest",
]);
CustomTags.blocks.register("anvil", ["anvil", "chipped_anvil", "damaged_anvil"]);
CustomTags.blocks.register("replaceable", [
  "air",
  "water",
  "lava",
  "short_grass",
  "fern",
  "deadbush",
  "bush",
  "short_dry_grass",
  "tall_dry_grass",
  "seagrass",
  "fire",
  "soul_fire",
  "snow_layer",
  "vine",
  "glow_lichen",
  "resin_clump",
  "light_block_0",
  "light_block_1",
  "light_block_2",
  "light_block_3",
  "light_block_4",
  "light_block_5",
  "light_block_6",
  "light_block_7",
  "light_block_8",
  "light_block_9",
  "light_block_10",
  "light_block_11",
  "light_block_12",
  "light_block_13",
  "light_block_14",
  "light_block_15",
  "tall_grass",
  "large_fern",
  "structure_void",
  "bubble_column",
  "warped_roots",
  "nether_sprouts",
  "crimson_roots",
  "leaf_litter",
  "hanging_roots",
]);

CustomTags.blocks.register("unsupported", [
  "#stairs",
  "#walls",
  "#fences",
  "#fence_gates",
  "#doors",
  "#bars",
  "#glass_panes",
  "#slabs",
  "#trapdoors",
]);

// Dynamic
// world.afterEvents.worldLoad.subscribe(() => {
//   const blocks = BlockTypes.getAll();
//   CustomTags.blocks.register("stairs", blocks.filter(bt => bt.id.endsWith("_stairs")));
//   CustomTags.blocks.register("walls", blocks.filter(bt => bt.id.endsWith("_wall")));
//   CustomTags.blocks.register("fences", blocks.filter(bt => bt.id.endsWith("_fence")));
//   CustomTags.blocks.register("fence_gates", blocks.filter(bt => bt.id.endsWith("_fence_gate")));
//   CustomTags.blocks.register("doors", blocks.filter(bt => bt.id.endsWith("_door") && !bt.id.endsWith("_trapdoor")));
//   CustomTags.blocks.register("bars", blocks.filter(bt => bt.id.endsWith("_bars")));
//   CustomTags.blocks.register("glass", blocks.filter(bt => bt.id.endsWith("_glass")));
//   CustomTags.blocks.register("glass_panes", blocks.filter(bt => bt.id.endsWith("_glass_pane")));
//   CustomTags.blocks.register("slabs", blocks.filter(bt => bt.id.endsWith("_slab")));
// });
