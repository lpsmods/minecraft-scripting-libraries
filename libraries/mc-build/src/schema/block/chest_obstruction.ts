import { defaulted, enums, Infer, object } from "superstruct";

/**
 * Allowed values for a chest obstruction rule.
 */
export enum ChestObstructionRule {
  Always = "always",
  Never = "never",
  Shape = "shape",
}

/**
 * Superstruct schema for the block chest obstruction component.
 */
export const BlockChestObstructionComponentSchema = object({
  obstruction_rule: defaulted(enums(Object.values(ChestObstructionRule)), ChestObstructionRule.Shape),
});

/**
 * Type for the block chest obstruction component definition.
 */
export type BlockChestObstructionComponent = Infer<typeof BlockChestObstructionComponentSchema>;
