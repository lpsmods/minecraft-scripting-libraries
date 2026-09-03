import { Bridge } from "@lpsmods/mcaddon-bridge";
import { system } from "@minecraft/server";

let fullName = "Steve Two";

const api = new Bridge("dev.lpsmods.example2", {
  version: "1.0.0",
  name: "Bridge Example 2",
  description: "Integration-test API exposed by mcaddon-bridge2.",
});

// Read-only value channels, including truthy values.
api.defineProperty("integer", { value: 1, enumerable: true, description: "An integer value." });
api.defineProperty("float", { value: 0.5, enumerable: true, description: "A floating-point value." });
api.defineProperty("string", { value: "Hello, World!", enumerable: true, description: "A string value." });
api.defineProperty("boolean", { value: true, enumerable: true, description: "A boolean value." });

// Writable value channel.
api.defineProperty("name", {
  value: "Steve2",
  description: "A writable string value.",
  writable: true,
  enumerable: true,
  configurable: true,
});

// Getter/setter channel.
api.defineProperty("fullName", {
  get: () => fullName,
  set: (value: string) => {
    fullName = value;
  },
  description: "A getter/setter string value.",
  enumerable: true,
  configurable: true,
});

// Synchronous call channels.
api.defineProperty("greet", {
  value: (name: string) => `Hello, ${name}, from example2!`,
  description: "A synchronous function that returns a greeting.",
  enumerable: true,
});
api.defineProperty("mul", {
  value: (num1: number, num2: number) => num1 * num2,
  description: "A synchronous function that returns the product of two numbers.",
  enumerable: true,
});

// Asynchronous call channel.
api.defineProperty("asyncEcho", {
  value: (value: string) =>
    new Promise<string>((resolve) => {
      system.runTimeout(() => resolve(`example2:${value}`), 1);
    }),
  description: "An asynchronous function that echoes the input value after a short delay.",
  enumerable: true,
});

// Remote error channel.
api.defineProperty("fail", {
  value: () => {
    throw new Error("example2 intentional failure");
  },
  description: "A synchronous function that throws an error.",
  enumerable: true,
});
