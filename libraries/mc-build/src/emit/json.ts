import fs from "node:fs";
import path from "node:path";

/**
 * Runs the emit json helper.
 */
export function emitJson(filepath: string, data: unknown): void {
  const dir = path.dirname(filepath);

  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(filepath, JSON.stringify(sortKeys(data), null, 2), "utf8");
}

function sortKeys(value: any): any {
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((obj, key) => {
        obj[key] = sortKeys(value[key]);
        return obj;
      }, {} as any);
  }

  return value;
}
