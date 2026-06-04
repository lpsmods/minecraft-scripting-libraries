# @lpsmods/mcaddon-bridge

![Version](https://shields.io/npm/v/@lpsmods/mcaddon-bridge)
[![Downloads](https://shields.io/npm/dm/@lpsmods/mcaddon-bridge)](https://www.npmjs.com/package/@lpsmods/mcaddon-bridge)
[![Issues](https://img.shields.io/github/issues/lpsmods/minecraft-scripting-libraries)](https://github.com/lpsmods/minecraft-scripting-libraries/issues)

A package to communicate between Minecraft Add-Ons.

## Dependencies

```json
[
  { "module_name": "@minecraft/server", "version": "2.1.0" },
  { "module_name": "@minecraft/server-ui", "version": "2.0.0" }
]
```

## Features

- Send data between Add-Ons using packets.
- Create your own API bridge for other Add-Ons!

## Example

Create the api.

```ts
import { Bridge } from "@lpsmods/mcaddon-bridge";

// Create a new bridge (aka API)
const api = new Bridge("com.example.myPack");

// Basic property
api.defineProperty("name", {
  value: "Steve",
  writeable: true,
  enumerable: true,
  configurable: true,
});

// Getter and Setter
api.defineProperty("fullName", {
  get() {
    const firstName = this.getDynamicProperty("first_name");
    const lastName = this.getDynamicProperty("last_name");
    return `${firstName} ${lastName}`;
  },

  set(value) {
    const parts = value.split(" ");
    this.setDynamicProperty("first_name", parts[0]);
    this.setDynamicProperty("last_name", parts[1]);
  },
  enumerable: true,
  configurable: true,
});

// Simple function property
api.defineProperty("greet", {
  value: function (name: string) {
    console.warn(`Hello, ${name}!`);
  },
  writeable: true,
  enumerable: true,
  configurable: true,
});
```

Use the API from a different pack.

```ts
import { world } from "@minecraft/server";
import { connect } from "@lpsmods/mcaddon-bridge";

function worldLoad(): void {
  // Connect to the api
  connect("creator_example")
    .then((api) => {
      console.warn(api.get("name"));
      api.set("name", "Bob");
      console.warn(api.get("name"));

      console.warn(api.get("fullName"));
      api.set("fullName", "Steve Black");
      console.warn(api.get("fullName"));

      api.call("greet", "Alex");
    })
    .catch((err) => {
      console.warn(`API error: ${String(err)}`);
    });
}

world.afterEvents.worldLoad.subscribe(worldLoad);
```

> Not associated with or approved by Mojang Studios or Microsoft
