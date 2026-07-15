import { defaulted, Infer, number, object } from "superstruct";

/**
 * Superstruct schema for the item storage weight limit component.
 */
export const ItemStorageWeightLimitComponentSchema = object({
  max_weight_limit: defaulted(number(), 64),
});

/**
 * Type for the item storage weight limit component definition.
 */
export type ItemStorageWeightLimitComponent = Infer<typeof ItemStorageWeightLimitComponentSchema>;
