import { Bridge } from "@lpsmods/mcaddon-bridge";
import { system } from "@minecraft/server";

let fullName = "Steve One";

const api = new Bridge("dev.lpsmods.example1", {
  version: "1.0.0",
  name: "Bridge Example 1",
  description: "Integration-test API exposed by mcaddon-bridge1.",
});

// Read-only value channels, including falsy values.
api.defineProperty("integer", { value: 2, enumerable: true });
api.defineProperty("float", { value: 0.25, enumerable: true });
api.defineProperty("string", { value: "Hello, Legopitstop!", enumerable: true });
api.defineProperty("boolean", { value: false, enumerable: true });

// Writable value channel.
api.defineProperty("name", {
  value: "Steve1",
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
  value: (name: string) => `Hello, ${name}, from example1!`,
  enumerable: true,
});
api.defineProperty("sum", {
  value: (num1: number, num2: number) => num1 + num2,
  enumerable: true,
});

// Asynchronous call channel.
api.defineProperty("asyncEcho", {
  value: (value: string) =>
    new Promise<string>((resolve) => {
      system.runTimeout(() => resolve(`example1:${value}`), 1);
    }),
  enumerable: true,
});

// Remote error channel.
api.defineProperty("fail", {
  value: () => {
    throw new Error("example1 intentional failure");
  },
  enumerable: true,
});
