import { BlockCullingSchema, type BlockCulling, type OpenResourceData } from "../schema";
import { defineResource, identifiedResource } from "./resource";

/** Defines block culling rules. */
export function defineBlockCulling(data: BlockCulling): BlockCulling {
  return defineResource(data, BlockCullingSchema);
}

/** Creates block culling rules. */
export function blockCulling(identifier: string, data?: OpenResourceData) {
  return identifiedResource(BlockCullingSchema, "minecraft:block_culling_rules", identifier, data);
}

export const blockCullingRules = blockCulling;
