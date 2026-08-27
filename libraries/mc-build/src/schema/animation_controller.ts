import { array, boolean, defaulted, Infer, number, object, optional, record, string, union } from "superstruct";
import { AnimationParticleEffectSchema, AnimationSoundEffectSchema, AnimationValueSchema } from "./animation";

/** State transitions, animation blends and events within a controller. */
export const AnimationControllerStateSchema = object({
  animations: optional(array(union([string(), record(string(), AnimationValueSchema)]))),
  transitions: optional(array(record(string(), AnimationValueSchema))),
  on_entry: optional(array(string())), on_exit: optional(array(string())),
  blend_transition: optional(union([number(), record(string(), number())])),
  blend_via_shortest_path: optional(boolean()),
  variables: optional(record(string(), union([AnimationValueSchema, object({
    input: AnimationValueSchema, remap_curve: record(string(), number()),
  })]))),
  particle_effects: optional(array(AnimationParticleEffectSchema)),
  sound_effects: optional(array(AnimationSoundEffectSchema)),
});

/**
 * Superstruct schema for the animation controller.
 */
export const AnimationControllerSchema = object({
  initial_state: optional(string()),
  states: optional(record(string(), AnimationControllerStateSchema)),
});

/**
 * Superstruct schema for the animation controllers.
 */
export const AnimationControllersSchema = object({
  format_version: defaulted(string(), "1.10.0"),
  animation_controllers: record(string(), AnimationControllerSchema),
});

/**
 * Type definition for an animation controller.
 */
export type AnimationController = Infer<typeof AnimationControllerSchema>;

/**
 * Type definition for an animation controllers.
 */
export type AnimationControllers = Infer<typeof AnimationControllersSchema>;
