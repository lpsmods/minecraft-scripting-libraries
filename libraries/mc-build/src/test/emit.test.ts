import fs from "node:fs";
import path from "node:path";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  BehaviorPack,
  block,
  item,
  lootTable,
  recipeBrewingContainer,
  recipeBrewingMix,
  recipeFurnace,
  recipeShaped,
  recipeShapeless,
  recipeSmithingTransform,
  recipeSmithingTrim,
  ResourcePack,
  spawnRules,
  animations,
  animationControllers,
  attachable,
  biome,
  entity,
  blockCulling,
  camera,
  craftingItemCatalog,
  dialogue,
  feature,
  featureRule,
  fog,
  jigsaw,
  model,
  particle,
  processor,
  renderControllers,
  clientBiome,
  clientEntity,
  spawnGroup,
  structureSet,
  templatePool,
  trading,
} from "@lpsmods/mc-build";

const OUT_DIR = path.join(process.cwd(), "test-dist");

function identifierPath(identifier: string) {
  return identifier.replace(":", "/");
}

describe("json emit", () => {
  const originalProjectName = process.env["PROJECT_NAME"];
  const originalProjectNamespace = process.env["PROJECT_NAMESPACE"];

  beforeEach(() => {
    delete process.env["PROJECT_NAME"];
    delete process.env["PROJECT_NAMESPACE"];
    fs.rmSync(OUT_DIR, {
      recursive: true,
      force: true,
    });
  });

  afterEach(() => {
    if (originalProjectName === undefined) {
      delete process.env["PROJECT_NAME"];
    } else {
      process.env["PROJECT_NAME"] = originalProjectName;
    }
    if (originalProjectNamespace === undefined) {
      delete process.env["PROJECT_NAMESPACE"];
    } else {
      process.env["PROJECT_NAMESPACE"] = originalProjectNamespace;
    }
    fs.rmSync(OUT_DIR, {
      recursive: true,
      force: true,
    });
  });

  it("saves block json to disk", () => {
    const pack = new BehaviorPack();
    pack.addBlock(block("demo:stone").build());
    pack.emit(OUT_DIR);
    const filepath = path.join(OUT_DIR, "blocks", `${identifierPath("demo:stone")}.json`);
    expect(fs.existsSync(filepath)).toBe(true);
    const json = JSON.parse(fs.readFileSync(filepath, "utf8"));
    expect(json).toEqual({
      format_version: "1.26.20",
      "minecraft:block": {
        description: {
          identifier: "demo:stone",
        },
      },
    });
  });

  it("saves item json to disk", () => {
    const registry = new BehaviorPack();
    registry.addItem(item("demo:paper").build());
    registry.emit(OUT_DIR);
    const filepath = path.join(OUT_DIR, "items", `${identifierPath("demo:paper")}.json`);
    expect(fs.existsSync(filepath)).toBe(true);
    const json = JSON.parse(fs.readFileSync(filepath, "utf8"));
    expect(json).toEqual({
      format_version: "1.26.20",
      "minecraft:item": {
        description: {
          identifier: "demo:paper",
        },
      },
    });
  });

  it("keeps unnamespaced resources at the resource root", () => {
    new BehaviorPack().addItem(item("paper").build()).emit(OUT_DIR);

    expect(fs.existsSync(path.join(OUT_DIR, "items", "paper.json"))).toBe(true);
  });

  it("uses PROJECT_NAMESPACE for generated resource paths", () => {
    process.env["PROJECT_NAME"] = "project-name";
    process.env["PROJECT_NAMESPACE"] = "custom";

    new BehaviorPack().addItem(item("demo:paper").build()).emit(OUT_DIR);

    expect(fs.existsSync(path.join(OUT_DIR, "items", "custom", "paper.json"))).toBe(true);
  });

  it("falls back to PROJECT_NAME for generated resource paths", () => {
    process.env["PROJECT_NAME"] = "project-name";

    new BehaviorPack().addItem(item("demo:paper").build()).emit(OUT_DIR);

    expect(fs.existsSync(path.join(OUT_DIR, "items", "project-name", "paper.json"))).toBe(true);
  });

  it("namespaces filename-based resources but not pack metadata", () => {
    process.env["PROJECT_NAMESPACE"] = "custom";

    const behavior = new BehaviorPack();
    behavior.addCraftingItemCatalog(craftingItemCatalog().build());
    behavior.addLootTable("blocks/example.json", lootTable().build());
    behavior.addDialogue("example.json", dialogue().build());
    behavior.emit(path.join(OUT_DIR, "behavior"));

    const resource = new ResourcePack();
    resource.addAnimation("example.animation.json", animations().build());
    resource.addModel("entity/example.geo.json", model().build());
    resource.emit(path.join(OUT_DIR, "resource"));

    expect(fs.existsSync(path.join(OUT_DIR, "behavior", "item_catalog", "crafting_item_catalog.json"))).toBe(true);
    expect(fs.existsSync(path.join(OUT_DIR, "behavior", "loot_tables", "custom", "blocks", "example.json"))).toBe(true);
    expect(fs.existsSync(path.join(OUT_DIR, "behavior", "dialogue", "custom", "example.json"))).toBe(true);
    expect(fs.existsSync(path.join(OUT_DIR, "resource", "animations", "custom", "example.animation.json"))).toBe(true);
    expect(fs.existsSync(path.join(OUT_DIR, "resource", "models", "custom", "entity", "example.geo.json"))).toBe(true);
  });

  it("namespaces supported resources added by relative path", () => {
    process.env["PROJECT_NAMESPACE"] = "custom";

    new BehaviorPack().add("items/example.json", item("demo:example").build()).emit(OUT_DIR);

    expect(fs.existsSync(path.join(OUT_DIR, "items", "custom", "example.json"))).toBe(true);
  });

  it("saves loot table json to disk", () => {
    const registry = new BehaviorPack();
    registry.addLootTable("blocks/example.json", lootTable().build());
    registry.emit(OUT_DIR);
    const filepath = path.join(OUT_DIR, "loot_tables", `blocks/example.json`);
    expect(fs.existsSync(filepath)).toBe(true);
    const json = JSON.parse(fs.readFileSync(filepath, "utf8"));
    expect(json).toEqual({ pools: [] });
  });

  it("saves spawn rules json to disk", () => {
    const registry = new BehaviorPack();
    registry.addSpawnRules(spawnRules("demo:stone").build());
    registry.emit(OUT_DIR);
    const filepath = path.join(OUT_DIR, "spawn_rules", `${identifierPath("demo:stone")}.json`);
    expect(fs.existsSync(filepath)).toBe(true);
    const json = JSON.parse(fs.readFileSync(filepath, "utf8"));
    expect(json).toEqual({
      format_version: "1.8.0",
      "minecraft:spawn_rules": {
        conditions: [],
        description: {
          identifier: "demo:stone",
          population_control: "monster",
        },
      },
    });
  });

  it("saves brewing container recipe json to disk", () => {
    const registry = new BehaviorPack();
    registry.addRecipe(
      recipeBrewingContainer("minecraft:brew_potion_sulphur")
        .input("minecraft:potion")
        .output("minecraft:splash_potion")
        .reagent("minecraft:gunpowder")
        .build(),
    );
    registry.emit(OUT_DIR);
    const filepath = path.join(OUT_DIR, "recipes", `${identifierPath("minecraft:brew_potion_sulphur")}.json`);
    expect(fs.existsSync(filepath)).toBe(true);
    const json = JSON.parse(fs.readFileSync(filepath, "utf8"));
    expect(json).toEqual({
      format_version: "1.12",
      "minecraft:recipe_brewing_container": {
        description: {
          identifier: "minecraft:brew_potion_sulphur",
        },
        input: "minecraft:potion",
        output: "minecraft:splash_potion",
        reagent: "minecraft:gunpowder",
        tags: ["brewing_stand"],
      },
    });
  });

  it("saves brewing mix recipe json to disk", () => {
    const registry = new BehaviorPack();
    registry.addRecipe(
      recipeBrewingMix("minecraft:brew_awkward_blaze_powder")
        .input("minecraft:potion_type:awkward")
        .output("minecraft:potion_type:strength")
        .reagent("minecraft:blaze_powder")
        .build(),
    );
    registry.emit(OUT_DIR);
    const filepath = path.join(OUT_DIR, "recipes", `${identifierPath("minecraft:brew_awkward_blaze_powder")}.json`);
    expect(fs.existsSync(filepath)).toBe(true);
    const json = JSON.parse(fs.readFileSync(filepath, "utf8"));
    expect(json).toEqual({
      format_version: "1.12",
      "minecraft:recipe_brewing_mix": {
        description: {
          identifier: "minecraft:brew_awkward_blaze_powder",
        },
        input: "minecraft:potion_type:awkward",
        output: "minecraft:potion_type:strength",
        reagent: "minecraft:blaze_powder",
        tags: ["brewing_stand"],
      },
    });
  });

  it("saves furnace json to disk", () => {
    const registry = new BehaviorPack();
    registry.addRecipe(
      recipeFurnace("minecraft:furnace_beef").input("minecraft:beef").output("minecraft:cooked_beef").build(),
    );
    registry.emit(OUT_DIR);
    const filepath = path.join(OUT_DIR, "recipes", `${identifierPath("minecraft:furnace_beef")}.json`);
    expect(fs.existsSync(filepath)).toBe(true);
    const json = JSON.parse(fs.readFileSync(filepath, "utf8"));
    expect(json).toEqual({
      format_version: "1.12",
      "minecraft:recipe_furnace": {
        description: {
          identifier: "minecraft:furnace_beef",
        },
        input: "minecraft:beef",
        output: "minecraft:cooked_beef",
        tags: ["furnace", "smoker", "campfire", "soul_campfire"],
      },
    });
  });

  it("saves shaped json to disk", () => {
    const registry = new BehaviorPack();
    registry.addRecipe(
      recipeShaped("minecraft:acacia_boat", ["#P#", "###"])
        .key("#", { item: "minecraft:planks", data: 4 })
        .key("P", { item: "minecraft:wooden_shovel" })
        .result({ item: "minecraft:boat", data: 4 })
        .build(),
    );
    registry.emit(OUT_DIR);
    const filepath = path.join(OUT_DIR, "recipes", `${identifierPath("minecraft:acacia_boat")}.json`);
    expect(fs.existsSync(filepath)).toBe(true);
    const json = JSON.parse(fs.readFileSync(filepath, "utf8"));
    expect(json).toEqual({
      format_version: "1.12",
      "minecraft:recipe_shaped": {
        description: {
          identifier: "minecraft:acacia_boat",
        },
        key: {
          "#": { item: "minecraft:planks", data: 4 },
          P: { item: "minecraft:wooden_shovel" },
        },
        pattern: ["#P#", "###"],
        result: { item: "minecraft:boat", data: 4 },
        tags: ["crafting_table"],
      },
    });
  });

  it("saves shapeless json to disk", () => {
    const registry = new BehaviorPack();
    registry.addRecipe(
      recipeShapeless("minecraft:firecharge_coal_sulphur")
        .ingredient({ item: "minecraft:fireball", data: 0, count: 4 })
        .result({ item: "minecraft:blaze_powder", data: 4 })
        .build(),
    );
    registry.emit(OUT_DIR);
    const filepath = path.join(OUT_DIR, "recipes", `${identifierPath("minecraft:firecharge_coal_sulphur")}.json`);
    expect(fs.existsSync(filepath)).toBe(true);
    const json = JSON.parse(fs.readFileSync(filepath, "utf8"));
    expect(json).toEqual({
      format_version: "1.12",
      "minecraft:recipe_shapeless": {
        description: {
          identifier: "minecraft:firecharge_coal_sulphur",
        },
        ingredients: [{ item: "minecraft:fireball", data: 0, count: 4 }],
        result: { item: "minecraft:blaze_powder", data: 4 },
        tags: ["crafting_table"],
      },
    });
  });

  it("saves smithing transform json to disk", () => {
    const registry = new BehaviorPack();
    registry.addRecipe(
      recipeSmithingTransform("minecraft:smithing_netherite_boots")
        .addition("minecraft:netherite_ingot")
        .base("minecraft:diamond_boots")
        .result("minecraft:netherite_boots")
        .template("minecraft:netherite_upgrade_smithing_template")
        .build(),
    );
    registry.emit(OUT_DIR);
    const filepath = path.join(OUT_DIR, "recipes", `${identifierPath("minecraft:smithing_netherite_boots")}.json`);
    expect(fs.existsSync(filepath)).toBe(true);
    const json = JSON.parse(fs.readFileSync(filepath, "utf8"));
    expect(json).toEqual({
      format_version: "1.12",
      "minecraft:recipe_smithing_transform": {
        description: {
          identifier: "minecraft:smithing_netherite_boots",
        },
        addition: "minecraft:netherite_ingot",
        base: "minecraft:diamond_boots",
        result: "minecraft:netherite_boots",
        tags: ["smithing_table"],
        template: "minecraft:netherite_upgrade_smithing_template",
      },
    });
  });

  it("saves smithing trim json to disk", () => {
    const registry = new BehaviorPack();
    registry.addRecipe(
      recipeSmithingTrim("minecraft:smithing_diamond_boots_jungle_quartz_trim")
        .addition("minecraft:quartz")
        .base("minecraft:diamond_boots")
        .template("minecraft:jungle_temple_smithing_template")
        .build(),
    );
    registry.emit(OUT_DIR);
    const filepath = path.join(
      OUT_DIR,
      "recipes",
      `${identifierPath("minecraft:smithing_diamond_boots_jungle_quartz_trim")}.json`,
    );
    expect(fs.existsSync(filepath)).toBe(true);
    const json = JSON.parse(fs.readFileSync(filepath, "utf8"));
    expect(json).toEqual({
      format_version: "1.12",
      "minecraft:recipe_smithing_trim": {
        description: {
          identifier: "minecraft:smithing_diamond_boots_jungle_quartz_trim",
        },
        addition: "minecraft:quartz",
        base: "minecraft:diamond_boots",
        tags: ["smithing_table"],
        template: "minecraft:jungle_temple_smithing_template",
      },
    });
  });

  it("saves animation json to disk", () => {
    const registry = new ResourcePack();
    registry.addAnimation("example.json", animations().build());
    registry.emit(OUT_DIR);
    const filepath = path.join(OUT_DIR, "animations", `example.json`);
    expect(fs.existsSync(filepath)).toBe(true);
    const json = JSON.parse(fs.readFileSync(filepath, "utf8"));
    expect(json).toEqual({
      animations: {},
      format_version: "1.8.0",
    });
  });

  it("saves animation controller json to disk", () => {
    const registry = new ResourcePack();
    registry.addAnimationController("example.animation_controller.json", animationControllers().build());
    registry.emit(OUT_DIR);
    const filepath = path.join(OUT_DIR, "animation_controllers", `example.animation_controller.json`);
    expect(fs.existsSync(filepath)).toBe(true);
    const json = JSON.parse(fs.readFileSync(filepath, "utf8"));
    expect(json).toEqual({
      animation_controllers: {},
      format_version: "1.10.0",
    });
  });

  it("saves render controller json to disk", () => {
    const registry = new ResourcePack();
    registry.addRenderController("example.render_controller.json", renderControllers().build());
    registry.emit(OUT_DIR);
    const filepath = path.join(OUT_DIR, "render_controllers", `example.render_controller.json`);
    expect(fs.existsSync(filepath)).toBe(true);
    const json = JSON.parse(fs.readFileSync(filepath, "utf8"));
    expect(json).toEqual({
      format_version: "1.8.0",
      render_controllers: {},
    });
  });

  it("saves the additional behavior-pack asset families", () => {
    const pack = new BehaviorPack();
    pack.addCraftingItemCatalog(craftingItemCatalog().build());
    pack.addBiome(biome("demo:biome").build());
    pack.addEntity(entity("demo:entity").build());
    pack.addFeature(feature("aggregate_feature", "demo:feature").build());
    pack.addFeatureRule(featureRule("demo:feature_rule").build());
    pack.addJigsaw(jigsaw("demo:jigsaw").build());
    pack.addStructureSet(structureSet("demo:structure_set").build());
    pack.addTemplatePool(templatePool("demo:template_pool").build());
    pack.addProcessor(processor("demo:processor").build());
    pack.addDialogue("demo/dialogue.json", dialogue().build());
    pack.addTrading("demo/trading.json", trading({ tiers: [] }).build());
    pack.addSpawnGroup("demo/spawn_group.json", spawnGroup({ conditions: [] }).build());
    pack.emit(OUT_DIR);

    const files = [
      "item_catalog/crafting_item_catalog.json",
      "biomes/demo/biome.json",
      "entities/demo/entity.json",
      "features/demo/feature.json",
      "feature_rules/demo/feature_rule.json",
      "worldgen/jigsaw_structures/demo/jigsaw.json",
      "worldgen/structure_sets/demo/structure_set.json",
      "worldgen/template_pools/demo/template_pool.json",
      "worldgen/processors/demo/processor.json",
      "dialogue/demo/dialogue.json",
      "trading/demo/trading.json",
      "spawn_groups/demo/spawn_group.json",
    ];
    for (const filename of files) {
      expect(fs.existsSync(path.join(OUT_DIR, filename))).toBe(true);
    }
  });

  it("saves the additional resource-pack asset families", () => {
    const pack = new ResourcePack();
    pack.addBiome(clientBiome("demo:biome").build());
    pack.addEntity(clientEntity("demo:entity").build());
    pack.addCamera(camera("demo:camera").build());
    pack.addModel("entity/demo.geo.json", model().build());
    pack.addAttachable(attachable("demo:attachable").build());
    pack.addBlockCulling(blockCulling("demo:block_culling").build());
    pack.addFog(fog("demo:fog").build());
    pack.addParticle(particle("demo:particle").build());
    pack.emit(OUT_DIR);

    const files = [
      "biomes/demo/biome.json",
      "entity/demo/entity.json",
      "cameras/demo/camera.json",
      "models/entity/demo.geo.json",
      "attachables/demo/attachable.json",
      "block_culling/demo/block_culling.json",
      "fogs/demo/fog.json",
      "particles/demo/particle.json",
    ];
    for (const filename of files) {
      expect(fs.existsSync(path.join(OUT_DIR, filename))).toBe(true);
    }
  });

  it("supports behavior-pack asset method aliases", () => {
    const pack = new BehaviorPack();
    pack.addProcessorList(processor("demo:processor_alias").build());
    pack.addTradeTable("demo/trade_alias.json", trading({ tiers: [] }).build());
    pack.emit(OUT_DIR);

    expect(fs.existsSync(path.join(OUT_DIR, "worldgen", "processors", "demo", "processor_alias.json"))).toBe(true);
    expect(fs.existsSync(path.join(OUT_DIR, "trading", "demo", "trade_alias.json"))).toBe(true);
  });
});
