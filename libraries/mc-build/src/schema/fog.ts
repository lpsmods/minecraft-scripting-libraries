import { defaulted, Infer, string, type } from "superstruct";
import { identifiedDataSchema } from "./resource";

/** Superstruct schema for fog settings. */
export const FogSchema = type({
  format_version: defaulted(string(), "1.16.100"),
  "minecraft:fog_settings": identifiedDataSchema(),
});

export const FogSettingsSchema = FogSchema;

export type Fog = Infer<typeof FogSchema>;
export type FogSettings = Fog;
