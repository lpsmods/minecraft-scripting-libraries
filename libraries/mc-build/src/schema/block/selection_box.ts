import { boolean, Infer, object, union } from "superstruct";
import { Arr3 } from "../common";

/**
 * Superstruct schema for the block selection box component.
 */
export const BlockSelectionBoxComponentSchema = union([boolean(), object({ origin: Arr3, size: Arr3 })]);

/**
 * Type for the block selection box component definition.
 */
export type BlockSelectionBoxComponent = Infer<typeof BlockSelectionBoxComponentSchema>;
