import { defaulted, Infer, string, type } from "superstruct";

/** Open schema for definitions whose root key depends on the feature type. */
export const FeatureSchema = type({
  format_version: defaulted(string(), "1.13.0"),
});

export type Feature = Infer<typeof FeatureSchema>;
