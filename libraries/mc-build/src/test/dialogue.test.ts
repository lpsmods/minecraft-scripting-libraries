import { describe, expect, it } from "vitest";
import { defineDialogue, dialogue } from "@lpsmods/mc-build";

describe("dialogue builder", () => {
  it("creates and defines an NPC dialogue file", () => {
    const result = dialogue([{ scene_tag: "demo:start", npc_name: "Demo" }]).build();

    expect(result).toEqual({
      format_version: "1.17.0",
      "minecraft:npc_dialogue": {
        scenes: [{ scene_tag: "demo:start", npc_name: "Demo" }],
      },
    });
    expect(defineDialogue(result)).toBe(result);
  });
});
