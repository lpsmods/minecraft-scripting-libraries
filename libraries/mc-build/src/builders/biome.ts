import {
  BiomeSchema as BiomeSchema,
  ClientBiomeSchema as ClientBiomeSchema,
  type Biome,
  type OpenResourceData,
  type ClientBiome,
} from "../schema";
import { defineResource, identifiedResource } from "./resource";

/** Defines a behavior-pack biome. */
export function defineBiome(data: Biome): Biome {
  return defineResource(data, BiomeSchema);
}

/** Defines a resource-pack biome. */
export function defineClientBiome(data: ClientBiome): ClientBiome {
  return defineResource(data, ClientBiomeSchema);
}

/** Creates a behavior-pack biome. */
export function biome(identifier: string, data?: OpenResourceData) {
  return identifiedResource(BiomeSchema, "minecraft:biome", identifier, data);
}

/** Creates a resource-pack biome. */
export function clientBiome(identifier: string, data?: OpenResourceData) {
  return identifiedResource(ClientBiomeSchema, "minecraft:client_biome", identifier, data);
}
