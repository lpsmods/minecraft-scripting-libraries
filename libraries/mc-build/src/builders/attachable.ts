import { AttachableSchema, type Attachable, type OpenResourceData } from "../schema";
import { defineResource, identifiedResource } from "./resource";

/** Defines an attachable. */
export function defineAttachable(data: Attachable): Attachable {
  return defineResource(data, AttachableSchema);
}

/** Creates an attachable. */
export function attachable(identifier: string, data?: OpenResourceData) {
  return identifiedResource(AttachableSchema, "minecraft:attachable", identifier, data);
}
