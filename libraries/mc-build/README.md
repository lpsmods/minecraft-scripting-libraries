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

> Not associated with or approved by Mojang Studios or Microsoft
