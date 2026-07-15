import { describe, expect, it } from "vitest";
import { defineProcessor, processorList } from "@lpsmods/mc-build";

describe("processor list builder", () => {
  it("creates and defines a processor list", () => {
    const result = processorList("demo:processor").set("processors", []).build();

    expect(result).toEqual({
      format_version: "1.21.20",
      "minecraft:processor_list": {
        description: { identifier: "demo:processor" },
        processors: [],
      },
    });
    expect(defineProcessor(result)).toBe(result);
  });
});
