import { describe, expect, it } from "vitest";
import { defineModel, geometryModel } from "@lpsmods/mc-build";

describe("geometry model builder", () => {
  it("creates and defines a geometry model file", () => {
    const result = geometryModel([{ description: { identifier: "geometry.demo" }, bones: [] }]).build();

    expect(result).toEqual({
      format_version: "1.12.0",
      "minecraft:geometry": [{ description: { identifier: "geometry.demo" }, bones: [] }],
    });
    expect(defineModel(result)).toBe(result);
  });
});
