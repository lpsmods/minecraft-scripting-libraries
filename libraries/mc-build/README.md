# @lpsmods/mc-build

![Version](https://shields.io/npm/v/@lpsmods/mc-build)
[![Downloads](https://shields.io/npm/dm/@lpsmods/mc-build)](https://www.npmjs.com/package/@lpsmods/mc-build)
[![Issues](https://img.shields.io/github/issues/lpsmods/minecraft-scripting-libraries)](https://github.com/lpsmods/minecraft-scripting-libraries/issues)

Utils to help build Minecraft: Bedrock Edition Add-Ons.

> NOTE: This project is still under heavy development. Features may be removed or changed in future releases.

## Features

- Typed builders and validation for add-on JSON files.
- APIs for creating, opening, and exporting complete add-ons.
- Support for behavior packs, resource packs, and world generation.
- Build tasks for minifying JSON and generating changelogs.

## Vanilla schema integration tests

Run `npm run test:vanilla --workspace @lpsmods/mc-build` from the repository root.
This separate integration suite requires Git and network access to GitHub; normal
`npm test` runs remain offline. It downloads a shallow checkout of
[Mojang's bedrock-samples](https://github.com/Mojang/bedrock-samples), pinned by
`REVISION` in `integration/vanilla.test.ts`, and removes the temporary checkout
after the run. Update that commit SHA to test a newer vanilla release.

Both packs' JSON files are parsed as JSON5 and passed to the same
`validateResource` schema validator used by the pack validation task. Every
supported resource must pass; schema failures are not allowlisted. Unsupported
resources are reported separately, not counted as successful validation.
Full per-pack reports are written to `build/vanilla-validation/` inside mc-build,
including all failures and unsupported paths. A failing run exposes schema
compatibility gaps (including legacy or vanilla-only formats); it does not
necessarily mean the upstream sample is invalid. These positive fixtures
complement, rather than replace, unit tests that reject invalid data.

## Usage

Creating a block:

```ts
import { block, emitJson } from "@lpsmods/mc-build";

const stone = block("demo:stone").texture("stone").geometry().build();

emitJson("behavior_packs/demo/blocks/stone.json", stone);
```

Minifying an entire project:

```ts
import { task } from "just-scripts";
import { minifyTask } from "@lpsmods/mc-build";

task("minify", minifyTask(["behavior_packs/demo", "resource_packs/demo"]));
```

Run with `npx just-scripts minify`.

## Pack pipeline tasks

Use `getPackageVersion()` to read `package.json` in the current directory, or
`getPackageVersion(__dirname)` for an explicit project directory. It returns a
three-part version string: `1.2.3-rc.1+build.4` becomes `1.2.3`. Missing or invalid
versions throw an error. Pass the result to `syncManifestTask({ version, ...options })`.

These factories return callbacks for `just-scripts`. Paths resolve against
`rootDir` (default: the current working directory). Supply `projectName` or set
`PROJECT_NAME`. Staged paths default to `build/behavior_packs/<projectName>` and
`build/resource_packs/<projectName>`; override both with `directories`.

```ts
import { series, task } from "just-scripts";
import {
  stagePacksTask, generateTask, syncManifestTask, langTask,
  validatePacksTask, validateReferencesTask, minifyTask,
} from "@lpsmods/mc-build";
import { buildPacks } from "./build";

const options = { rootDir: __dirname, projectName: "demo" };
task("stage", stagePacksTask(options));
task("generate", generateTask(async ({ behaviorPack, resourcePack, namespace }) => {
  await buildPacks(behaviorPack, resourcePack, namespace);
}, options));
task("version", syncManifestTask({ ...options, version: [1, 2, 0] }));
task("lang", langTask({
  ...options,
  entries: { en_US: { "item.demo:example.name": "Example" } },
  requiredKeys: ["item.demo:example.name"],
}));
task("validate", validatePacksTask(options));
task("references", validateReferencesTask(options));
task("minify", minifyTask([
  "build/behavior_packs/demo", "build/resource_packs/demo",
]));
task("build", series("stage", "generate", "version", "lang", "validate", "references", "minify"));
```

- `stagePacksTask`: replaces staged copies of both source packs, including binary
  assets. Source paths default to `behavior_packs/<projectName>` and
  `resource_packs/<projectName>`; override with `sourceDirectories`. Destinations
  must be separate, nonoverlapping directories within `rootDir`, outside the source
  directories. Symlinked pack contents are rejected. Generation should emit with
  `clean: false` to preserve staged assets.
- `generateTask`: supplies absolute pack paths, `rootDir`, `projectName`, and
  `namespace` to your callback, awaits asynchronous builders, and propagates errors.
  Namespace precedence is `namespace`, `PROJECT_NAMESPACE`, then project name.
- `syncManifestTask`: updates header/module versions and dependencies referencing
  either staged pack's UUID. UUIDs and unrelated dependencies remain unchanged.
  `version` accepts a three-part integer tuple or string, defaulting to
  `PROJECT_VERSION`. Only staged manifests are changed by default.
- `validatePacksTask`: parses all `.json` files as JSON5 and checks supported
  resources using the library's schemas, reporting filenames. Unsupported schemas
  are skipped by default; use `unsupported: "error"` to reject them. Both manifests
  are required. This is not a complete Minecraft engine compatibility check.
- `validateReferencesTask`: checks custom recipe item IDs, loot-table item entries,
  nested loot-table references, `minecraft:loot.table`, and texture files listed in
  item/terrain atlases. Unqualified and `minecraft:` item IDs are treated as vanilla.
  Use `externalItems`, `externalTextures`, and `externalLootTables` to allow exact
  references supplied by vanilla or dependencies. Texture aliases, Molang expressions,
  tags and other reference types are not checked.
- `langTask`: merges `entries` by locale into staged resource-pack `.lang` files,
  preserves existing comments and entries, and rejects duplicate keys. `requiredKeys`
  must have nonempty values in each selected locale. `locales` defaults to supplied
  entry locales, or `en_US`; entry locales are always included. Keep `languages.json`
  in your source pack when registering additional languages.

Watch `build.ts`, `changelog.json`, source packs, and generator inputs. Exclude
generated changelog TypeScript from script watch globs to avoid rebuild loops.

> Not associated with or approved by Mojang Studios or Microsoft
