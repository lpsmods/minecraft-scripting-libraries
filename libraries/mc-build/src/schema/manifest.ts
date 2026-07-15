import {
  array,
  boolean,
  enums,
  Infer,
  literal,
  number,
  object,
  optional,
  record,
  string,
  tuple,
  union,
  unknown,
} from "superstruct";

/** Numeric three-part pack version. */
export const PackVersionSchema = tuple([number(), number(), number()]);

/** Version accepted by a manifest dependency or module. */
export const ManifestVersionSchema = union([PackVersionSchema, string()]);

/** Supported manifest module types. */
export enum ManifestModuleType {
  Data = "data",
  Resources = "resources",
  Script = "script",
  WorldTemplate = "world_template",
}

/** Superstruct schema for a manifest module type. */
export const ManifestModuleTypeSchema = enums(Object.values(ManifestModuleType));

/** Superstruct schema for a manifest header. */
export const ManifestHeaderSchema = object({
  name: string(),
  description: string(),
  uuid: string(),
  version: ManifestVersionSchema,
  min_engine_version: optional(PackVersionSchema),
  base_game_version: optional(ManifestVersionSchema),
  lock_template_options: optional(boolean()),
  allow_random_seed: optional(boolean()),
});

/** Superstruct schema for a manifest module. */
export const ManifestModuleSchema = object({
  type: ManifestModuleTypeSchema,
  uuid: string(),
  version: ManifestVersionSchema,
  description: optional(string()),
  language: optional(string()),
  entry: optional(string()),
});

/** Superstruct schema for a UUID-based pack dependency. */
export const ManifestPackDependencySchema = object({
  uuid: string(),
  version: ManifestVersionSchema,
});

/** Superstruct schema for a module-name dependency. */
export const ManifestModuleDependencySchema = object({
  module_name: string(),
  version: ManifestVersionSchema,
});

/** Superstruct schema for a Minecraft pack manifest. */
export const ManifestSchema = object({
  format_version: literal(2),
  header: ManifestHeaderSchema,
  modules: array(ManifestModuleSchema),
  dependencies: optional(array(union([ManifestPackDependencySchema, ManifestModuleDependencySchema]))),
  capabilities: optional(array(string())),
  metadata: optional(record(string(), unknown())),
});

/** Numeric three-part pack version. */
export type PackVersion = Infer<typeof PackVersionSchema>;

/** Version accepted by a manifest dependency or module. */
export type ManifestVersion = Infer<typeof ManifestVersionSchema>;

/** Manifest header definition. */
export type ManifestHeader = Infer<typeof ManifestHeaderSchema>;

/** Manifest module definition. */
export type ManifestModule = Infer<typeof ManifestModuleSchema>;

/** UUID-based pack dependency. */
export type ManifestPackDependency = Infer<typeof ManifestPackDependencySchema>;

/** Module-name dependency. */
export type ManifestModuleDependency = Infer<typeof ManifestModuleDependencySchema>;

/** Minecraft pack manifest. */
export type Manifest = Infer<typeof ManifestSchema>;
