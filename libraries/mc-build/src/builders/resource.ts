import { assert, type Struct } from "superstruct";
import { type OpenResourceData } from "../schema";

export type ResourceBuilder<T> = {
  set(key: string, value: unknown): ResourceBuilder<T>;
  build(): T;
};

export function defineResource<T>(data: T, schema: Struct<T>): T {
  assert(data, schema);
  return data;
}

export function resourceBuilder<T>(schema: Struct<T>, data: OpenResourceData): ResourceBuilder<T> {
  return {
    set(key: string, value: unknown) {
      data[key] = value;
      return this;
    },
    build(): T {
      return schema.create(data);
    },
  };
}

export function identifiedResource<T>(
  schema: Struct<T>,
  root: string,
  identifier: string,
  data: OpenResourceData = {},
): ResourceBuilder<T> {
  const payload: OpenResourceData = {
    ...data,
    description: {
      ...((data.description as OpenResourceData | undefined) ?? {}),
      identifier,
    },
  };
  const resource: OpenResourceData = {
    [root]: { ...payload },
  };
  return {
    set(key: string, value: unknown) {
      payload[key] = value;
      resource[root] = { ...payload };
      return this;
    },
    build(): T {
      return schema.create(resource);
    },
  };
}
