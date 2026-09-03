import { copyFile } from "node:fs/promises";
import { build } from "esbuild";

const buildOptions = {
  entryPoints: ["./src"],
  outfile: "dist/mcaddon-bridge.js",
  format: "esm",
  platform: "browser",
  target: "es2024",
  loader: {
    ".json": "json",
  },
  bundle: true,
  external: ["@minecraft/server", "@minecraft/server-ui"],
};

await build(buildOptions);

await build({
  ...buildOptions,
  outfile: "dist/mcaddon-bridge.min.js",
  minify: true,
});

await build({
  entryPoints: ["./src/docs.ts"],
  outfile: "dist/docs.js",
  format: "esm",
  platform: "node",
  target: "node20",
  bundle: true,
  external: ["@lpsmods/docs-generator", "typescript"],
  loader: {
    ".mustache": "text",
  },
});

await copyFile("src/docs.cjs", "dist/docs.cjs");
