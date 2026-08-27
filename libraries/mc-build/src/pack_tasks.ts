import fs from "node:fs";
import path from "node:path";
import JSON5 from "json5";
import { assert } from "superstruct";
import { emitJson } from "./emit/json";
import { ManifestSchema, type ManifestVersion } from "./schema";
import { BehaviorPack, ResourcePack } from "./utils/pack";
import type { AddOnDirectories } from "./utils/addon";

/** Shared project settings. Relative paths are resolved against rootDir. */
export type PackTaskOptions = {
  rootDir?: string;
  projectName?: string;
  namespace?: string;
  /** Defaults to build/behavior_packs/<projectName> and build/resource_packs/<projectName>. */
  directories?: AddOnDirectories;
};

/** Resolved paths and namespace passed to a pack generator. */
export type GenerateContext = AddOnDirectories & { projectName: string; namespace: string; rootDir: string };

function context(options: PackTaskOptions): GenerateContext {
  const rootDir = path.resolve(options.rootDir ?? process.cwd());
  const projectName = options.projectName ?? process.env["PROJECT_NAME"];
  if (!projectName || projectName === "." || projectName === ".." || /[\\/:]/.test(projectName)) {
    throw new Error("A projectName (or PROJECT_NAME) containing a single directory name is required.");
  }
  return {
    rootDir, projectName,
    namespace: options.namespace ?? process.env["PROJECT_NAMESPACE"] ?? projectName,
    behaviorPack: path.resolve(rootDir, options.directories?.behaviorPack ?? `build/behavior_packs/${projectName}`),
    resourcePack: path.resolve(rootDir, options.directories?.resourcePack ?? `build/resource_packs/${projectName}`),
  };
}

