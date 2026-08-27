import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { AddOn, generateTask, getPackageVersion, langTask, minifyTask, stagePacksTask, syncManifestTask, validatePacksTask, validateReferencesTask } from "@lpsmods/mc-build";

const OUT_DIR = path.join(process.cwd(), "test-minify");

describe("getPackageVersion", () => {
  afterEach(() => fs.rmSync(OUT_DIR, { recursive: true, force: true }));

  it.each([
    ["1.2.3", "1.2.3"],
    ["1.0.0-rc1", "1.0.0"],
    ["2.3.4-beta.2+build.123", "2.3.4"],
    ["0.0.1+sha.abc", "0.0.1"],
  ])("converts %s to %s without changing the package file", (version, expected) => {
    const source = JSON.stringify({ version });
    const file = write("package.json", source);
    expect(getPackageVersion(OUT_DIR)).toBe(expected);
    expect(fs.readFileSync(file, "utf8")).toBe(source);
  });

  it("defaults to the current project's directory", () => {
    write("package.json", '{"version":"4.5.6-preview"}');
    const previous = process.cwd();
    process.chdir(OUT_DIR);
    try { expect(getPackageVersion()).toBe("4.5.6"); }
    finally { process.chdir(previous); }
  });

  it.each([undefined, null, 123, "1.2", "1.2.3.4", "invalid", "9007199254740992.0.0"])("rejects invalid version %s", (version) => {
    const file = write("package.json", JSON.stringify({ version }));
    expect(() => getPackageVersion(OUT_DIR)).toThrow(file);
  });

  it("reports missing and malformed package files", () => {
    expect(() => getPackageVersion(OUT_DIR)).toThrow("package.json");
    write("package.json", "{");
    expect(() => getPackageVersion(OUT_DIR)).toThrow("package.json");
  });
});

