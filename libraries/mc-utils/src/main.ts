import { StartupEvent, system } from "@minecraft/server";

import { AddonUtils } from "./utils/addon";

/**
 * Current package version.
 */
export const VERSION = "1.0.0";

function startup(event: StartupEvent): void {
  console.info("SETUP");
}

/**
 * Initializes the package runtime hooks.
 */
export function setup(namespace?: string): void {
  AddonUtils.addonId = namespace ?? "mcutils";
  system.beforeEvents.startup.subscribe(startup);
}
