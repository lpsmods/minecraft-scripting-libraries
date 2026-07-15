import { FogSchema, type Fog, type OpenResourceData } from "../schema";
import { defineResource, identifiedResource } from "./resource";

/** Defines fog settings. */
export function defineFog(data: Fog): Fog {
  return defineResource(data, FogSchema);
}

/** Creates fog settings. */
export function fog(identifier: string, data?: OpenResourceData) {
  return identifiedResource(FogSchema, "minecraft:fog_settings", identifier, data);
}
