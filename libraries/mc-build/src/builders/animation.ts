import { assert } from "superstruct";
import { AnimationSchema, AnimationsSchema, type Animation, type Animations } from "../schema";

/**
 * Defines the animations asset.
 */
export function defineAnimations(data: Animations): Animations {
  assert(data, AnimationsSchema);
  return data;
}

/**
 * Creates an animations definition.
 */
export function animations(identifier?: string, animation?: Animation) {
  const animations: Partial<Record<string, Animation>> = {};
  if (identifier) {
    animations[identifier] = animation;
  }
  return {
    add(identifier: string, animation: Animation) {
      animations[identifier] = animation;
      return this;
    },
    build(): Animations {
      return AnimationsSchema.create({ animations }) as Animations;
    },
  };
}

/**
 * Creates an animation definition.
 */
export function animation() {
  const data: Animation = {};
  return {
    build(): Animation {
      return AnimationSchema.create(data) as Animation;
    },
  };
}
