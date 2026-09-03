---
title: "Bridge Example 2 Properties"
description: "Integration-test API exposed by mcaddon-bridge2."
---

# Bridge Example 2 Properties

## `integer`

An integer value.

| Attribute    | Value    |
| ------------ | -------- |
| Type         | `number` |
| Writable     | `false`  |
| Enumerable   | `true`   |
| Configurable | `false`  |

### Example

```ts
const value = await api.get<number>("integer");
```

## `float`

A floating-point value.

| Attribute    | Value    |
| ------------ | -------- |
| Type         | `number` |
| Writable     | `false`  |
| Enumerable   | `true`   |
| Configurable | `false`  |

### Example

```ts
const value = await api.get<number>("float");
```

## `string`

A string value.

| Attribute    | Value    |
| ------------ | -------- |
| Type         | `string` |
| Writable     | `false`  |
| Enumerable   | `true`   |
| Configurable | `false`  |

### Example

```ts
const value = await api.get<string>("string");
```

## `boolean`

A boolean value.

| Attribute    | Value     |
| ------------ | --------- |
| Type         | `boolean` |
| Writable     | `false`   |
| Enumerable   | `true`    |
| Configurable | `false`   |

### Example

```ts
const value = await api.get<boolean>("boolean");
```

## `name`

A writable string value.

| Attribute    | Value    |
| ------------ | -------- |
| Type         | `string` |
| Writable     | `true`   |
| Enumerable   | `true`   |
| Configurable | `true`   |

### Example

```ts
const value = await api.get<string>("name");
await api.set("name", "value");
```

## `fullName`

A getter/setter string value.

| Attribute    | Value    |
| ------------ | -------- |
| Type         | `string` |
| Writable     | `true`   |
| Enumerable   | `true`   |
| Configurable | `true`   |

### Example

```ts
const value = await api.get<string>("fullName");
await api.set("fullName", "value");
```
