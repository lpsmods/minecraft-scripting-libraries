import { execFile } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import JSON5 from "json5";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { BehaviorPack, ResourcePack } from "@lpsmods/mc-build";

// Pin the corpus so upstream changes do not silently change test expectations.
const REVISION = "736072450c26a7c67f07b1661f29d9a5ebaa14b1";
const REPOSITORY = "https://github.com/Mojang/bedrock-samples.git";
const exec = promisify(execFile);
let checkout: string;

function jsonFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink: ${file}`);
    return entry.isDirectory() ? jsonFiles(file) :
      entry.isFile() && entry.name.toLowerCase().endsWith(".json") ? [file] : [];
  }).sort();
}

describe("Mojang vanilla pack schema compatibility", () => {
  beforeAll(async () => {
    checkout = fs.mkdtempSync(path.join(os.tmpdir(), "mc-build-vanilla-"));
    const git = (...args: string[]) => exec("git", args, {
      cwd: checkout,
      timeout: 180_000,
      maxBuffer: 4 * 1024 * 1024,
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    });
    await git("init", "--quiet");
    await git("fetch", "--quiet", "--depth=1", REPOSITORY, REVISION);
    await git("checkout", "--quiet", "--detach", "FETCH_HEAD");
    const { stdout } = await git("rev-parse", "HEAD");
    expect(stdout.trim()).toBe(REVISION);
  });

  afterAll(() => {
    if (checkout) fs.rmSync(checkout, { recursive: true, force: true, maxRetries: 3 });
  });

  it.each([
    ["behavior_pack", () => new BehaviorPack()],
    ["resource_pack", () => new ResourcePack()],
  ] as const)("validates supported JSON in %s", (name, createPack) => {
    const directory = path.join(checkout, name);
    const pack = createPack();
    const files = jsonFiles(directory);
    const validated: string[] = [];
    const unsupported: string[] = [];
    const failures: { file: string; error: string }[] = [];

    // Do not stop at the first mismatch: record every failing resource.
    for (const file of files) {
      const relative = path.relative(directory, file).replaceAll("\\", "/");
      try {
        const data: unknown = JSON5.parse(fs.readFileSync(file, "utf8"));
        (pack.validateResource(relative, data) ? validated : unsupported).push(relative);
      } catch (error) {
        failures.push({ file: relative, error: String(error) });
      }
    }

    const reportDir = path.resolve("build", "vanilla-validation");
    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(path.join(reportDir, `${name}.json`), JSON.stringify({
      repository: REPOSITORY, revision: REVISION, total: files.length,
      validated, unsupported, failures,
    }, null, 2) + "\n");
    console.info(`${name}: ${validated.length} passed, ${failures.length} failed, ${unsupported.length} unsupported`);

    expect(files.length, "The downloaded pack must not be empty").toBeGreaterThan(0);
    expect(validated, "The pack manifest must be validated").toContain("manifest.json");
    expect(validated.length, "Must validate resources beyond the manifest").toBeGreaterThan(1);
    expect(failures.length, [
      `${name}: ${failures.length} schema/parse failures at ${REVISION}.`,
      ...failures.slice(0, 20).map(({ file, error }) => `${file}: ${error}`),
      `Full results (including unsupported files): ${path.join(reportDir, `${name}.json`)}`,
    ].join("\n")).toBe(0);
  });
});
