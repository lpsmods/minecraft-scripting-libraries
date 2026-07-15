import { defaulted, Infer, object, record, string } from "superstruct";

/**
 * Superstruct schema for the animation controller.
 */
export const AnimationControllerSchema = object({});

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
