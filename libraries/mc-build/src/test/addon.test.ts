import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { AddOn, animations, item } from "@lpsmods/mc-build";

const OUT_DIR = path.join(process.cwd(), "test-addon");
const DIRECTORIES = {
  behaviorPack: path.join(OUT_DIR, "behavior_packs", "demo"),
  resourcePack: path.join(OUT_DIR, "resource_packs", "demo"),
};
const REOPENED_DIRECTORIES = {
  behaviorPack: path.join(OUT_DIR, "reopened_behavior_packs", "demo"),
  resourcePack: path.join(OUT_DIR, "reopened_resource_packs", "demo"),
};

describe("AddOn", () => {
  afterEach(() => {
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
  });

  it("creates mutually linked packs and emits both", () => {
    const addon = AddOn.create({
      behaviorPack: {
        name: "Demo Behavior Pack",
        description: "Behavior pack",
        packUuid: "behavior-pack",
        moduleUuid: "behavior-module",
        version: [1, 2, 3],
      },
      resourcePack: {
        name: "Demo Resource Pack",
        description: "Resource pack",
        packUuid: "resource-pack",
        moduleUuid: "resource-module",
        version: [4, 5, 6],
      },
    });

    addon.behaviorPack.addItem(item("demo:item").build());
    addon.resourcePack.addAnimation("demo.animation.json", animations().build());
    addon.emit(DIRECTORIES, { clean: true });

    const behaviorManifest = JSON.parse(fs.readFileSync(path.join(DIRECTORIES.behaviorPack, "manifest.json"), "utf8"));
    const resourceManifest = JSON.parse(fs.readFileSync(path.join(DIRECTORIES.resourcePack, "manifest.json"), "utf8"));

    expect(behaviorManifest.dependencies).toEqual([
      {
        uuid: "resource-pack",
        version: [4, 5, 6],
      },
    ]);
    expect(resourceManifest.dependencies).toEqual([
      {
        uuid: "behavior-pack",
        version: [1, 2, 3],
      },
    ]);
    expect(fs.existsSync(path.join(DIRECTORIES.behaviorPack, "items", "demo", "item.json"))).toBe(true);
    expect(fs.existsSync(path.join(DIRECTORIES.resourcePack, "animations", "demo.animation.json"))).toBe(true);
  });

  it("opens both packs", () => {
    const addon = AddOn.create({
      behaviorPack: {
        name: "Demo Behavior Pack",
        packUuid: "behavior-pack",
        moduleUuid: "behavior-module",
      },
      resourcePack: {
        name: "Demo Resource Pack",
        packUuid: "resource-pack",
        moduleUuid: "resource-module",
      },
    });
    addon.emit(DIRECTORIES);

    const opened = AddOn.open(DIRECTORIES, true);
    opened.emit(REOPENED_DIRECTORIES);

    expect(opened).toBeInstanceOf(AddOn);
    expect(fs.existsSync(path.join(REOPENED_DIRECTORIES.behaviorPack, "manifest.json"))).toBe(true);
    expect(fs.existsSync(path.join(REOPENED_DIRECTORIES.resourcePack, "manifest.json"))).toBe(true);
  });
});
