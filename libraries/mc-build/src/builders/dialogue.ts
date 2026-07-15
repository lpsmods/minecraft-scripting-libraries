import { DialogueSchema, type Dialogue, type OpenResourceData } from "../schema";
import { resourceBuilder, defineResource } from "./resource";

/** Defines an NPC dialogue file. */
export function defineDialogue(data: Dialogue): Dialogue {
  return defineResource(data, DialogueSchema);
}

/** Creates an NPC dialogue file. */
export function dialogue(scenes: OpenResourceData[] = []) {
  return resourceBuilder(DialogueSchema, {
    "minecraft:npc_dialogue": {
      scenes,
    },
  });
}
