---
title: "Bridge Example 2 Functions"
description: "Integration-test API exposed by mcaddon-bridge2."
---

# Bridge Example 2 Functions

## `greet`

A synchronous function that returns a greeting.

```ts
greet(name: string)
```

### Example

```ts
const result = await api.call("greet", "value");
```

## `mul`

A synchronous function that returns the product of two numbers.

```ts
mul(num1: number, num2: number)
```

### Example

```ts
const result = await api.call("mul", 0, 0);
```

## `asyncEcho`

An asynchronous function that echoes the input value after a short delay.

```ts
asyncEcho(value: string)
```

### Example

```ts
const result = await api.call("asyncEcho", "value");
```

## `fail`

A synchronous function that throws an error.

```ts
fail()
```

### Example

```ts
const result = await api.call("fail");
```
