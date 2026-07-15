import { defaulted, Infer, string, type } from "superstruct";
import { identifiedDataSchema } from "../resource";

/** Superstruct schema for a jigsaw structure. */
export const JigsawSchema = type({
  format_version: defaulted(string(), "1.21.20"),
  "minecraft:jigsaw": identifiedDataSchema(),
});

export const JigsawStructureSchema = JigsawSchema;

export type Jigsaw = Infer<typeof JigsawSchema>;
export type JigsawStructure = Jigsaw;
