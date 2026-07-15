import { defaulted, Infer, number, object, optional, string } from "superstruct";

/**
 * Superstruct schema for the item record component.
 */
export const ItemRecordComponentSchema = object({
  comparator_signal: defaulted(number(), 1),
  duration: defaulted(number(), 0),
  sound_event: optional(string()),
});

/**
 * Type for the item record component definition.
 */
export type ItemRecordComponent = Infer<typeof ItemRecordComponentSchema>;
