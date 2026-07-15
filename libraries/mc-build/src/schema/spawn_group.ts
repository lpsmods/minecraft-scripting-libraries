import { Infer } from "superstruct";
import { OpenObjectSchema } from "./resource";

/** Open schema for a spawn group. */
export const SpawnGroupSchema = OpenObjectSchema;

export type SpawnGroup = Infer<typeof SpawnGroupSchema>;
