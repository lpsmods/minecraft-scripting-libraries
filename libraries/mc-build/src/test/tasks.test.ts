import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { minifyTask } from "@lpsmods/mc-build";

const OUT_DIR = path.join(process.cwd(), "test-minify");

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
  });
});