function files(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symbolic links are not supported: '${file}'.`);
    return entry.isDirectory() ? files(file) : entry.isFile() ? [file] : [];
  });
}

function read(file: string): any {
  try { return JSON5.parse(fs.readFileSync(file, "utf8")); }
  catch (cause) { throw new Error(`Unable to parse '${file}'.`, { cause }); }
}

function jsonFiles(directory: string): string[] {
  return files(directory).filter((file) => path.extname(file).toLowerCase() === ".json");
}

function overlaps(a: string, b: string): boolean {
  const relative = path.relative(a, b);
  return relative === "" || (!path.isAbsolute(relative) && relative !== ".." && !relative.startsWith(`..${path.sep}`));
}

/** Copies fresh source packs into staging, removing stale staged files. */
export function stagePacksTask(options: PackTaskOptions & { sourceDirectories?: AddOnDirectories } = {}): () => void {
  return () => {
    const ctx = context(options);
    const sources = [
      path.resolve(ctx.rootDir, options.sourceDirectories?.behaviorPack ?? `behavior_packs/${ctx.projectName}`),
      path.resolve(ctx.rootDir, options.sourceDirectories?.resourcePack ?? `resource_packs/${ctx.projectName}`),
    ];
    const targets = [ctx.behaviorPack, ctx.resourcePack];
    // Resolve existing ancestors as well so junctions cannot bypass overlap checks.
    const real = (file: string): string => fs.existsSync(file) ? fs.realpathSync(file) : path.join(real(path.dirname(file)), path.basename(file));
    const actualSources = sources.map(real);
    const actualTargets = targets.map(real);
    for (const target of actualTargets) {
      if (!overlaps(fs.realpathSync(ctx.rootDir), target) || target === fs.realpathSync(ctx.rootDir) ||
          actualSources.some((source) => overlaps(source, target) || overlaps(target, source))) {
        throw new Error(`Unsafe staging destination '${target}': use a separate directory within rootDir.`);
      }
    }
    if (overlaps(actualTargets[0], actualTargets[1]) || overlaps(actualTargets[1], actualTargets[0])) {
      throw new Error("Staged pack directories must not overlap.");
    }
    sources.forEach(files); // Check both sources before changing either destination.
    targets.filter((target) => fs.existsSync(target)).forEach(files);
    targets.forEach((target, index) => {
      fs.rmSync(target, { recursive: true, force: true });
      fs.cpSync(sources[index], target, { recursive: true });
    });
  };
}

/** Wraps a synchronous or asynchronous pack builder with resolved project settings. */
export function generateTask(builder: (context: GenerateContext) => void | Promise<void>, options: PackTaskOptions = {}): () => Promise<void> {
  return async () => { await builder(context(options)); };
}

/** Parses every JSON file and validates supported resources against mc-build schemas. */
export function validatePacksTask(options: PackTaskOptions & { unsupported?: "skip" | "error" } = {}): () => void {
  return () => {
    const ctx = context(options);
    const errors: string[] = [];
    for (const [directory, pack] of [[ctx.behaviorPack, new BehaviorPack()], [ctx.resourcePack, new ResourcePack()]] as const) {
      if (!fs.existsSync(path.join(directory, "manifest.json"))) errors.push(`${directory}: missing manifest.json`);
      for (const file of jsonFiles(directory)) {
        try {
          const supported = pack.validateResource(path.relative(directory, file).replaceAll("\\", "/"), read(file));
          if (!supported && options.unsupported === "error") throw new Error("Unsupported resource schema");
        } catch (error) { errors.push(`${file}: ${String(error)}`); }
      }
    }
    if (errors.length) throw new Error(`Pack validation failed:\n${errors.join("\n")}`);
  };
}

/** Synchronizes staged headers, modules and dependencies linking these packs; preserves UUIDs and external dependencies. */
export function syncManifestTask(options: PackTaskOptions & { version?: ManifestVersion } = {}): () => void {
  return () => {
    const ctx = context(options);
    const version = options.version ?? process.env["PROJECT_VERSION"];
    if (version === undefined) throw new Error("version or PROJECT_VERSION is required.");
    if (typeof version === "string" ? !/^\d+\.\d+\.\d+$/.test(version) :
        !Array.isArray(version) || version.length !== 3 || !version.every((n) => Number.isSafeInteger(n) && n >= 0)) {
      throw new Error("version (or PROJECT_VERSION) must be a three-part version string or integer tuple.");
    }
    const manifests = [ctx.behaviorPack, ctx.resourcePack].map((directory) => {
      const file = path.join(directory, "manifest.json");
      const data = read(file);
      try { assert(data, ManifestSchema); }
      catch (cause) {
        const detail = cause instanceof Error ? cause.message : String(cause);
        throw new Error(`Invalid manifest '${file}': ${detail}`, { cause });
      }
      return { file, data };
    });
    const uuids = new Set(manifests.map(({ data }) => data.header.uuid));
    for (const { file, data } of manifests) {
      data.header.version = version;
      data.modules.forEach((module: any) => { module.version = version; });
      data.dependencies?.forEach((dependency: any) => { if (uuids.has(dependency.uuid)) dependency.version = version; });
      emitJson(file, data);
    }
  };
}

/** Explicit exemptions for references supplied by vanilla or another dependency pack. */
export type ReferenceTaskOptions = PackTaskOptions & {
  externalItems?: string[];
  externalTextures?: string[];
  externalLootTables?: string[];
};

/** Checks recipe item IDs, loot-table item IDs, loot paths, and atlas texture files. Vanilla item IDs are allowed. */
export function validateReferencesTask(options: ReferenceTaskOptions = {}): () => void {
  return () => {
    const ctx = context(options);
    const behavior = jsonFiles(ctx.behaviorPack).map((file) => ({ file, data: read(file) }));
    const resources = jsonFiles(ctx.resourcePack).map((file) => ({ file, data: read(file) }));
    const items = new Set(options.externalItems ?? []);
    for (const { data } of behavior) {
      for (const key of ["minecraft:item", "minecraft:block"]) {
        const id = data?.[key]?.description?.identifier;
        if (typeof id === "string") items.add(id);
      }
    }
    const errors: string[] = [];
    const item = (id: unknown, file: string) => {
      if (typeof id !== "string" || !id.includes(":") || id.startsWith("minecraft:")) return;
      if (!items.has(id) && !items.has(id.replace(/:\d+$/, ""))) errors.push(`${file}: missing item '${id}'`);
    };
    const loot = (id: unknown, file: string) => {
      if (typeof id !== "string" || options.externalLootTables?.includes(id)) return;
      const target = path.resolve(ctx.behaviorPack, id);
      if (!overlaps(ctx.behaviorPack, target) || !fs.existsSync(target)) errors.push(`${file}: missing loot table '${id}'`);
    };
    const walk = (value: any, visit: (value: any) => void) => {
      if (!value || typeof value !== "object") return;
      visit(value);
      Object.values(value).forEach((child) => walk(child, visit));
    };
    for (const { file, data } of behavior) {
      const recipe = Object.keys(data).some((key) => key.startsWith("minecraft:recipe_"));
      const isLoot = path.relative(ctx.behaviorPack, file).replaceAll("\\", "/").startsWith("loot_tables/");
      walk(data, (value) => {
        if (recipe) {
          item(value.item, file);
          for (const key of ["input", "output", "result", "reagent"]) item(value[key], file);
        }
        if (isLoot && value.type === "item") item(value.name, file);
        if (isLoot && value.type === "loot_table") loot(value.name, file);
        if (value["minecraft:loot"]) loot(value["minecraft:loot"].table, file);
      });
    }
    const texture = (value: any, file: string): void => {
      if (Array.isArray(value)) { value.forEach((entry) => texture(entry, file)); return; }
      if (value && typeof value === "object") { texture(value.path, file); return; }
      if (typeof value !== "string" || options.externalTextures?.includes(value)) return;
      const target = path.resolve(ctx.resourcePack, value);
      if (!overlaps(ctx.resourcePack, target) || !["", ".png", ".tga", ".jpg", ".jpeg"].some((ext) => fs.existsSync(target + ext))) {
        errors.push(`${file}: missing texture '${value}'`);
      }
    };
    for (const { file, data } of resources) {
      if (["item_texture.json", "terrain_texture.json"].includes(path.basename(file))) {
        Object.values(data.texture_data ?? {}).forEach((entry: any) => texture(entry.textures, file));
      }
    }
    if (errors.length) throw new Error(`Reference validation failed:\n${errors.join("\n")}`);
  };
}

/** Language entries to merge and keys that must exist in each selected locale. */
export type LangTaskOptions = PackTaskOptions & {
  entries?: Record<string, Record<string, string>>;
  requiredKeys?: string[];
  /** Defaults to the locales supplied in entries, or en_US. */
  locales?: string[];
};

/** Merges staged .lang files, rejecting duplicate keys and missing required translations. */
export function langTask(options: LangTaskOptions = {}): () => void {
  return () => {
    const ctx = context(options);
    const entryLocales = Object.keys(options.entries ?? {});
    const locales = [...new Set([...(options.locales ?? (entryLocales.length ? entryLocales : ["en_US"])), ...entryLocales])];
    const outputs = locales.map((locale) => {
      if (!/^[A-Za-z0-9_\-]+$/.test(locale)) throw new Error(`Invalid locale '${locale}'.`);
      const file = path.join(ctx.resourcePack, "texts", `${locale}.lang`);
      const source = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
      const lines = source ? source.replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n") : [];
      const positions = new Map<string, number>();
      lines.forEach((line, index) => {
        if (!line.trim() || line.trimStart().startsWith("##")) return;
        const separator = line.indexOf("=");
        if (separator < 1) throw new Error(`${file}:${index + 1}: invalid translation`);
        const key = line.slice(0, separator).trim();
        if (positions.has(key)) throw new Error(`${file}: duplicate translation '${key}'`);
        positions.set(key, index);
      });
      for (const [key, value] of Object.entries(options.entries?.[locale] ?? {})) {
        if (!key || key.trim() !== key || /[=\r\n]/.test(key) || key.startsWith("##") || /[\r\n]/.test(value)) {
          throw new Error(`${file}: invalid translation '${key}'`);
        }
        const index = positions.get(key) ?? lines.length;
        lines[index] = `${key}=${value}`;
        positions.set(key, index);
      }
      for (const key of options.requiredKeys ?? []) {
        if (!positions.has(key) || !lines[positions.get(key)!].split("=").slice(1).join("=").split("##")[0].trim()) {
          throw new Error(`${file}: missing translation '${key}'`);
        }
      }
      return { file, text: lines.length ? `${lines.join("\n")}\n` : "" };
    });
    for (const { file, text } of outputs) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, text, "utf8");
    }
  };
}
