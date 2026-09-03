---
title: "Bridge Example 2"
description: "Integration-test API exposed by mcaddon-bridge2."
---

# Bridge Example 2

Integration-test API exposed by mcaddon-bridge2.

- **Add-on ID:** `dev.lpsmods.example2`
- **Version:** `1.0.0`
- **Source:** `api2.ts`

## API

- [Properties](./properties.md)
- [Functions](./functions.md)

## Scripting API example

Connect from a different behavior pack before using the properties and functions in this API:

```ts
import { world } from "@minecraft/server";
import { connect } from "@lpsmods/mcaddon-bridge";

world.afterEvents.worldLoad.subscribe(async () => {
  const api = await connect("dev.lpsmods.example2", { version: "^1.0.0" });

  // Use api.get(), api.set(), and api.call() here.
});
```
