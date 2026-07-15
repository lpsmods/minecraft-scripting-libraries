import { defaulted, Infer, string, type } from "superstruct";
import { identifiedDataSchema } from "../resource";

/** Superstruct schema for a world-generation structure set. */
export const StructureSetSchema = type({
  format_version: defaulted(string(), "1.21.20"),
  "minecraft:structure_set": identifiedDataSchema(),
});

export type StructureSet = Infer<typeof StructureSetSchema>;
