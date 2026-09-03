import { getPackageVersion, langTask, minifyTask, stagePacksTask, syncManifestTask } from "@lpsmods/mc-build";
import { addonDocsTask } from "@lpsmods/mcaddon-bridge/docs";
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

import { argv, parallel, series, task } from "just-scripts";
import path from "path";

// Setup env variables
setupEnvironment(path.resolve(__dirname, ".env"));
const projectName = getOrThrowFromProcess("PROJECT_NAME");
const projectVersion = getPackageVersion();

// Build a staging copy of behavior_packs/resource_packs so source files stay pretty-printed while packaged assets are minified.
const stageDir = path.resolve(__dirname, "build");
const stageBp = path.join(stageDir, "behavior_packs");
const stageRp = path.join(stageDir, "resource_packs");
const packOptions = { rootDir: __dirname, projectName };

const copyTaskOptions: CopyTaskParameters = {
  copyToBehaviorPacks: [`./behavior_packs/${projectName}`],
  copyToScripts: ["./dist/scripts"],
  copyToResourcePacks: [`./resource_packs/${projectName}`],
};

const mcaddonTaskOptions: ZipTaskParameters = {
  ...copyTaskOptions,
  outputFile: `./dist/packages/${projectName}-${projectVersion}.mcaddon`,
};

// Lint
task("lint", coreLint(["scripts/**/*.ts"], argv().fix));

// Build
task("sync-manifests", syncManifestTask({ ...packOptions, version: projectVersion }));
task("lang", langTask(packOptions));
task("minify", minifyTask([path.join(stageBp, projectName), path.join(stageRp, projectName)]));
task("stage-packs", stagePacksTask(packOptions));
task("build", series("stage-packs", "sync-manifests", "lang", "minify"));

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

// Docs
task("docs", addonDocsTask({ vitepress: { sidebar: true }, agentDocs: true }));