describe("pack pipeline tasks", () => {
  const options = { rootDir: OUT_DIR, projectName: "demo", namespace: "demo" };
  const bp = "build/behavior_packs/demo";
  const rp = "build/resource_packs/demo";
  const read = (file: string) => fs.readFileSync(path.join(OUT_DIR, file), "utf8");
  function stage() {
    AddOn.create({
      behaviorPack: { name: "Demo", packUuid: "bp", moduleUuid: "bp-module" },
      resourcePack: { name: "Demo", packUuid: "rp", moduleUuid: "rp-module" },
    }).emit({ behaviorPack: path.join(OUT_DIR, "behavior_packs/demo"), resourcePack: path.join(OUT_DIR, "resource_packs/demo") });
    stagePacksTask(options)();
  }
  afterEach(() => fs.rmSync(OUT_DIR, { recursive: true, force: true }));

  it("stages fresh copies, preserving source and binary files and removing stale output", () => {
    stage();
    write(`${bp}/stale.json`, "{}");
    write("resource_packs/demo/textures/demo.png", "image");
    stagePacksTask(options)();
    expect(fs.existsSync(path.join(OUT_DIR, bp, "stale.json"))).toBe(false);
    expect(read(`${rp}/textures/demo.png`)).toBe("image");
    expect(read("behavior_packs/demo/manifest.json")).toBe(read(`${bp}/manifest.json`));
  });

  it("rejects overlapping and out-of-root destinations before deleting anything", () => {
    stage();
    for (const behaviorPack of ["behavior_packs/demo", ".", "../outside", "build"]) {
      expect(() => stagePacksTask({ ...options, directories: { behaviorPack, resourcePack: rp } })()).toThrow();
    }
    expect(fs.existsSync(path.join(OUT_DIR, bp, "manifest.json"))).toBe(true);
  });

  it("awaits generation and propagates builder failures", async () => {
    await generateTask(async (ctx) => {
      await Promise.resolve();
      expect(ctx.namespace).toBe("demo");
      expect(ctx.behaviorPack).toBe(path.join(OUT_DIR, bp));
      expect(ctx.resourcePack).toBe(path.join(OUT_DIR, rp));
    }, options)();
    await expect(generateTask(async () => { throw new Error("builder failed"); }, options)()).rejects.toThrow("builder failed");
  });

  it("validates JSON5 and reports invalid resources with filenames without rewriting", () => {
    stage();
    write(`${bp}/items/demo.json`, '{ "minecraft:item": { description: { identifier: 123 } } }');
    expect(() => validatePacksTask(options)()).toThrow("demo.json");
    write(`${bp}/items/demo.json`, '{ format_version: "1.21.0", "minecraft:item": { description: { identifier: "demo:item" }, components: {} } }');
    expect(() => validatePacksTask(options)()).not.toThrow();
    write(`${rp}/custom.json`, "{ custom: true }");
    expect(() => validatePacksTask(options)()).not.toThrow();
    expect(() => validatePacksTask({ ...options, unsupported: "error" })()).toThrow("custom.json");
    expect(read(`${rp}/custom.json`)).toBe("{ custom: true }");
    write(`${rp}/custom.json`, "{");
    expect(() => validatePacksTask(options)()).toThrow("custom.json");
  });

  it("syncs only linked dependencies and preserves UUIDs and sources", () => {
    stage();
    const manifest = JSON.parse(read(`${bp}/manifest.json`));
    manifest.header.pack_scope = "world";
    manifest.metadata = { authors: ["Example"], product_type: "addon" };
    manifest.dependencies.push({ module_name: "@minecraft/server", version: "2.0.0" }, { uuid: "external", version: [1, 0, 0] });
    write(`${bp}/manifest.json`, JSON.stringify(manifest));
    syncManifestTask({ ...options, version: [2, 3, 4] })();
    const updated = JSON.parse(read(`${bp}/manifest.json`));
    expect(updated.header.version).toEqual([2, 3, 4]);
    expect(updated.header.uuid).toBe("bp");
    expect(updated.header.pack_scope).toBe("world");
    expect(updated.metadata).toEqual(manifest.metadata);
    expect(updated.modules[0]).toMatchObject({ uuid: "bp-module", version: [2, 3, 4] });
    expect(updated.dependencies).toEqual([{ uuid: "rp", version: [2, 3, 4] }, ...manifest.dependencies.slice(1)]);
    expect(JSON.parse(read("behavior_packs/demo/manifest.json")).header.version).toEqual([1, 0, 0]);
    expect(() => syncManifestTask({ ...options, version: "bad" })()).toThrow("version");
  });

  it("reports manifest validation details without changing either pack", () => {
    stage();
    const original = read(`${bp}/manifest.json`);
    const invalid = JSON.parse(read(`${rp}/manifest.json`));
    invalid.header.pack_scope = "invalid";
    write(`${rp}/manifest.json`, JSON.stringify(invalid));
    const sync = syncManifestTask({ ...options, version: [2, 0, 0] });
    expect(sync).toThrow("manifest.json");
    expect(sync).toThrow("header.pack_scope");
    expect(read(`${bp}/manifest.json`)).toBe(original);
    expect(JSON.parse(read(`${rp}/manifest.json`))).toEqual(invalid);
  });

  it("checks custom recipe and loot items, loot paths and atlas texture files with exemptions", () => {
    stage();
    write(`${bp}/items/demo.json`, '{"minecraft:item":{"description":{"identifier":"demo:item"}}}');
    write(`${bp}/recipes/demo.json`, '{"minecraft:recipe_shapeless":{"ingredients":[{"item":"minecraft:stone"}],"result":{"item":"demo:item"}}}');
    write(`${bp}/loot_tables/demo.json`, '{"pools":[{"entries":[{"type":"item","name":"demo:missing"}]}]}');
    write(`${bp}/blocks/demo.json`, '{"minecraft:block":{"components":{"minecraft:loot":{"table":"loot_tables/external.json"}}}}');
    write(`${rp}/textures/item_texture.json`, '{"texture_data":{"demo":{"textures":["textures/demo",{"path":"textures/external"}]}}}');
    write(`${rp}/textures/demo.png`, "image");
    expect(() => validateReferencesTask(options)()).toThrow("demo:missing");
    expect(() => validateReferencesTask(options)()).toThrow("textures/external");
    expect(() => validateReferencesTask({ ...options, externalItems: ["demo:missing"], externalTextures: ["textures/external"], externalLootTables: ["loot_tables/external.json"] })()).not.toThrow();
    write(`${bp}/recipes/demo.json`, '{"minecraft:recipe_furnace":{"input":"demo:absent","output":"minecraft:stone"}}');
    expect(() => validateReferencesTask(options)()).toThrow("demo:absent");
  });

  it("merges translations, preserving comments and equals signs, and detects duplicates and missing keys", () => {
    stage();
    write(`${rp}/texts/en_US.lang`, "## Comment\nold=Existing\nname=Old\n");
    const task = langTask({ ...options, entries: { en_US: { name: "New=value" } }, requiredKeys: ["name", "old"] });
    task();
    expect(read(`${rp}/texts/en_US.lang`)).toBe("## Comment\nold=Existing\nname=New=value\n");
    task();
    expect(() => langTask({ ...options, requiredKeys: ["missing"] })()).toThrow("missing");
    write(`${rp}/texts/en_US.lang`, "name=One\nname=Two\n");
    expect(() => task()).toThrow("duplicate");
    expect(() => langTask({ ...options, locales: ["../bad"] })()).toThrow("Invalid locale");
  });
});

