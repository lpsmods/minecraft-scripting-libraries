import fs from "node:fs";
import path from "node:path";

import { getProjectNamespace } from "../constants";
import { emitJson } from "../emit/json";
import {
  AnimationControllers,
  AnimationControllersSchema,
  Animations,
  AnimationsSchema,
  Attachable,
  AttachableSchema,
  Biome,
  BiomeSchema,
  Entity,
  EntitySchema,
  Block,
  BlockSchema,
  BlockCulling,
  BlockCullingSchema,
  Camera,
  CameraSchema,
  ClientBiomeSchema,
  ClientEntitySchema,
  CraftingItemCatalog,
  CraftingItemCatalogSchema,
  Dialogue,
  DialogueSchema,
  Feature,
  FeatureSchema,
  FeatureRule,
  FeatureRuleSchema,
  Fog,
  FogSchema,
  Item,
  ItemSchema,
  Jigsaw,
  JigsawSchema,
  LootTable,
  LootTableSchema,
  Model,
  ModelSchema,
  Manifest,
  ManifestSchema,
  Particle,
  ParticleSchema,
  Processor,
  ProcessorSchema,
  RecipeBrewingContainer,
  RecipeBrewingContainerSchema,
  RecipeBrewingMix,
  RecipeBrewingMixSchema,
  RecipeFurnace,
  RecipeFurnaceSchema,
  RecipeShaped,
  RecipeShapedSchema,
  RecipeShapeless,
  RecipeShapelessSchema,
  RecipeSmithingTransform,
  RecipeSmithingTransformSchema,
  RecipeSmithingTrim,
  RecipeSmithingTrimSchema,
  RenderControllers,
  RenderControllersSchema,
  ClientBiome,
  ClientEntity,
  SpawnGroup,
  SpawnGroupSchema,
  SpawnRules,
  SpawnRulesSchema,
  StructureSet,
  StructureSetSchema,
  TemplatePool,
  TemplatePoolSchema,
  Trading,
  TradingSchema,
  ManifestVersion,
} from "../schema";
import { assert, is, type Struct } from "superstruct";
import { behaviorPackManifest, resourcePackManifest } from "../builders";

function getResourceNamespace(identifier?: string): string | undefined {
  const separator = identifier?.indexOf(":") ?? -1;
  const identifierNamespace = separator === -1 ? undefined : identifier?.slice(0, separator);
  return getProjectNamespace() ?? identifierNamespace;
}

function identifierName(identifier: string): string {
  const separator = identifier.indexOf(":");
  return separator === -1 ? identifier : identifier.slice(separator + 1);
}

function resourcePath(directory: string, filename: string, identifier?: string): string {
  const namespace = getResourceNamespace(identifier);
  return namespace ? `${directory}/${namespace}/${filename}` : `${directory}/${filename}`;
}

const RESOURCE_DIRECTORIES = [
  "worldgen/jigsaw_structures",
  "worldgen/structure_sets",
  "worldgen/template_pools",
  "worldgen/processors",
  "animation_controllers",
  "render_controllers",
  "item_catalog",
  "block_culling",
  "loot_tables",
  "spawn_rules",
  "feature_rules",
  "spawn_groups",
  "animations",
  "attachables",
  "particles",
  "dialogue",
  "trading",
  "features",
  "entities",
  "cameras",
  "biomes",
  "blocks",
  "items",
  "entity",
  "models",
  "recipes",
  "fogs",
];

function namespacedResourcePath(filepath: string): string {
  if (filepath === "manifest.json" || filepath === "item_catalog/crafting_item_catalog.json") {
    return filepath;
  }

  const namespace = getProjectNamespace();
  if (!namespace) {
    return filepath;
  }

  const directory = RESOURCE_DIRECTORIES.find((candidate) => isInDirectory(filepath, candidate));
  if (!directory) {
    return filepath;
  }

  const filename = filepath.slice(directory.length + 1);
  if (filename === namespace || filename.startsWith(`${namespace}/`)) {
    return filepath;
  }
  return `${directory}/${namespace}/${filename}`;
}

function getIdentifier(asset: object): string {
  for (const value of Object.values(asset)) {
    const identifier = value?.description?.identifier;
    if (typeof identifier === "string") {
      return identifier;
    }
  }
  throw new Error("Asset does not contain a description identifier.");
}

