import { defaulted, Infer, string, type } from "superstruct";
import { identifiedDataSchema } from "./resource";

/** Superstruct schema for an attachable. */
export const AttachableSchema = type({
  format_version: defaulted(string(), "1.10.0"),
  "minecraft:attachable": identifiedDataSchema(),
});

export type Attachable = Infer<typeof AttachableSchema>;
