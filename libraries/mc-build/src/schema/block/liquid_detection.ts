import { array, boolean, enums, Infer, object } from "superstruct";
import { Direction2Schema } from "../common";

/**
 * Allowed values for a liquid type.
 */
export enum LiquidType {
  Water = "water",
}

/**
 * Allowed values for a liquid touches.
 */
export enum LiquidTouches {}

/**
 * Superstruct schema for the block liquid detection component.
 */
export const BlockLiquidDetectionComponentSchema = object({
  detection_rules: array(
    object({
      can_contain_liquid: boolean(),
      liquid_type: enums(Object.values(LiquidType)),
      on_liquid_touches: enums(Object.values(LiquidTouches)),
      stops_liquid_flowing_from_direction: array(Direction2Schema),
      use_liquid_clipping: boolean(),
    }),
  ),
});

/**
 * Type for the block liquid detection component definition.
 */
export type BlockLiquidDetectionComponent = Infer<typeof BlockLiquidDetectionComponentSchema>;
