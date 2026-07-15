import { Infer, object } from "superstruct";

/**
 * Superstruct schema for the item interact button component.
 */
export const ItemInteractButtonComponentSchema = object({});

/**
 * Type for the item interact button component definition.
 */
export type ItemInteractButtonComponent = Infer<typeof ItemInteractButtonComponentSchema>;
