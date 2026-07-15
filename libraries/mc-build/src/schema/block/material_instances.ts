import { boolean, enums, Infer, number, object, optional, record, string } from "superstruct";
import { TintMethodSchema } from "../common";

/**
 * Allowed values for a render method.
 */
export enum RenderMethod {
  Opaque = "opaque",
  DoubleSided = "double_sided",
  Blend = "blend",
  AlphaTest = "alpha_test",
  AlphaTestSingleSided = "alpha_test_single_sided",
  BlendToOpaque = "blend_to_opaque",
  AlphaTestToOpaque = "alpha_test_to_opaque",
  AlphaTestToSingleSidedOpaque = "alpha_test_to_single_sided_opaque",
}

/**
 * Superstruct schema for the block material instances component.
 */
export const BlockMaterialInstancesComponentSchema = record(
  string(),
  object({
    texture: string(),
    ambient_occlusion: optional(number()),
    face_dimming: optional(boolean()),
    isotropic: optional(boolean()),
    render_method: optional(enums(Object.values(RenderMethod))),
    tint_method: optional(TintMethodSchema),
  }),
);

/**
 * Type for the block material instances component definition.
 */
export type BlockMaterialInstancesComponent = Infer<typeof BlockMaterialInstancesComponentSchema>;
