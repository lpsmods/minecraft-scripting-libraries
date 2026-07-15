import { EntitySchema, ClientEntitySchema, type Entity, type OpenResourceData, type ClientEntity } from "../schema";
import { defineResource, identifiedResource } from "./resource";

/** Defines a behavior-pack entity. */
export function defineEntity(data: Entity): Entity {
  return defineResource(data, EntitySchema);
}

/** Defines a resource-pack entity. */
export function defineClientEntity(data: ClientEntity): ClientEntity {
  return defineResource(data, ClientEntitySchema);
}

/** Creates a behavior-pack entity. */
export function entity(identifier: string, data?: OpenResourceData) {
  return identifiedResource(EntitySchema, "minecraft:entity", identifier, data);
}

/** Creates a resource-pack entity. */
export function clientEntity(identifier: string, data?: OpenResourceData) {
  return identifiedResource(ClientEntitySchema, "minecraft:client_entity", identifier, data);
}
