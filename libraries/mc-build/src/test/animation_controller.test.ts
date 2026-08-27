import { describe, expect, it } from "vitest";
import { animationController, animationControllers, AnimationControllerSchema } from "@lpsmods/mc-build";

describe("animation controller builder", () => {
  it("validates states, transitions and blend expressions", () => {
    const state = { animations: ["idle", { moving: "q.is_moving" }], transitions: [{ active: "q.is_on_ground" }],
      on_entry: ["v.active = 1;"], on_exit: ["v.active = 0;"], blend_transition: 0.5 };
    expect(AnimationControllerSchema.is({ initial_state: "default", states: { default: state } })).toBe(true);
    expect(AnimationControllerSchema.is({ states: { default: { ...state, blend_transition: "slow" } } })).toBe(false);
    expect(AnimationControllerSchema.is({ states: [] })).toBe(false);
  });
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
