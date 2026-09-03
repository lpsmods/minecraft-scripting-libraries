---
title: "Bridge Example 1"
description: "Integration-test API exposed by mcaddon-bridge1."
---

# Bridge Example 1

Integration-test API exposed by mcaddon-bridge1.

- **Add-on ID:** `dev.lpsmods.example1`
- **Version:** `1.0.0`
- **Source:** `api1.ts`

## API

- [Properties](./properties.md)
- [Functions](./functions.md)

## Scripting API example

Connect from a different behavior pack before using the properties and functions in this API:

```ts
import { world } from "@minecraft/server";
import { connect } from "@lpsmods/mcaddon-bridge";

world.afterEvents.worldLoad.subscribe(async () => {
  const api = await connect("dev.lpsmods.example1", { version: "^1.0.0" });

  // Use api.get(), api.set(), and api.call() here.
});
```
