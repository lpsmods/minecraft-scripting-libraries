import { JigsawSchema, type Jigsaw, type OpenResourceData } from "../../schema";
import { defineResource, identifiedResource } from "../resource";

/** Defines a jigsaw structure. */
export function defineJigsaw(data: Jigsaw): Jigsaw {
  return defineResource(data, JigsawSchema);
}

/** Creates a jigsaw structure. */
export function jigsaw(identifier: string, data?: OpenResourceData) {
  return identifiedResource(JigsawSchema, "minecraft:jigsaw", identifier, data);
}

export const jigsawStructure = jigsaw;