function isInDirectory(filepath: string, directory: string): boolean {
  return filepath.startsWith(`${directory}/`);
}

function getRecipeSchema(data: unknown): Struct<any> | undefined {
  if (!data || typeof data !== "object") {
    return undefined;
  }
  if ("minecraft:recipe_brewing_container" in data) {
    return RecipeBrewingContainerSchema;
  }
  if ("minecraft:recipe_brewing_mix" in data) {
    return RecipeBrewingMixSchema;
  }
  if ("minecraft:recipe_furnace" in data) {
    return RecipeFurnaceSchema;
  }
  if ("minecraft:recipe_shaped" in data) {
    return RecipeShapedSchema;
  }
  if ("minecraft:recipe_shapeless" in data) {
    return RecipeShapelessSchema;
  }
  if ("minecraft:recipe_smithing_transform" in data) {
    return RecipeSmithingTransformSchema;
  }
  if ("minecraft:recipe_smithing_trim" in data) {
    return RecipeSmithingTrimSchema;
  }
  return undefined;
}

/** Options for writing a pack to disk. */
export type PackEmitOptions = {
  /** Removes the output directory before writing the pack. */
  clean?: boolean;
};

/**
 * Base collection of generated pack resources that can be emitted to disk.
 */
export abstract class Pack {
  private resources = new Map<string, any>();

  constructor(manifest?: Manifest) {
    if (manifest) {
      this.addManifest(manifest);
    }
  }

  /**
   * Recursively opens every supported JSON resource in a pack directory.
   */
  open(directory: string, validate = false): this {
    for (const filepath of this.walk(directory)) {
      const relativePath = path.relative(directory, filepath).replaceAll("\\", "/");
      if (!this.supportsResource(relativePath)) {
        continue;
      }

      const data: unknown = JSON.parse(fs.readFileSync(filepath, "utf8"));
      if (validate) {
        const schema = this.getResourceSchema(relativePath, data);
        if (!schema) {
          throw new Error(`Unable to determine the resource schema for '${relativePath}'.`);
        }
        assert(data, schema);
      }
      this.add(namespacedResourcePath(relativePath), data);
    }
    return this;
  }

  /**
   * Adds a resource payload at a path relative to the pack root.
   */
  add(filepath: string, data: any): this {
    this.resources.set(namespacedResourcePath(filepath), data);
    return this;
  }

  /**
   * Adds the pack manifest.
   */
  addManifest(manifest: Manifest): this {
    assert(manifest, ManifestSchema);
    return this.add("manifest.json", manifest);
  }

  /**
   * Writes every resource in this pack to the provided output directory.
   */
  emit(outDir: string, options: PackEmitOptions = {}): void {
    if (options.clean) {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
    for (const [filepath, data] of this.resources) {
      emitJson(path.join(outDir, filepath), data);
    }
  }

  protected abstract supportsResource(filepath: string): boolean;

  protected abstract getResourceSchema(filepath: string, data: unknown): Struct<any> | undefined;

  private walk(directory: string): string[] {
    const files: string[] = [];
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const filepath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        files.push(...this.walk(filepath));
      } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".json") {
        files.push(filepath);
      }
    }
    return files;
  }
}

export interface PackCreateOptions {
  name?: string;
  description?: string;
  packUuid?: string;
  moduleUuid?: string;
  version?: ManifestVersion;
}

/**
 * Pack writer for behavior-pack JSON assets.
 */
export class BehaviorPack extends Pack {
  static create(options: PackCreateOptions): BehaviorPack {
    const behaviorManifest = behaviorPackManifest(
      options.name ?? "",
      options.packUuid ?? "",
      options.moduleUuid ?? "",
      options.version,
    )
      .description(options.description ?? "")
      .build();
    return new BehaviorPack(behaviorManifest);
  }

  protected supportsResource(filepath: string): boolean {
    return (
      filepath === "manifest.json" ||
      filepath === "item_catalog/crafting_item_catalog.json" ||
      [
        "blocks",
        "items",
        "loot_tables",
        "recipes",
        "spawn_rules",
        "biomes",
        "entities",
        "features",
        "feature_rules",
        "worldgen/jigsaw_structures",
        "worldgen/structure_sets",
        "worldgen/template_pools",
        "worldgen/processors",
        "dialogue",
        "trading",
        "spawn_groups",
      ].some((directory) => isInDirectory(filepath, directory))
    );
  }

