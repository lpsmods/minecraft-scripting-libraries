import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  BehaviorPack,
  ManifestModuleType,
  ManifestSchema,
  ResourcePack,
  behaviorPackManifest,
  defineManifest,
  manifest,
  resourcePackManifest,
} from "@lpsmods/mc-build";

const OUT_DIR = path.join(process.cwd(), "test-manifest");

describe("manifest builder", () => {
  afterEach(() => {
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
  });

  it("creates a complete manifest", () => {
    const result = manifest("Example Pack", "pack-uuid", [1, 2, 3])
      .description("Example description")
      .minEngineVersion([1, 21, 0])
      .module(ManifestModuleType.Script, "module-uuid", {
        language: "javascript",
        entry: "scripts/main.js",
      })
      .dependency("resource-uuid")
      .moduleDependency("@minecraft/server", "2.0.0")
      .capability("script_eval")
      .metadata("authors", ["LPSMods"])
      .build();

    expect(ManifestSchema.is(result)).toBe(true);
    expect(result).toEqual({
      format_version: 2,
      header: {
        name: "Example Pack",
        description: "Example description",
        uuid: "pack-uuid",
        version: [1, 2, 3],
        min_engine_version: [1, 21, 0],
      },
      modules: [
        {
          type: "script",
          uuid: "module-uuid",
          version: [1, 2, 3],
          language: "javascript",
          entry: "scripts/main.js",
        },
      ],
      dependencies: [
        {
          uuid: "resource-uuid",
          version: [1, 2, 3],
        },
        {
          module_name: "@minecraft/server",
          version: "2.0.0",
        },
      ],
      capabilities: ["script_eval"],
      metadata: {
        authors: ["LPSMods"],
      },
    });
  });

  it("creates behavior and resource pack manifests", () => {
    const behavior = behaviorPackManifest("Behavior", "behavior-pack", "behavior-module").build();
    const resource = resourcePackManifest("Resource", "resource-pack", "resource-module").build();

    expect(behavior.modules[0].type).toBe("data");
    expect(resource.modules[0].type).toBe("resources");
    expect(defineManifest(behavior)).toBe(behavior);
  });

  it("emits manifests and can clean stale pack output", () => {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(path.join(OUT_DIR, "stale.json"), "{}", "utf8");

    new BehaviorPack(behaviorPackManifest("Behavior", "behavior-pack", "behavior-module").build()).emit(OUT_DIR, {
      clean: true,
    });

    expect(fs.existsSync(path.join(OUT_DIR, "manifest.json"))).toBe(true);
    expect(fs.existsSync(path.join(OUT_DIR, "stale.json"))).toBe(false);

    const reopened = new ResourcePack().addManifest(
      resourcePackManifest("Resource", "resource-pack", "resource-module").build(),
    );
    expect(reopened).toBeInstanceOf(ResourcePack);
  });
});
