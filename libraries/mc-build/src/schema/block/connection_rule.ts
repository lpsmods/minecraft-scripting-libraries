import { array, defaulted, enums, Infer, object } from "superstruct";
import { Direction, DirectionSchema } from "../common";

/**
 * Allowed values for a connections from.
 */
export enum ConnectionsFrom {
  All = "all",
  OnlyFences = "only_fences",
  None = "none",
}

/**
 * Superstruct schema for the block connection rule component.
 */
export const BlockConnectionRuleComponentSchema = object({
  accepts_connections_from: defaulted(enums(Object.values(ConnectionsFrom)), ConnectionsFrom.All),
  enabled_directions: defaulted(array(DirectionSchema), [
    Direction.North,
    Direction.East,
    Direction.South,
    Direction.West,
  ]),
});

/**
 * Type for the block connection rule component definition.
 */
export type BlockConnectionRuleComponent = Infer<typeof BlockConnectionRuleComponentSchema>;
