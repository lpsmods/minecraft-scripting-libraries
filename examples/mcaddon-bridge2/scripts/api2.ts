import { Bridge } from "@lpsmods/mcaddon-bridge";
import { system } from "@minecraft/server";

let fullName = "Steve Two";

const api = new Bridge("dev.lpsmods.example2", {
  version: "1.0.0",
  name: "Bridge Example 2",
  description: "Integration-test API exposed by mcaddon-bridge2.",
});

// Read-only value channels, including truthy values.
api.defineProperty("integer", { value: 1, enumerable: true });
api.defineProperty("float", { value: 0.5, enumerable: true });
api.defineProperty("string", { value: "Hello, World!", enumerable: true });
api.defineProperty("boolean", { value: true, enumerable: true });

// Writable value channel.
api.defineProperty("name", {
  value: "Steve2",
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
  enumerable: true,
  configurable: true,
});

// Synchronous call channels.
api.defineProperty("greet", {
  value: (name: string) => `Hello, ${name}, from example2!`,
  enumerable: true,
});
api.defineProperty("mul", {
  value: (num1: number, num2: number) => num1 * num2,
  enumerable: true,
});

// Asynchronous call channel.
api.defineProperty("asyncEcho", {
  value: (value: string) =>
    new Promise<string>((resolve) => {
      system.runTimeout(() => resolve(`example2:${value}`), 1);
    }),
  enumerable: true,
});

// Remote error channel.
api.defineProperty("fail", {
  value: () => {
    throw new Error("example2 intentional failure");
  },
  enumerable: true,
});
