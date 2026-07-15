import { SpawnGroupSchema, type OpenResourceData, type SpawnGroup } from "../schema";
import { resourceBuilder, defineResource } from "./resource";

/** Defines a spawn group. */
export function defineSpawnGroup(data: SpawnGroup): SpawnGroup {
  return defineResource(data, SpawnGroupSchema);
}

/** Creates a spawn group. */
export function spawnGroup(data: OpenResourceData = {}) {
  return resourceBuilder(SpawnGroupSchema, data);
}
