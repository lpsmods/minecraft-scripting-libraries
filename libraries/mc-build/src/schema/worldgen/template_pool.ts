import { defaulted, Infer, string, type } from "superstruct";
import { identifiedDataSchema } from "../resource";

/** Superstruct schema for a world-generation template pool. */
export const TemplatePoolSchema = type({
  format_version: defaulted(string(), "1.21.20"),
  "minecraft:template_pool": identifiedDataSchema(),
});

export type TemplatePool = Infer<typeof TemplatePoolSchema>;
