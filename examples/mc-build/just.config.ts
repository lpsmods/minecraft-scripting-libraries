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
import {
  changelogTask,
  generateTask,
  langTask,
  minifyTask,
  stagePacksTask,
  syncManifestTask,
  validatePacksTask,
  validateReferencesTask,
  getPackageVersion,
} from "@lpsmods/mc-build";
import path from "path";
import { buildPacks } from "./build";

// Setup env variables
setupEnvironment(path.resolve(__dirname, ".env"));
const projectName = getOrThrowFromProcess("PROJECT_NAME");
const projectVersion = getPackageVersion();

const stageDir = path.resolve(__dirname, "build");
const stageBp = path.join(stageDir, "behavior_packs");
const stageRp = path.join(stageDir, "resource_packs");
const packOptions = { rootDir: __dirname, projectName };

const copyTaskOptions: CopyTaskParameters = {
  copyToBehaviorPacks: [path.join(stageBp, projectName)],
  copyToScripts: [],
  copyToResourcePacks: [path.join(stageRp, projectName)],
};

const mcaddonTaskOptions: ZipTaskParameters = {
  ...copyTaskOptions,
  outputFile: `./dist/packages/${projectName}-${projectVersion}.mcaddon`,
};

// Lint
task("lint", coreLint(["scripts/**/*.ts"], argv().fix));

// Build
task(
  "generate",
  generateTask(
    ({ behaviorPack, resourcePack, namespace }) => buildPacks(behaviorPack, resourcePack, namespace),
    packOptions,
  ),
);
task("sync-manifests", syncManifestTask({ ...packOptions, version: projectVersion }));
task("lang", langTask(packOptions));
task("validate", validatePacksTask(packOptions));
task("validate-references", validateReferencesTask(packOptions));
task("minify", minifyTask([path.join(stageBp, projectName), path.join(stageRp, projectName)]));
task("changelog", changelogTask());
task("stage-packs", stagePacksTask(packOptions));
task(
  "build",
  series("stage-packs", "changelog", "generate", "sync-manifests", "lang", "validate", "validate-references", "minify"),
);

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
    [
      "build.ts",
      "changelog.json",
      ".env",
      "scripts/**/*.ts",
      "!scripts/guide/changelog.ts",
      "behavior_packs/**/*",
      "resource_packs/**/*",
    ],
    series("clean-local", "build", "package"),
  ),
);

// Mcaddon
task("createMcaddonFile", mcaddonTask(mcaddonTaskOptions));
task("mcaddon", series("clean-local", "build", "createMcaddonFile"));
