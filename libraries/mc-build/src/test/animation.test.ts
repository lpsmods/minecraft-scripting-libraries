import { describe, expect, it } from "vitest";
import { animation, animations } from "@lpsmods/mc-build";

describe("animation builder", () => {
  it("create a valid animation", () => {
    const result = animations("animation.example", animation().build()).build();
    expect(result).toEqual({
      format_version: "1.8.0",
      animations: {
        "animation.example": {},
      },
    });
  });
});