  protected getResourceSchema(filepath: string, data: unknown): Struct<any> | undefined {
    if (filepath === "manifest.json") {
      return ManifestSchema;
    }
    if (filepath === "item_catalog/crafting_item_catalog.json") {
      return CraftingItemCatalogSchema;
    }
    if (isInDirectory(filepath, "blocks")) {
      return BlockSchema;
    }
    if (isInDirectory(filepath, "items")) {
      return ItemSchema;
    }
    if (isInDirectory(filepath, "loot_tables")) {
      return LootTableSchema;
    }
    if (isInDirectory(filepath, "recipes")) {
      return getRecipeSchema(data);
    }
    if (isInDirectory(filepath, "spawn_rules")) {
      return SpawnRulesSchema;
    }
    if (isInDirectory(filepath, "biomes")) {
      return BiomeSchema;
    }
    if (isInDirectory(filepath, "entities")) {
      return EntitySchema;
    }
    if (isInDirectory(filepath, "features")) {
      return FeatureSchema;
    }
    if (isInDirectory(filepath, "feature_rules")) {
      return FeatureRuleSchema;
    }
    if (isInDirectory(filepath, "worldgen/jigsaw_structures")) {
      return JigsawSchema;
    }
    if (isInDirectory(filepath, "worldgen/structure_sets")) {
      return StructureSetSchema;
    }
    if (isInDirectory(filepath, "worldgen/template_pools")) {
      return TemplatePoolSchema;
    }
    if (isInDirectory(filepath, "worldgen/processors")) {
      return ProcessorSchema;
    }
    if (isInDirectory(filepath, "dialogue")) {
      return DialogueSchema;
    }
    if (isInDirectory(filepath, "trading")) {
      return TradingSchema;
    }
    if (isInDirectory(filepath, "spawn_groups")) {
      return SpawnGroupSchema;
    }
    return undefined;
  }

  /**
   * Adds the crafting item catalog to this behavior pack.
   */
  addCraftingItemCatalog(catalog: CraftingItemCatalog): this {
    return this.add("item_catalog/crafting_item_catalog.json", catalog);
  }

  /**
   * Adds a block definition to this behavior pack.
   */
  addBlock(block: Block): this {
    const id = block["minecraft:block"].description.identifier;
    return this.add(resourcePath("blocks", `${identifierName(id)}.json`, id), block);
  }

  /**
   * Adds an item definition to this behavior pack.
   */
  addItem(item: Item): this {
    const id = item["minecraft:item"].description.identifier;
    return this.add(resourcePath("items", `${identifierName(id)}.json`, id), item);
  }

  /**
   * Adds a loot table to this behavior pack.
   */
  addLootTable(filename: string, lootTable: LootTable): this {
    return this.add(resourcePath("loot_tables", filename), lootTable);
  }

  /**
   * Adds any supported recipe definition to this behavior pack.
   */
  addRecipe(
    recipe:
      | RecipeBrewingContainer
      | RecipeBrewingMix
      | RecipeFurnace
      | RecipeShaped
      | RecipeShapeless
      | RecipeSmithingTransform
      | RecipeSmithingTrim,
  ): this {
    const id = this.getRecipeId(recipe);
    return this.add(resourcePath("recipes", `${identifierName(id)}.json`, id), recipe);
  }

  /**
   * Adds spawn rules to this behavior pack.
   */
  addSpawnRules(spawnRules: SpawnRules): this {
    const id = spawnRules["minecraft:spawn_rules"].description.identifier;
    return this.add(resourcePath("spawn_rules", `${identifierName(id)}.json`, id), spawnRules);
  }

  /**
   * Adds a biome definition to this behavior pack.
   */
  addBiome(biome: Biome): this {
    const id = getIdentifier(biome);
    return this.add(resourcePath("biomes", `${identifierName(id)}.json`, id), biome);
  }

  /**
   * Adds an entity definition to this behavior pack.
   */
  addEntity(entity: Entity): this {
    const id = getIdentifier(entity);
    return this.add(resourcePath("entities", `${identifierName(id)}.json`, id), entity);
  }

