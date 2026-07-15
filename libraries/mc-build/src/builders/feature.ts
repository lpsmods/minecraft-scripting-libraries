import { FeatureSchema, type Feature, type OpenResourceData } from "../schema";
import { defineResource, identifiedResource } from "./resource";

/** Defines a feature. */
export function defineFeature(data: Feature): Feature {
  return defineResource(data, FeatureSchema);
}

/** Creates a feature with a caller-selected Minecraft feature root key. */
export function feature(featureType: string, identifier: string, data: OpenResourceData = {}) {
  const root = featureType.includes(":") ? featureType : `minecraft:${featureType}`;
  return identifiedResource(FeatureSchema, root, identifier, data);
}
