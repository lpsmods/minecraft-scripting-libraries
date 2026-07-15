import { defaulted, Infer, object, record, string } from "superstruct";

/**
 * Superstruct schema for the animation.
 */
export const AnimationSchema = object({});

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
