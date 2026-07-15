import { defaulted, Infer, number, object } from "superstruct";

/**
 * Superstruct schema for the item swing duration component.
 */
export const ItemSwingDurationComponentSchema = object({
  value: defaulted(number(), 0.30000001192092896),
});

/**
 * Type for the item swing duration component definition.
 */
export type ItemSwingDurationComponent = Infer<typeof ItemSwingDurationComponentSchema>;
