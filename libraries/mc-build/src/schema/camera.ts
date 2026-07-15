import { defaulted, Infer, string, type } from "superstruct";
import { identifiedDataSchema } from "./resource";

/** Superstruct schema for a camera preset. */
export const CameraSchema = type({
  format_version: defaulted(string(), "1.19.50"),
  "minecraft:camera_preset": identifiedDataSchema(),
});

export const CameraPresetSchema = CameraSchema;

export type Camera = Infer<typeof CameraSchema>;
export type CameraPreset = Camera;
