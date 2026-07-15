// From: https://github.com/microsoft/minecraft-samples/blob/main/addon_starter/1_hello_world/just.config.ts
import { argv, parallel, series, task } from "just-scripts";
import {
  CopyTaskParameters,
  cleanTask,
  cleanCollateralTask,
  copyTask,
  coreLint,
  mcaddonTask,
  setupEnvironment,
  ZipTaskParameters,
  STANDARD_CLEAN_PATHS,
  DEFAULT_CLEAN_DIRECTORIES,
  getOrThrowFromProcess,
  watchTask,
} from "@minecraft/core-build-tasks";
import { AddOn, animations, block, changelogTask, getProjectNamespace, item, minifyTask } from "@lpsmods/mc-build";
import path from "path";

// Setup env variables
setupEnvironment(path.resolve(__dirname, ".env"));
const projectName = getOrThrowFromProcess("PROJECT_NAME");
const projectNamespace = getProjectNamespace() ?? projectName;
const projectVersion = getOrThrowFromProcess("PROJECT_VERSION");

const copyTaskOptions: CopyTaskParameters = {
  copyToBehaviorPacks: [`./behavior_packs/${projectName}`],
  copyToScripts: [],
  copyToResourcePacks: [`./resource_packs/${projectName}`],
};

const mcaddonTaskOptions: ZipTaskParameters = {
  ...copyTaskOptions,
  outputFile: `./dist/packages/${projectName}-${projectVersion}.mcaddon`,
};

// Lint
task("lint", coreLint(["scripts/**/*.ts"], argv().fix));

// Build
task("build-packs", () => {
  const behaviorPackDirectory = path.resolve(__dirname, "behavior_packs", projectName);
  const resourcePackDirectory = path.resolve(__dirname, "resource_packs", projectName);

  const addon = AddOn.open({
    behaviorPack: behaviorPackDirectory,
    resourcePack: resourcePackDirectory,
  });

  // Create 100 blocks.
  for (let i = 0; i < 100; i++) {
    addon.behaviorPack.addBlock(block(`${projectNamespace}:example_block_${i}`).menuCategory("construction").displayName(`Example Block ${i}`).build());
  }

  // Create 100 items.
  for (let i = 0; i < 100; i++) {
    addon.behaviorPack.addItem(item(`${projectNamespace}:example_${i}`).menuCategory("items").displayName(`Example ${i}`).build());
  }

  // Create 100 animations.
  for (let i = 0; i < 100; i++) {
    addon.resourcePack.addAnimation(`example_${i}.animation.json`, animations().build());
  }

  addon.emit(
    {
      behaviorPack: behaviorPackDirectory,
      resourcePack: resourcePackDirectory,
    },
    { clean: true },
  );
});
task("minify", minifyTask());
task("changelog", changelogTask());
task("build", series("changelog", "build-packs", "minify"));

// Clean
task("clean-local", cleanTask(DEFAULT_CLEAN_DIRECTORIES));
task("clean-collateral", cleanCollateralTask(STANDARD_CLEAN_PATHS));
task("clean", parallel("clean-local", "clean-collateral"));

// Package
task("copyArtifacts", copyTask(copyTaskOptions));
task("package", series("clean-collateral", "copyArtifacts"));

// Local Deploy used for deploying local changes directly to output via the bundler. It does a full build and package first just in case.
task(
  "local-deploy",
  watchTask(
    ["scripts/**/*.ts", "behavior_packs/**/*.{json,lang,png}", "resource_packs/**/*.{json,lang,png}"],
    series("clean-local", "build", "package"),
  ),
);

// Mcaddon
task("createMcaddonFile", mcaddonTask(mcaddonTaskOptions));
task("mcaddon", series("clean-local", "build", "createMcaddonFile"));
