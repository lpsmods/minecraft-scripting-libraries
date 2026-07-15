import { defaulted, Infer, object, record, string } from "superstruct";

/**
 * Superstruct schema for the render controller.
 */
export const RenderControllerSchema = object({});

/**
 * Superstruct schema for the render controllers.
 */
export const RenderControllersSchema = object({
  format_version: defaulted(string(), "1.8.0"),
  render_controllers: record(string(), RenderControllerSchema),
});

/**
 * Type definition for a render controller.
 */
export type RenderController = Infer<typeof RenderControllerSchema>;

/**
 * Type definition for a render controllers.
 */
export type RenderControllers = Infer<typeof RenderControllersSchema>;
