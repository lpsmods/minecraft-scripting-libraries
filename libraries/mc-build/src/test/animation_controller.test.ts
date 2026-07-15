import { describe, expect, it } from "vitest";
import { animationController, animationControllers } from "@lpsmods/mc-build";

describe("animation controller builder", () => {
  it("create a valid animation controller", () => {
    const result = animationControllers("animation.controller.example", animationController().build()).build();
    expect(result).toEqual({
      animation_controllers: {
        "animation.controller.example": {},
      },
      format_version: "1.10.0",
    });
  });
});
