import { describe, expect, it } from "vitest";
import { defineTemplatePool, templatePool } from "@lpsmods/mc-build";

describe("template pool builder", () => {
  it("creates and defines a template pool", () => {
    const result = templatePool("demo:pool").set("elements", []).build();

    expect(result).toEqual({
      format_version: "1.21.20",
      "minecraft:template_pool": {
        description: { identifier: "demo:pool" },
        elements: [],
      },
    });
    expect(defineTemplatePool(result)).toBe(result);
  });
});