  /**
   * Adds a feature definition to this behavior pack.
   */
  addFeature(feature: Feature): this {
    const id = getIdentifier(feature);
    return this.add(resourcePath("features", `${identifierName(id)}.json`, id), feature);
  }

  /**
   * Adds a feature rule to this behavior pack.
   */
  addFeatureRule(featureRule: FeatureRule): this {
    const id = getIdentifier(featureRule);
    return this.add(resourcePath("feature_rules", `${identifierName(id)}.json`, id), featureRule);
  }

  /**
   * Adds a jigsaw structure definition to this behavior pack.
   */
  addJigsaw(jigsaw: Jigsaw): this {
    const id = getIdentifier(jigsaw);
    return this.add(resourcePath("worldgen/jigsaw_structures", `${identifierName(id)}.json`, id), jigsaw);
  }

  /**
   * Adds a structure set definition to this behavior pack.
   */
  addStructureSet(structureSet: StructureSet): this {
    const id = getIdentifier(structureSet);
    return this.add(resourcePath("worldgen/structure_sets", `${identifierName(id)}.json`, id), structureSet);
  }

  /**
   * Adds a template pool definition to this behavior pack.
   */
  addTemplatePool(templatePool: TemplatePool): this {
    const id = getIdentifier(templatePool);
    return this.add(resourcePath("worldgen/template_pools", `${identifierName(id)}.json`, id), templatePool);
  }

  /**
   * Adds a processor list definition to this behavior pack.
   */
  addProcessor(processor: Processor): this {
    const id = getIdentifier(processor);
    return this.add(resourcePath("worldgen/processors", `${identifierName(id)}.json`, id), processor);
  }

  /**
   * Adds a processor list definition to this behavior pack.
   */
  addProcessorList(processor: Processor): this {
    return this.addProcessor(processor);
  }

  /**
   * Adds an NPC dialogue file to this behavior pack.
   */
  addDialogue(filename: string, dialogue: Dialogue): this {
    return this.add(resourcePath("dialogue", filename), dialogue);
  }

  /**
   * Adds a trading table to this behavior pack.
   */
  addTrading(filename: string, trading: Trading): this {
    return this.add(resourcePath("trading", filename), trading);
  }

  /**
   * Adds a trade table to this behavior pack.
   */
  addTradeTable(filename: string, trading: Trading): this {
    return this.addTrading(filename, trading);
  }

  /**
   * Adds a spawn group to this behavior pack.
   */
  addSpawnGroup(filename: string, spawnGroup: SpawnGroup): this {
    return this.add(resourcePath("spawn_groups", filename), spawnGroup);
  }

  private getRecipeId(
    recipe:
      | RecipeBrewingContainer
      | RecipeBrewingMix
      | RecipeFurnace
      | RecipeShaped
      | RecipeShapeless
      | RecipeSmithingTransform
      | RecipeSmithingTrim,
  ): string {
    if (is(recipe, RecipeBrewingContainerSchema)) {
      return recipe["minecraft:recipe_brewing_container"].description.identifier;
    }
    if (is(recipe, RecipeBrewingMixSchema)) {
      return recipe["minecraft:recipe_brewing_mix"].description.identifier;
    }
    if (is(recipe, RecipeFurnaceSchema)) {
      return recipe["minecraft:recipe_furnace"].description.identifier;
    }
    if (is(recipe, RecipeShapedSchema)) {
      return recipe["minecraft:recipe_shaped"].description.identifier;
    }
    if (is(recipe, RecipeShapelessSchema)) {
      return recipe["minecraft:recipe_shapeless"].description.identifier;
    }
    if (is(recipe, RecipeSmithingTransformSchema)) {
      return recipe["minecraft:recipe_smithing_transform"].description.identifier;
    }
    if (is(recipe, RecipeSmithingTrimSchema)) {
      return recipe["minecraft:recipe_smithing_trim"].description.identifier;
    }
    throw new Error("Unsupported recipe type.");
  }
}

/**
 * Pack writer for resource-pack JSON assets.
 */
export class ResourcePack extends Pack {
  static create(options: PackCreateOptions): ResourcePack {
    const resourceManifest = resourcePackManifest(
      options.name ?? "",
      options.packUuid ?? "",
      options.moduleUuid ?? "",
      options.version ?? [1, 0, 0],
    )
      .description(options.description ?? "")
      .build();
    return new ResourcePack(resourceManifest);
  }

