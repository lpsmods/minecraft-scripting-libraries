import { build } from "esbuild";

const options = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node20",
  packages: "external",
};

await build({
  ...options,
  outfile: "dist/mc-build.js",
});

await build({
  ...options,
  outfile: "dist/mc-build.min.js",
  minify: true,
});
