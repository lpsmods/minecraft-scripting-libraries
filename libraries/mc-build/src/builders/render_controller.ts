import { assert } from "superstruct";
import {
  RenderControllersSchema,
  RenderControllerSchema,
  type RenderController,
  type RenderControllers,
} from "../schema";

/**
 * Defines the render controllers asset.
 */
export function defineRenderControllers(data: RenderControllers): RenderControllers {
  assert(data, RenderControllersSchema);
  return data;
}

/**
 * Creates a render controllers definition.
 */
export function renderControllers(identifier?: string, renderController?: RenderController) {
  const render_controllers: Partial<Record<string, RenderController>> = {};
  if (identifier) {
    render_controllers[identifier] = renderController;
  }
  return {
    add(identifier: string, renderController: RenderController) {
      render_controllers[identifier] = renderController;
      return this;
    },
    build(): RenderControllers {
      return RenderControllersSchema.create({ render_controllers }) as RenderControllers;
    },
  };
}

/**
 * Creates a render controller definition.
 */
export function renderController() {
  const data: RenderController = {};
  return {
    build(): RenderController {
      return RenderControllerSchema.create(data) as RenderController;
    },
  };
}
