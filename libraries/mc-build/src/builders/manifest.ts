import { assert } from "superstruct";
import {
  ManifestModuleType,
  ManifestSchema,
  type Manifest,
  type ManifestModule,
  type ManifestVersion,
  type PackVersion,
} from "../schema";
import { MIN_ENGINE_VERSION } from "../constants";

type ManifestModuleOptions = Omit<ManifestModule, "type" | "uuid" | "version"> & {
  version?: ManifestVersion;
};

/**
 * Defines a pack manifest.
 */
export function defineManifest(data: Manifest): Manifest {
  assert(data, ManifestSchema);
  return data;
}

/**
 * Creates a pack manifest.
 */
export function manifest(name: string, uuid: string, version: ManifestVersion = [1, 0, 0]) {
  const data: Manifest = {
    format_version: 2,
    header: {
      name,
      description: name,
      uuid,
      version,
      min_engine_version: MIN_ENGINE_VERSION,
    },
    modules: [],
  };

  return {
    description(description: string) {
      data.header.description = description;
      return this;
    },
    minEngineVersion(version: PackVersion) {
      data.header.min_engine_version = version;
      return this;
    },
    module(type: ManifestModuleType, uuid: string, options: ManifestModuleOptions = {}) {
      data.modules.push({
        type,
        uuid,
        version: options.version ?? version,
        ...options,
      });
      return this;
    },
    dependency(uuid: string, dependencyVersion: ManifestVersion = version) {
      data.dependencies ??= [];
      data.dependencies.push({ uuid, version: dependencyVersion });
      return this;
    },
    moduleDependency(moduleName: string, dependencyVersion: ManifestVersion) {
      data.dependencies ??= [];
      data.dependencies.push({ module_name: moduleName, version: dependencyVersion });
      return this;
    },
    capability(capability: string) {
      data.capabilities ??= [];
      data.capabilities.push(capability);
      return this;
    },
    metadata(key: string, value: unknown) {
      data.metadata ??= {};
      data.metadata[key] = value;
      return this;
    },
    build(): Manifest {
      return ManifestSchema.create(data) as Manifest;
    },
  };
}

/**
 * Creates a behavior-pack manifest with its data module configured.
 */
export function behaviorPackManifest(
  name: string,
  packUuid: string,
  moduleUuid: string,
  version: ManifestVersion = [1, 0, 0],
) {
  return manifest(name, packUuid, version).module(ManifestModuleType.Data, moduleUuid);
}

/**
 * Creates a resource-pack manifest with its resources module configured.
 */
export function resourcePackManifest(
  name: string,
  packUuid: string,
  moduleUuid: string,
  version: ManifestVersion = [1, 0, 0],
) {
  return manifest(name, packUuid, version).module(ManifestModuleType.Resources, moduleUuid);
}
