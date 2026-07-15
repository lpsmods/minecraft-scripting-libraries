import { describe, expect, it } from "vitest";
import { clientEntity, defineEntity, defineClientEntity, entity } from "@lpsmods/mc-build";

describe("entity builders", () => {
  it("creates and defines a behavior-pack entity", () => {
    const result = entity("demo:entity").set("components", { "minecraft:physics": {} }).build();

    expect(result).toEqual({
      format_version: "1.21.100",
      "minecraft:entity": {
        description: { identifier: "demo:entity" },
        components: { "minecraft:physics": {} },
      },
    });
    expect(defineEntity(result)).toBe(result);
  });

  it("creates and defines a resource-pack entity", () => {
    const result = clientEntity("demo:entity").set("render_controllers", ["controller.render.default"]).build();

    expect(result).toEqual({
      format_version: "1.10.0",
      "minecraft:client_entity": {
        description: { identifier: "demo:entity" },
        render_controllers: ["controller.render.default"],
      },
    });
    expect(defineClientEntity(result)).toBe(result);
  });
});
