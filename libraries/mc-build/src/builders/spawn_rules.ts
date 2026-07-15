import { assert } from "superstruct";
import { SpawnRuleComponentTypes, SpawnRules, SpawnRulesData, SpawnRulesSchema } from "../schema";

/**
 * Defines the spawn rules asset.
 */
export function defineSpawnRules(data: SpawnRules): SpawnRules {
  assert(data, SpawnRulesSchema);
  return data;
}

/**
 * Creates a spawn rules definition.
 */
export function spawnRules(identifier: string, population_control: string = "monster") {
  const data: Partial<SpawnRulesData> = {
    description: {
      identifier,
      population_control,
    },
    conditions: [],
  };

  return {
    condition<K extends keyof SpawnRuleComponentTypes>(value: Record<K, SpawnRuleComponentTypes[K]>) {
      data.conditions ??= [];
      data.conditions.push(value);
      return this;
    },

    build(): SpawnRules {
      return SpawnRulesSchema.create({ "minecraft:spawn_rules": data }) as SpawnRules;
    },
  };
}
