import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  BehaviorPack,
  ResourcePack,
  animationControllers,
  animations,
  attachable,
  biome,
  block,
  blockCulling,
  camera,
  clientBiome,
  clientEntity,
  craftingItemCatalog,
  dialogue,
  entity,
  feature,
  featureRule,
  fog,
  item,
  jigsaw,
  lootTable,
  model,
  particle,
  processor,
  recipeBrewingContainer,
  recipeBrewingMix,
  recipeFurnace,
  recipeShaped,
  recipeShapeless,
  recipeSmithingTransform,
  recipeSmithingTrim,
  renderControllers,
  spawnGroup,
  spawnRules,
  structureSet,
  templatePool,
  trading,
  behaviorPackManifest,
} from "@lpsmods/mc-build";

const PACK_DIR = path.join(process.cwd(), "test-open-pack");
const EMIT_DIR = path.join(process.cwd(), "test-open-emit");

function writeResource(filename: string, data: unknown): void {
  const filepath = path.join(PACK_DIR, filename);
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, JSON.stringify(data), "utf8");
}

function expectEmitted(filename: string, data: unknown): void {
  const filepath = path.join(EMIT_DIR, filename);
  expect(JSON.parse(fs.readFileSync(filepath, "utf8"))).toEqual(data);
}

describe("Pack.open", () => {
  beforeEach(() => {
    fs.rmSync(PACK_DIR, { recursive: true, force: true });
    fs.rmSync(EMIT_DIR, { recursive: true, force: true });
  });

  afterEach(() => {
    fs.rmSync(PACK_DIR, { recursive: true, force: true });
    fs.rmSync(EMIT_DIR, { recursive: true, force: true });
  });

  it("walks and loads every supported behavior-pack resource", () => {
    const resources: [string, unknown][] = [
      ["manifest.json", behaviorPackManifest("Demo", "pack-uuid", "module-uuid").build()],
      ["item_catalog/crafting_item_catalog.json", craftingItemCatalog().build()],
      ["blocks/demo/block.json", block("demo:block").build()],
      ["items/demo/item.json", item("demo:item").build()],
      ["loot_tables/demo/table.json", lootTable().build()],
      [
        "recipes/brewing_container.json",
        recipeBrewingContainer("demo:brewing_container")
          .input("minecraft:potion")
          .reagent("minecraft:gunpowder")
          .output("minecraft:splash_potion")
          .build(),
      ],
      [
        "recipes/brewing_mix.json",
        recipeBrewingMix("demo:brewing_mix")
          .input("minecraft:potion_type:awkward")
          .reagent("minecraft:blaze_powder")
          .output("minecraft:potion_type:strength")
          .build(),
      ],
      [
        "recipes/furnace.json",
        recipeFurnace("demo:furnace").input("minecraft:beef").output("minecraft:cooked_beef").build(),
      ],
      [
        "recipes/shaped.json",
        recipeShaped("demo:shaped", ["#"])
          .key("#", { item: "minecraft:stone" })
          .result({ item: "minecraft:stone" })
          .build(),
      ],
      [
        "recipes/shapeless.json",
        recipeShapeless("demo:shapeless")
          .ingredient({ item: "minecraft:stone" })
          .result({ item: "minecraft:stone" })
          .build(),
      ],
      [
        "recipes/smithing_transform.json",
        recipeSmithingTransform("demo:smithing_transform")
          .template("minecraft:netherite_upgrade_smithing_template")
          .base("minecraft:diamond_sword")
          .addition("minecraft:netherite_ingot")
          .result("minecraft:netherite_sword")
          .build(),
      ],
      [
        "recipes/smithing_trim.json",
        recipeSmithingTrim("demo:smithing_trim")
          .template("minecraft:coast_armor_trim_smithing_template")
          .base("minecraft:diamond_chestplate")
          .addition("minecraft:quartz")
          .build(),
      ],
      ["spawn_rules/demo/entity.json", spawnRules("demo:entity").build()],
      ["biomes/demo/biome.json", biome("demo:biome").build()],
      ["entities/demo/entity.json", entity("demo:entity").build()],
      ["features/demo/feature.json", feature("aggregate_feature", "demo:feature").build()],
      ["feature_rules/demo/rule.json", featureRule("demo:rule").build()],
      ["worldgen/jigsaw_structures/demo/jigsaw.json", jigsaw("demo:jigsaw").build()],
      ["worldgen/structure_sets/demo/set.json", structureSet("demo:set").build()],
      ["worldgen/template_pools/demo/pool.json", templatePool("demo:pool").build()],
      ["worldgen/processors/demo/processor.json", processor("demo:processor").build()],
      ["dialogue/demo/dialogue.json", dialogue().build()],
      ["trading/demo/trading.json", trading({ tiers: [] }).build()],
      ["spawn_groups/demo/group.json", spawnGroup({ conditions: [] }).build()],
    ];
    for (const [filename, resource] of resources) {
      writeResource(filename, resource);
    }
    const pack = new BehaviorPack().open(PACK_DIR, true);
    pack.emit(EMIT_DIR);

    for (const [filename, resource] of resources) {
      expectEmitted(filename, resource);
    }
  });

  it("walks and loads every supported resource-pack resource", () => {
    const resources: [string, unknown][] = [
      ["biomes/demo/biome.json", clientBiome("demo:biome").build()],
      ["entity/demo/entity.json", clientEntity("demo:entity").build()],
      ["animations/demo/animation.json", animations().build()],
      ["animation_controllers/demo/controller.json", animationControllers().build()],
      ["render_controllers/demo/controller.json", renderControllers().build()],
      ["cameras/demo/camera.json", camera("demo:camera").build()],
      ["models/entity/demo.geo.json", model().build()],
      ["attachables/demo/attachable.json", attachable("demo:attachable").build()],
      ["block_culling/demo/culling.json", blockCulling("demo:culling").build()],
      ["fogs/demo/fog.json", fog("demo:fog").build()],
      ["particles/demo/particle.json", particle("demo:particle").build()],
    ];
    for (const [filename, resource] of resources) {
      writeResource(filename, resource);
    }

    const pack = new ResourcePack().open(PACK_DIR, true);
    pack.emit(EMIT_DIR);

    for (const [filename, resource] of resources) {
      expectEmitted(filename, resource);
    }
  });

  it("loads supported resources without validation by default", () => {
    const resource = { not_a_block: true };
    writeResource("blocks/invalid.json", resource);

    new BehaviorPack().open(PACK_DIR).emit(EMIT_DIR);

    expectEmitted("blocks/invalid.json", resource);
  });

  it("throws when validation fails", () => {
    writeResource("blocks/invalid.json", { not_a_block: true });

    expect(() => new BehaviorPack().open(PACK_DIR, true)).toThrow();
  });

  it("throws when a supported resource is not valid JSON", () => {
    const filepath = path.join(PACK_DIR, "blocks", "invalid.json");
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, "{", "utf8");

    expect(() => new BehaviorPack().open(PACK_DIR)).toThrow(SyntaxError);
  });

  it("ignores unsupported JSON files without parsing them", () => {
    fs.mkdirSync(PACK_DIR, { recursive: true });
    fs.writeFileSync(path.join(PACK_DIR, "unsupported.json"), "{", "utf8");

    expect(() => new BehaviorPack().open(PACK_DIR, true)).not.toThrow();
  });

  it("moves opened resources into the configured namespace", () => {
    const originalNamespace = process.env["PROJECT_NAMESPACE"];
    process.env["PROJECT_NAMESPACE"] = "custom";
    writeResource("items/example.json", item("demo:example").build());

    new BehaviorPack().open(PACK_DIR, true).emit(EMIT_DIR);

    expect(fs.existsSync(path.join(EMIT_DIR, "items", "custom", "example.json"))).toBe(true);
    if (originalNamespace === undefined) {
      delete process.env["PROJECT_NAMESPACE"];
    } else {
      process.env["PROJECT_NAMESPACE"] = originalNamespace;
    }
  });
});
