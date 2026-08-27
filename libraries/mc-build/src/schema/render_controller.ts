import { array, boolean, defaulted, Infer, number, object, optional, record, string, union } from "superstruct";

const expression = union([string(), number()]);
const color = object({ r: expression, g: expression, b: expression, a: expression });

/**
 * Superstruct schema for the render controller.
 */
export const RenderControllerSchema = object({
  geometry: optional(string()),
  materials: optional(array(record(string(), string()))),
  textures: optional(array(string())),
  part_visibility: optional(array(record(string(), union([boolean(), expression])))),
  arrays: optional(object({
    geometries: optional(record(string(), array(string()))),
    materials: optional(record(string(), array(string()))),
    textures: optional(record(string(), array(string()))),
  })),
  color: optional(color), overlay_color: optional(color),
  on_fire_color: optional(color), is_hurt_color: optional(color),
  ignore_lighting: optional(union([boolean(), expression])),
  light_color_multiplier: optional(expression),
  filter_lighting: optional(union([boolean(), expression])),
  uv_anim: optional(object({ offset: array(expression), scale: array(expression) })),
});

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
