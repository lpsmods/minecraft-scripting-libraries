import { CameraSchema, type Camera, type OpenResourceData } from "../schema";
import { defineResource, identifiedResource } from "./resource";

/** Defines a camera preset. */
export function defineCamera(data: Camera): Camera {
  return defineResource(data, CameraSchema);
}

/** Creates a camera preset. */
export function camera(identifier: string, data?: OpenResourceData) {
  return identifiedResource(CameraSchema, "minecraft:camera_preset", identifier, data);
}
