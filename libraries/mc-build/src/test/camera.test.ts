import { describe, expect, it } from "vitest";
import { camera, defineCamera } from "@lpsmods/mc-build";

describe("camera preset builder", () => {
  it("creates and defines a camera preset", () => {
    const result = camera("demo:camera").set("inherit_from", "minecraft:first_person").build();

    expect(result).toEqual({
      format_version: "1.19.50",
      "minecraft:camera_preset": {
        description: { identifier: "demo:camera" },
        inherit_from: "minecraft:first_person",
      },
    });
    expect(defineCamera(result)).toBe(result);
  });
});
