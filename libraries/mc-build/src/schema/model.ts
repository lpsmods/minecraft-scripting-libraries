import { array, defaulted, Infer, string, type } from "superstruct";
import { OpenObjectSchema } from "./resource";

/** Superstruct schema for a geometry model file. */
export const ModelSchema = type({
  format_version: defaulted(string(), "1.12.0"),
  "minecraft:geometry": defaulted(array(OpenObjectSchema), []),
});

export const GeometryModelSchema = ModelSchema;

export type Model = Infer<typeof ModelSchema>;
export type GeometryModel = Model;
