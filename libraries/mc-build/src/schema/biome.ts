import { defaulted, Infer, string, type } from "superstruct";
import { identifiedDataSchema } from "./resource";

/** Superstruct schema for a behavior-pack biome. */
export const BiomeSchema = type({
  format_version: defaulted(string(), "1.21.40"),
  "minecraft:biome": identifiedDataSchema(),
});

/** Superstruct schema for a resource-pack biome. */
export const ClientBiomeSchema = type({
  format_version: defaulted(string(), "1.21.40"),
  "minecraft:client_biome": identifiedDataSchema(),
});

export type Biome = Infer<typeof BiomeSchema>;
export type ClientBiome = Infer<typeof ClientBiomeSchema>;
