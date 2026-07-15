import { StructureSetSchema, type OpenResourceData, type StructureSet } from "../../schema";
import { defineResource, identifiedResource } from "../resource";

/** Defines a world-generation structure set. */
export function defineStructureSet(data: StructureSet): StructureSet {
  return defineResource(data, StructureSetSchema);
}

/** Creates a world-generation structure set. */
export function structureSet(identifier: string, data?: OpenResourceData) {
  return identifiedResource(StructureSetSchema, "minecraft:structure_set", identifier, data);
}
