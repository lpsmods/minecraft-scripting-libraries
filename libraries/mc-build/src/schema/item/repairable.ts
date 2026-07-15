import { array, Infer, object, string, union } from "superstruct";
import { MolangSchema } from "../common";

/**
 * Superstruct schema for the item repairable component.
 */
export const ItemRepairableComponentSchema = object({
  repair_items: array(
    union([
      string(),
      object({
        items: array(string()),
        repair_amount: MolangSchema,
      }),
    ]),
  ),
});

/**
 * Type for the item repairable component definition.
 */
export type ItemRepairableComponent = Infer<typeof ItemRepairableComponentSchema>;
