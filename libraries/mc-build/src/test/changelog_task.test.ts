import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { changelogTask } from "@lpsmods/mc-build";

const OUT_DIR = path.join(process.cwd(), "test-changelog");
const INPUT_FILE = path.join(OUT_DIR, "changelog.json");
const MARKDOWN_FILE = path.join(OUT_DIR, "CHANGELOGS.md");
const IN_GAME_FILE = path.join(OUT_DIR, "scripts", "changelog.ts");

function writeChangelog(contents: string): void {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(INPUT_FILE, contents, "utf8");
}

describe("changelogTask", () => {
  afterEach(() => {
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
  });

  it("generates Markdown and in-game pages from JSON5", () => {
    writeChangelog(`{
      // Latest releases are shown first.
      "1.0.0": {
        title: "Launch",
        date: "2026-06-12",
        author: "legopitstop",
        categories: [
          {
            title: "General",
            list: ["Updated for Minecraft 26.21",],
          },
          {
            title: "New",
            list: ['Added new "Stone" block slab variant.'],
          },
        ],
      },
    }`);

    changelogTask({
      inputFile: INPUT_FILE,
      markdownFile: MARKDOWN_FILE,
      inGameFile: IN_GAME_FILE,
    })();

    expect(fs.readFileSync(MARKDOWN_FILE, "utf8")).toBe(`# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-12

Launch

### Changed

- Updated for Minecraft 26.21

### Added

- Added new "Stone" block slab variant.
`);

    const source = fs.readFileSync(IN_GAME_FILE, "utf8");
    expect(source).toContain("export const changelog =");
    expect(source).toContain('"changelog_1_0_0"');
    expect(source).toContain('Added new "Stone" block slab variant.');
    expect(source).toContain("guide.common.changelogs");
  });

  it("supports custom export and index names", () => {
    writeChangelog(`{
      "1.0.0": {
        title: "1.0.0",
        date: "2026-06-12",
        author: "Author",
        categories: [],
      },
    }`);

    changelogTask({
      inputFile: INPUT_FILE,
      markdownFile: MARKDOWN_FILE,
      inGameFile: IN_GAME_FILE,
      exportName: "releaseNotes",
      indexTitle: "Release Notes",
    })();

    const source = fs.readFileSync(IN_GAME_FILE, "utf8");
    expect(source).toContain("export const releaseNotes =");
    expect(source).toContain('title: "Release Notes"');
  });

  it("reports invalid changelog files", () => {
    writeChangelog(`{
      "1.0.0": {
        title: "Missing required fields",
      },
    }`);

    expect(() =>
      changelogTask({
        inputFile: INPUT_FILE,
        markdownFile: MARKDOWN_FILE,
        inGameFile: IN_GAME_FILE,
      })(),
    ).toThrow(INPUT_FILE);
  });

  it("rejects invalid export names", () => {
    writeChangelog("{}");

    expect(() =>
      changelogTask({
        inputFile: INPUT_FILE,
        markdownFile: MARKDOWN_FILE,
        inGameFile: IN_GAME_FILE,
        exportName: "not-valid",
      })(),
    ).toThrow("not-valid");
  });
});
