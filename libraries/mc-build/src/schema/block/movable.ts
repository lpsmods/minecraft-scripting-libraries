import { enums, Infer, object, optional } from "superstruct";

enum MovementType {
  PushPull = "push_pull",
  Push = "push",
  Popped = "popped",
  Immoveable = "immoveable",
}

/**
 * Superstruct schema for the movement type.
 */
export const MovementTypeSchema = enums(Object.values(MovementType));

/**
 * Superstruct schema for the block movable component.
 */
export const BlockMovableComponentSchema = object({
  movement_type: optional(MovementTypeSchema),
  sticky: optional(MovementTypeSchema),
});

/**
 * Type for the block movable component definition.
 */
export type BlockMovableComponent = Infer<typeof BlockMovableComponentSchema>;
