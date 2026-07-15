import { boolean, Infer, object, union } from "superstruct";
import { Arr3 } from "../common";

/**
 * Superstruct schema for the block collision box component.
 */
export const BlockCollisionBoxComponentSchema = union([boolean(), object({ origin: Arr3, size: Arr3 })]);

/**
 * Type for the block collision box component definition.
 */
export type BlockCollisionBoxComponent = Infer<typeof BlockCollisionBoxComponentSchema>;
