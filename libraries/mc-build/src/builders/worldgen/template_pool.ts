import { TemplatePoolSchema, type OpenResourceData, type TemplatePool } from "../../schema";
import { defineResource, identifiedResource } from "../resource";

/** Defines a world-generation template pool. */
export function defineTemplatePool(data: TemplatePool): TemplatePool {
  return defineResource(data, TemplatePoolSchema);
}

/** Creates a world-generation template pool. */
export function templatePool(identifier: string, data?: OpenResourceData) {
  return identifiedResource(TemplatePoolSchema, "minecraft:template_pool", identifier, data);
}
