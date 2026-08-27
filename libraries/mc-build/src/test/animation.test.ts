import { describe, expect, it } from "vitest";
import { animation, animations, AnimationSchema } from "@lpsmods/mc-build";

describe("animation builder", () => {
  it("validates transforms, keyframes, Molang, timelines and effects", () => {
    const data = {
      loop: true, animation_length: 2, override_previous_animation: true, blend_weight: "0.9",
      bones: { item: { position: [0, "q.life_time", 0], scale: 0.8, relative_to: { rotation: "entity" },
        rotation: { "0.0": [0, 0, 0], "1.0": { pre: [0, 0, 0], post: [0, 90, 0], lerp_mode: "catmullrom" } } } },
      timeline: { "0.0": ["v.active = true;"] },
      particle_effects: { "0.0": [{ effect: "fire", locator: "wing", bind_to_actor: false }] },
      sound_effects: { "0.0": { effect: "open" } },
    };
    expect(AnimationSchema.is(data)).toBe(true);
    expect(AnimationSchema.is({ ...data, loop: "hold_on_last_frame" })).toBe(true);
    expect(AnimationSchema.is({ ...data, loop: 123 })).toBe(false);
    expect(AnimationSchema.is({ ...data, bones: { item: { position: [0, 1] } } })).toBe(false);
    expect(AnimationSchema.is({ ...data, animation_length: "long" })).toBe(false);
  });
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
