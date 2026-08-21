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
- Correlated responses, validation, timeouts, and automatic listener cleanup.
- Async bridge methods, version negotiation, authorization hooks, and typed connection methods.

## Example

Create the api.

```ts
import { Bridge } from "@lpsmods/mcaddon-bridge";

// Create a new bridge (aka API)
const api = new Bridge("com.example.myPack");

// Basic property
api.defineProperty("name", {
  value: "Steve",
  writable: true,
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
  writable: true,
  enumerable: true,
  configurable: true,
});
```

Use the API from a different pack.

```ts
import { world } from "@minecraft/server";
import { connect } from "@lpsmods/mcaddon-bridge";

async function worldLoad(): Promise<void> {
  // Connect to the api
  try {
    const api = await connect("com.example.myPack", {
      version: "^1.0.0",
      timeoutTicks: 100,
    });
    console.warn(await api.get<string>("name"));
    await api.set("name", "Bob");
    console.warn(await api.get<string>("fullName"));
    await api.call<void>("greet", "Alex");
  } catch (err) {
    console.warn(`API error: ${String(err)}`);
  }
}

world.afterEvents.worldLoad.subscribe(worldLoad);
```

The older `connect(addonId, version?)` overload and misspelled `writeable` descriptor option remain supported for compatibility. New code should use `ConnectionOptions` and `writable`.

## Reliability and lifecycle

Requests time out after 100 game ticks by default. Pass `timeoutTicks: 0` to disable this behavior. Timed-out and completed requests always remove their packet listeners. Failures reject with exported `BridgeError` subclasses such as `BridgeTimeoutError`, `BridgeProtocolError`, and `BridgeRemoteError`.

Use `bridge.dispose()` or `Bridge.unregister(addonId)` when an API is no longer available. Duplicate bridge IDs throw instead of silently replacing an existing bridge. A connection can be marked locally disconnected with `connection.disconnect()`.

Descriptors enforce writes and deletion. Values require `writable: true` to be changed, setter descriptors remain writable through their setter, and only `configurable: true` properties can be removed. `bridge.keys()` returns enumerable properties.

Bridge functions may return promises; callers receive their resolved value. An optional `BridgeOptions.authorize(request, sender)` hook can synchronously or asynchronously deny requests. Script-event senders can be imitated by another pack, so packs in the same world must still be treated as mutually trusted.

> Not associated with or approved by Mojang Studios or Microsoft
