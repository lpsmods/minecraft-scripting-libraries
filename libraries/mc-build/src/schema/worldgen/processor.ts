import { defaulted, Infer, string, type } from "superstruct";
import { identifiedDataSchema } from "../resource";

/** Superstruct schema for a world-generation processor list. */
export const ProcessorSchema = type({
  format_version: defaulted(string(), "1.21.20"),
  "minecraft:processor_list": identifiedDataSchema(),
});

export const ProcessorListSchema = ProcessorSchema;

export type Processor = Infer<typeof ProcessorSchema>;
export type ProcessorList = Processor;
