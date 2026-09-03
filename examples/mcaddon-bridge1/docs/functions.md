---
title: "Bridge Example 1 Functions"
description: "Integration-test API exposed by mcaddon-bridge1."
---

# Bridge Example 1 Functions

## `greet`

A synchronous function that returns a greeting.

```ts
greet(name: string)
```

### Example

```ts
const result = await api.call("greet", "value");
```

## `sum`

A synchronous function that returns the sum of two numbers.

```ts
sum(num1: number, num2: number)
```

### Example

```ts
const result = await api.call("sum", 0, 0);
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
