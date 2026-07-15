import { ProcessorSchema, type OpenResourceData, type Processor } from "../../schema";
import { defineResource, identifiedResource } from "../resource";

/** Defines a world-generation processor list. */
export function defineProcessor(data: Processor): Processor {
  return defineResource(data, ProcessorSchema);
}

/** Creates a world-generation processor list. */
export function processor(identifier: string, data?: OpenResourceData) {
  return identifiedResource(ProcessorSchema, "minecraft:processor_list", identifier, data);
}

export const processorList = processor;
