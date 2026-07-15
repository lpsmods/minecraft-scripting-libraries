import { describe, expect, it } from "vitest";
import { attachable, defineAttachable } from "@lpsmods/mc-build";

describe("attachable builder", () => {
  it("creates and defines an attachable", () => {
    const result = attachable("demo:attachable").set("materials", { default: "entity" }).build();

    expect(result).toEqual({
      format_version: "1.10.0",
      "minecraft:attachable": {
        description: { identifier: "demo:attachable" },
        materials: { default: "entity" },
      },
    });
    expect(defineAttachable(result)).toBe(result);
  });
});
