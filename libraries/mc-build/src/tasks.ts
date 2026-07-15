import fs from "node:fs";
import path from "node:path";
import JSON5 from "json5";
import { assert } from "superstruct";
import { ChangelogSchema, type Changelog, type ChangelogRelease } from "./schema";

function findJsonFiles(directory: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filepath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...findJsonFiles(filepath));
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".json") {
      files.push(filepath);
    }
  }
  return files;
}

function defaultPackDirectories(): string[] {
  const projectName = process.env["PROJECT_NAME"];
  if (!projectName) {
    throw new Error("Missing PROJECT_NAME environment variable.");
  }
  return [
    path.resolve(process.cwd(), "behavior_packs", projectName),
    path.resolve(process.cwd(), "resource_packs", projectName),
  ];
}

/**
 * Creates a task that recursively minifies add-on JSON files.
 *
 * Files are parsed as JSON5 so comments, trailing commas, and other JSON5
 * syntax are accepted. Output is written as strict, compact JSON.
 */
export function minifyTask(directories?: string | string[]): () => void {
  return () => {
    const packDirectories = directories
      ? (Array.isArray(directories) ? directories : [directories]).map((directory) => path.resolve(directory))
      : defaultPackDirectories();

    for (const directory of packDirectories) {
      if (!fs.existsSync(directory)) {
        continue;
      }
      for (const filepath of findJsonFiles(directory)) {
        try {
          const data = JSON5.parse(fs.readFileSync(filepath, "utf8"));
          fs.writeFileSync(filepath, JSON.stringify(data), "utf8");
        } catch (error) {
          throw new Error(`Unable to minify JSON file '${filepath}'.`, { cause: error });
        }
      }
    }
  };
}

/** Options for generating changelog artifacts. */
export type ChangelogTaskOptions = {
  /** JSON5 changelog source. Defaults to changelog.json. */
  inputFile?: string;
  /** Markdown output. Defaults to CHANGELOG.md. */
  markdownFile?: string;
  /** In-game TypeScript page output. Defaults to scripts/changelog.ts. */
  inGameFile?: string;
  /** Export name used by the generated TypeScript file. Defaults to changelog. */
  exportName?: string;
  /** Title used by the in-game changelog index. Defaults to guide.common.changelogs. */
  indexTitle?: string;
  /** Body used by the in-game changelog index. Defaults to guide.common.changelogs.desc. */
  indexBody?: string;
};

function pageId(version: string): string {
  return `changelog_${version.replaceAll(/[^A-Za-z0-9]+/g, "_").replaceAll(/^_+|_+$/g, "")}`;
}

function releaseHeading(version: string, release: ChangelogRelease): string {
  return "v"+(release.title === version ? release.title : `${version} - ${release.title}`);
}

function releaseBody(release: ChangelogRelease): string {
  const lines = [`${release.date} - ${release.author}`];
  for (const category of release.categories) {
    lines.push("", `§l${category.title}§r`, ...category.list.map((item) => `- ${item}`));
  }
  return lines.join("\n");
}

const KEEP_A_CHANGELOG_CATEGORIES: Record<string, string> = {
  new: "Added",
  added: "Added",
  general: "Changed",
  change: "Changed",
  changes: "Changed",
  changed: "Changed",
  improvement: "Changed",
  improvements: "Changed",
  deprecated: "Deprecated",
  removed: "Removed",
  fix: "Fixed",
  fixes: "Fixed",
  fixed: "Fixed",
  security: "Security",
};

function keepAChangelogCategory(title: string): string {
  return KEEP_A_CHANGELOG_CATEGORIES[title.trim().toLowerCase()] ?? title;
}

function markdown(changelog: Changelog): string {
  const lines = [
    "# Changelog",
    "",
    "All notable changes to this project will be documented in this file.",
    "",
    "The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).",
  ];
  for (const [version, release] of Object.entries(changelog)) {
    lines.push("", `## [${version}] - ${release.date}`);
    if (release.title !== version) {
      lines.push("", release.title);
    }
    for (const category of release.categories) {
      lines.push("", `### ${keepAChangelogCategory(category.title)}`, "", ...category.list.map((item) => `- ${item}`));
    }
  }
  return `${lines.join("\n")}\n`;
}

