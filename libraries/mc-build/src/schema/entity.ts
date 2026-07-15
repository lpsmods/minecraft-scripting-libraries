import { defaulted, Infer, string, type } from "superstruct";
import { identifiedDataSchema } from "./resource";

/** Superstruct schema for a behavior-pack entity. */
export const EntitySchema = type({
  format_version: defaulted(string(), "1.21.100"),
  "minecraft:entity": identifiedDataSchema(),
});

/** Superstruct schema for a resource-pack entity. */
export const ClientEntitySchema = type({
  format_version: defaulted(string(), "1.10.0"),
  "minecraft:client_entity": identifiedDataSchema(),
});

export type Entity = Infer<typeof EntitySchema>;
export type ClientEntity = Infer<typeof ClientEntitySchema>;
