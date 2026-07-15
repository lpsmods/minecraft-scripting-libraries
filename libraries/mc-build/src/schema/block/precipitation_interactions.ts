import { enums, Infer, object } from "superstruct";

enum PrecipitationBehavior {
  ObstructRain = "obstruct_brain",
  ObstructRainAccumulateSnow = "obstruct_rain_accumulate_snow",
  None = "none",
}

/**
 * Superstruct schema for the block precipitation interactions component.
 */
export const BlockPrecipitationInteractionsComponentSchema = object({
  precipitation_behavior: enums(Object.values(PrecipitationBehavior)),
});

/**
 * Type for the block precipitation interactions component definition.
 */
export type BlockPrecipitationInteractionsComponent = Infer<typeof BlockPrecipitationInteractionsComponentSchema>;
