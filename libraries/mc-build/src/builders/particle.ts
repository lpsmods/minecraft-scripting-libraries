import { ParticleSchema, type OpenResourceData, type Particle } from "../schema";
import { defineResource, identifiedResource } from "./resource";

/** Defines a particle effect. */
export function defineParticle(data: Particle): Particle {
  return defineResource(data, ParticleSchema);
}

/** Creates a particle effect. */
export function particle(identifier: string, data?: OpenResourceData) {
  return identifiedResource(ParticleSchema, "particle_effect", identifier, data);
}