  protected supportsResource(filepath: string): boolean {
    return (
      filepath === "manifest.json" ||
      [
        "biomes",
        "entity",
        "animations",
        "animation_controllers",
        "render_controllers",
        "cameras",
        "models",
        "attachables",
        "block_culling",
        "fogs",
        "particles",
      ].some((directory) => isInDirectory(filepath, directory))
    );
  }

  protected getResourceSchema(filepath: string): Struct<any> | undefined {
    if (filepath === "manifest.json") {
      return ManifestSchema;
    }
    if (isInDirectory(filepath, "biomes")) {
      return ClientBiomeSchema;
    }
    if (isInDirectory(filepath, "entity")) {
      return ClientEntitySchema;
    }
    if (isInDirectory(filepath, "animations")) {
      return AnimationsSchema;
    }
    if (isInDirectory(filepath, "animation_controllers")) {
      return AnimationControllersSchema;
    }
    if (isInDirectory(filepath, "render_controllers")) {
      return RenderControllersSchema;
    }
    if (isInDirectory(filepath, "cameras")) {
      return CameraSchema;
    }
    if (isInDirectory(filepath, "models")) {
      return ModelSchema;
    }
    if (isInDirectory(filepath, "attachables")) {
      return AttachableSchema;
    }
    if (isInDirectory(filepath, "block_culling")) {
      return BlockCullingSchema;
    }
    if (isInDirectory(filepath, "fogs")) {
      return FogSchema;
    }
    if (isInDirectory(filepath, "particles")) {
      return ParticleSchema;
    }
    return undefined;
  }

  /**
   * Adds a biome definition to this resource pack.
   */
  addBiome(biome: ClientBiome): this {
    const id = getIdentifier(biome);
    return this.add(resourcePath("biomes", `${identifierName(id)}.json`, id), biome);
  }

  /**
   * Adds a client entity definition to this resource pack.
   */
  addEntity(entity: ClientEntity): this {
    const id = getIdentifier(entity);
    return this.add(resourcePath("entity", `${identifierName(id)}.json`, id), entity);
  }

  /**
   * Adds animations to this resource pack.
   */
  addAnimation(filename: string, animations: Animations): this {
    return this.add(resourcePath("animations", filename), animations);
  }

  /**
   * Adds animation controllers to this resource pack.
   */
  addAnimationController(filename: string, animationControllers: AnimationControllers): this {
    return this.add(resourcePath("animation_controllers", filename), animationControllers);
  }

  /**
   * Adds render controllers to this resource pack.
   */
  addRenderController(filename: string, renderControllers: RenderControllers): this {
    return this.add(resourcePath("render_controllers", filename), renderControllers);
  }

  /**
   * Adds a camera preset to this resource pack.
   */
  addCamera(camera: Camera): this {
    const id = getIdentifier(camera);
    return this.add(resourcePath("cameras", `${identifierName(id)}.json`, id), camera);
  }

  /**
   * Adds a geometry model to this resource pack.
   */
  addModel(filename: string, model: Model): this {
    return this.add(resourcePath("models", filename), model);
  }

  /**
   * Adds an attachable definition to this resource pack.
   */
  addAttachable(attachable: Attachable): this {
    const id = getIdentifier(attachable);
    return this.add(resourcePath("attachables", `${identifierName(id)}.json`, id), attachable);
  }

  /**
   * Adds block culling rules to this resource pack.
   */
  addBlockCulling(blockCulling: BlockCulling): this {
    const id = getIdentifier(blockCulling);
    return this.add(resourcePath("block_culling", `${identifierName(id)}.json`, id), blockCulling);
  }

  /**
   * Adds fog settings to this resource pack.
   */
  addFog(fog: Fog): this {
    const id = getIdentifier(fog);
    return this.add(resourcePath("fogs", `${identifierName(id)}.json`, id), fog);
  }

  /**
   * Adds a particle effect to this resource pack.
   */
  addParticle(particle: Particle): this {
    const id = getIdentifier(particle);
    return this.add(resourcePath("particles", `${identifierName(id)}.json`, id), particle);
  }
}
