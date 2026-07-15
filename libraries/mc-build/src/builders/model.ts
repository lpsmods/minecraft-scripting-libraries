import { ModelSchema, type Model, type OpenResourceData } from "../schema";
import { resourceBuilder, defineResource } from "./resource";

/** Defines a geometry model file. */
export function defineModel(data: Model): Model {
  return defineResource(data, ModelSchema);
}

/** Creates a geometry model file. */
export function model(geometry: OpenResourceData[] = []) {
  return resourceBuilder(ModelSchema, {
    "minecraft:geometry": geometry,
  });
}

export const geometryModel = model;
