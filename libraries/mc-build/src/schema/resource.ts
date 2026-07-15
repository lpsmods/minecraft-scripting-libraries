import { record, string, type, unknown } from "superstruct";

export const OpenObjectSchema = record(string(), unknown());

export const IdentifiedDescriptionSchema = type({
  identifier: string(),
});

export function identifiedDataSchema() {
  return type({
    description: IdentifiedDescriptionSchema,
  });
}

export type OpenResourceData = Record<string, unknown>;
