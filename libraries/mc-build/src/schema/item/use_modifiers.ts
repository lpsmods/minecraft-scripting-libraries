import { boolean, defaulted, enums, Infer, number, object, string } from "superstruct";

/**
 * Allowed values for a start using.
 */
export enum StartUsing {
  IfFirst = "if_first",
  Always = "always",
}

/**
 * Superstruct schema for the item use modifiers component.
 */
export const ItemUseModifiersComponentSchema = object({
  emit_vibrations: defaulted(boolean(), true),
  movement_modifier: number(),
  start_sound: string(),
  start_using: defaulted(enums(Object.values(StartUsing)), StartUsing.IfFirst),
  use_duration: number(),
});

/**
 * Type for the item use modifiers component definition.
 */
export type ItemUseModifiersComponent = Infer<typeof ItemUseModifiersComponentSchema>;
