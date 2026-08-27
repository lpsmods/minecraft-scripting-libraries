import { array, boolean, defaulted, enums, Infer, number, object, optional, record, string, tuple, union } from "superstruct";

/** A numeric value or Molang expression used in an animation channel. */
export const AnimationValueSchema = union([number(), string()]);
const vector = tuple([AnimationValueSchema, AnimationValueSchema, AnimationValueSchema]);
const channelValue = union([AnimationValueSchema, vector]);
/** Animation keyframe with optional pre/post values and interpolation mode. */
export const AnimationKeyframeSchema = union([channelValue, object({
  pre: optional(channelValue), post: optional(channelValue),
  lerp_mode: optional(enums(["linear", "catmullrom"])),
})]);
const channel = union([channelValue, record(string(), AnimationKeyframeSchema)]);
/** Animated bone transforms. */
export const AnimationBoneSchema = object({
  position: optional(channel), rotation: optional(channel), scale: optional(channel),
  relative_to: optional(object({ rotation: optional(enums(["entity"])) })),
});
/** Particle event fired by an animation or controller state. */
export const AnimationParticleEffectSchema = object({
  effect: string(), locator: optional(string()), pre_effect_script: optional(string()),
  bind_to_actor: optional(boolean()),
});
/** Sound event fired by an animation or controller state. */
export const AnimationSoundEffectSchema = object({ effect: string() });

/**
 * Superstruct schema for the animation.
 */
export const AnimationSchema = object({
  loop: optional(union([boolean(), enums(["hold_on_last_frame"])])),
  animation_length: optional(number()),
  override_previous_animation: optional(boolean()),
  anim_time_update: optional(AnimationValueSchema),
  blend_weight: optional(AnimationValueSchema),
  start_delay: optional(AnimationValueSchema), loop_delay: optional(AnimationValueSchema),
  bones: optional(record(string(), AnimationBoneSchema)),
  timeline: optional(record(string(), union([string(), array(string())]))),
  sound_effects: optional(record(string(), union([AnimationSoundEffectSchema, array(AnimationSoundEffectSchema)]))),
  particle_effects: optional(record(string(), union([AnimationParticleEffectSchema, array(AnimationParticleEffectSchema)]))),
});

/**
 * Superstruct schema for the animations.
 */
export const AnimationsSchema = object({
  format_version: defaulted(string(), "1.8.0"),
  animations: record(string(), AnimationSchema),
});

/**
 * Type definition for an animation.
 */
export type Animation = Infer<typeof AnimationSchema>;

/**
 * Type definition for an animations.
 */
export type Animations = Infer<typeof AnimationsSchema>;
