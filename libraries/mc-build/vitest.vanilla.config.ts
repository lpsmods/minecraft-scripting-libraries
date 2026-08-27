import { defineConfig } from "vitest/config";
import config from "./vitest.config";

export default defineConfig({
  ...config,
  test: {
    ...config.test,
    include: ["integration/**/*.test.ts"],
    hookTimeout: 240_000,
    testTimeout: 120_000,
  },
});