function write(filename: string, contents: string): string {
  const filepath = path.join(OUT_DIR, filename);
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, contents, "utf8");
  return filepath;
}

describe("minifyTask", () => {
  const originalProjectName = process.env["PROJECT_NAME"];

  afterEach(() => {
    if (originalProjectName === undefined) {
      delete process.env["PROJECT_NAME"];
    } else {
      process.env["PROJECT_NAME"] = originalProjectName;
    }
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
  });

  it("recursively minifies JSON5 files as strict JSON", () => {
    const manifest = write(
      "behavior/manifest.json",
      `{
        // JSON5 comments are allowed.
        format_version: 2,
        header: {
          name: "Example",
        },
      }`,
    );
    const item = write(
      "behavior/items/demo/item.json",
      `{
        value: "text",
        list: [1, 2,],
      }`,
    );
    const ignored = write("behavior/items/demo/readme.txt", "{ not: 'json' }");

    minifyTask(path.join(OUT_DIR, "behavior"))();

    expect(fs.readFileSync(manifest, "utf8")).toBe('{"format_version":2,"header":{"name":"Example"}}');
    expect(fs.readFileSync(item, "utf8")).toBe('{"value":"text","list":[1,2]}');
    expect(fs.readFileSync(ignored, "utf8")).toBe("{ not: 'json' }");
  });

  it("preserves entity float property ranges and remains stable on repeated runs", () => {
    const filepath = write("behavior/entities/demo.json", `{
      "minecraft:entity": {
        description: {
          properties: {
            "demo:angle": { type: "float", range: [-360.0, 360.0], default: 0.0 },
            "demo:count": { type: "int", range: [0, 360], default: 0 },
          },
        },
      },
    }`);
    const expected = '{"minecraft:entity":{"description":{"properties":{"demo:angle":{"type":"float","range":[-360.0,360.0],"default":0.0},"demo:count":{"type":"int","range":[0,360],"default":0}}}}}';

    minifyTask(path.join(OUT_DIR, "behavior"))();
    expect(fs.readFileSync(filepath, "utf8")).toBe(expected);
    expect(() => JSON.parse(expected)).not.toThrow();
    minifyTask(path.join(OUT_DIR, "behavior"))();
    expect(fs.readFileSync(filepath, "utf8")).toBe(expected);
  });

  it("normalizes JSON5 syntax without changing strings or strict numeric literals", () => {
    const filepath = write("behavior/values.json", `{
      /* 123.0 */
      numbers: [+360.0, 360., .5, -.5, -0.0, 1.00, 1.0e+2, 0x10, Infinity, NaN,],
      'text': '360.0, /* comment */ // text',
      \\u006bey: true, // 456.0
      nested: [{ value: null, },],
    }`);

    minifyTask(path.join(OUT_DIR, "behavior"))();

    const result = fs.readFileSync(filepath, "utf8");
    expect(result).toBe('{"numbers":[360.0,360.0,0.5,-0.5,-0.0,1.00,1.0e+2,16,null,null],"text":"360.0, /* comment */ // text","key":true,"nested":[{"value":null}]}');
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it("uses PROJECT_NAME to locate both packs by default", () => {
    process.env["PROJECT_NAME"] = "demo";
    const behavior = write("behavior_packs/demo/manifest.json", "{ value: 1 }");
    const resource = write("resource_packs/demo/manifest.json", "{ value: 2 }");

    const originalCwd = process.cwd();
    process.chdir(OUT_DIR);
    try {
      minifyTask()();
    } finally {
      process.chdir(originalCwd);
    }

    expect(fs.readFileSync(behavior, "utf8")).toBe('{"value":1}');
    expect(fs.readFileSync(resource, "utf8")).toBe('{"value":2}');
  });

  it("includes the file path when JSON5 parsing fails", () => {
    const filepath = write("behavior/items/broken.json", "{ broken:");

    expect(() => minifyTask(path.join(OUT_DIR, "behavior"))()).toThrow(filepath);
    expect(fs.readFileSync(filepath, "utf8")).toBe("{ broken:");
  });
});
