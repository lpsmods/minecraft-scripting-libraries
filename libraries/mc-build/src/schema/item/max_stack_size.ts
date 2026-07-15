import { Infer, number, object, union } from "superstruct";

/**
 * Superstruct schema for the item max stack size component.
 */
export const ItemMaxStackSizeComponentSchema = union([
  number(),
  object({
    value: number(),
  }),
]);

/**
 * Type for the item max stack size component definition.
 */
export type ItemMaxStackSizeComponent = Infer<typeof ItemMaxStackSizeComponentSchema>;
