import { defaulted, Infer, string, type } from "superstruct";
import { identifiedDataSchema } from "./resource";

/** Superstruct schema for a particle effect. */
export const ParticleSchema = type({
  format_version: defaulted(string(), "1.10.0"),
  particle_effect: identifiedDataSchema(),
});

export const ParticleEffectSchema = ParticleSchema;

export type Particle = Infer<typeof ParticleSchema>;
export type ParticleEffect = Particle;
