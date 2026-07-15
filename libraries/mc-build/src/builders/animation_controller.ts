import { assert } from "superstruct";
import {
  AnimationControllerSchema,
  AnimationControllersSchema,
  type AnimationController,
  type AnimationControllers,
} from "../schema";

/**
 * Defines the animation controllers asset.
 */
export function defineAnimationControllers(data: AnimationControllers): AnimationControllers {
  assert(data, AnimationControllersSchema);
  return data;
}

/**
 * Creates an animation controllers definition.
 */
export function animationControllers(identifier?: string, animationController?: AnimationController) {
  const animation_controllers: Partial<Record<string, AnimationController>> = {};
  if (identifier) {
    animation_controllers[identifier] = animationController;
  }
  return {
    add(identifier: string, animationController: AnimationController) {
      animation_controllers[identifier] = animationController;
      return this;
    },
    build(): AnimationControllers {
      return AnimationControllersSchema.create({ animation_controllers }) as AnimationControllers;
    },
  };
}

/**
 * Creates an animation controller definition.
 */
export function animationController() {
  const data: AnimationController = {};
  return {
    build(): AnimationController {
      return AnimationControllerSchema.create(data) as AnimationController;
    },
  };
}