function typescriptString(value: string): string {
  const quote = value.includes('"') && !value.includes("'") ? "'" : '"';
  const escaped = value
    .replaceAll("\\", "\\\\")
    .replaceAll("\r", "\\r")
    .replaceAll("\n", "\\n")
    .replaceAll("\t", "\\t")
    .replaceAll(quote, `\\${quote}`);
  return `${quote}${escaped}${quote}`;
}

function typescriptKey(key: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : typescriptString(key);
}

function typescriptValue(value: unknown, depth = 0): string {
  if (typeof value === "string") {
    return typescriptString(value);
  }
  if (typeof value === "number" || typeof value === "boolean" || value === null) {
    return String(value);
  }

  const indent = "  ".repeat(depth);
  const childIndent = "  ".repeat(depth + 1);
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }
    return `[\n${value.map((entry) => `${childIndent}${typescriptValue(entry, depth + 1)},`).join("\n")}\n${indent}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return "{}";
    }
    return `{\n${entries
      .map(([key, entry]) => `${childIndent}${typescriptKey(key)}: ${typescriptValue(entry, depth + 1)},`)
      .join("\n")}\n${indent}}`;
  }
  throw new Error(`Unable to serialize changelog value of type '${typeof value}'.`);
}

function inGameSource(changelog: Changelog, exportName: string, indexTitle: string, indexBody: string, sourceName: string): string {
  const pages: Record<string, unknown> = {
    changelog: {
    icon: "textures/ui/creative_icon.png",
    title: indexTitle ?? "guide.common.changelogs",
    body: indexBody ?? "guide.common.changelogs.desc",
      buttons: Object.entries(changelog).map(([version, release]) => (pageId(version))),
    },
  };

  for (const [version, release] of Object.entries(changelog)) {
    pages[pageId(version)] = {
      title: releaseHeading(version, release),
      body: releaseBody(release),
    };
  }

  return `// Generated from ${sourceName}. Do not edit.\nexport const ${exportName} = ${typescriptValue(pages)};\n`;
}

/**
 * Creates a task that generates Markdown and in-game changelog pages.
 *
 * The source file is parsed as JSON5 so comments and trailing commas are
 * supported.
 */
export function changelogTask(options: ChangelogTaskOptions = {}): () => void {
  return () => {
    const inputFile = path.resolve(options.inputFile ?? "changelog.json");
    const markdownFile = path.resolve(options.markdownFile ?? "CHANGELOG.md");
    const inGameFile = path.resolve(options.inGameFile ?? "scripts/guide/changelog.ts");
    const exportName = options.exportName ?? "changelog";
    const indexTitle = options.indexTitle ?? "guide.common.changelogs";
    const indexBody = options.indexBody ?? "guide.common.changelogs.desc";
    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(exportName)) {
      throw new Error(`Invalid changelog export name '${exportName}'.`);
    }

    let changelog: Changelog;
    try {
      changelog = JSON5.parse(fs.readFileSync(inputFile, "utf8"));
      assert(changelog, ChangelogSchema);
    } catch (error) {
      throw new Error(`Unable to generate changelog from '${inputFile}'.`, { cause: error });
    }

    fs.mkdirSync(path.dirname(markdownFile), { recursive: true });
    fs.mkdirSync(path.dirname(inGameFile), { recursive: true });
    fs.writeFileSync(markdownFile, markdown(changelog), "utf8");
    fs.writeFileSync(inGameFile, inGameSource(changelog, exportName, indexTitle, indexBody, path.basename(inputFile)), "utf8");
  };
}

export function getManifestVersion(projectName: string): string {
  const manifestPath = path.resolve(__dirname, `./behavior_packs/${projectName}/manifest.json`);
  const manifest = JSON5.parse(fs.readFileSync(manifestPath, "utf8"));
  const version = manifest.header?.version;
  if (!version) {
    throw new Error(`Missing header.version in ${manifestPath}`);
  }
  return version;
}

export function getPackageVersion(): string {
  const packagePath = path.resolve(__dirname, `package.json`);
  const manifest = JSON5.parse(fs.readFileSync(packagePath, "utf8"));
  return manifest.version ?? "1.0.0";
}
