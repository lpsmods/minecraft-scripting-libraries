import { array, defaulted, Infer, string, type } from "superstruct";
import { OpenObjectSchema } from "./resource";

/** Superstruct schema for an NPC dialogue file. */
export const DialogueSchema = type({
  format_version: defaulted(string(), "1.17.0"),
  "minecraft:npc_dialogue": type({
    scenes: defaulted(array(OpenObjectSchema), []),
  }),
});

export type Dialogue = Infer<typeof DialogueSchema>;
