import fs from "node:fs";
import path from "node:path";

/**
 * Runs the emit json helper.
 */
export function emitJson(filepath: string, data: unknown): void {
  const dir = path.dirname(filepath);

  fs.mkdirSync(dir, { recursive: true });

  const sorted = sortKeys(data);
  const json = JSON.stringify(sorted, null, 2);
  const properties = sorted?.["minecraft:entity"]?.description?.properties;
  if (!properties || typeof properties !== "object") {
    fs.writeFileSync(filepath, json, "utf8");
    return;
  }

  // JavaScript numbers lose their source notation. Use the property type to
  // restore integral floats, with placeholders that cannot collide with data.
  let prefix = "__mc_build_float_";
  while (json.includes(prefix)) prefix += "_";
  const literals = new Map<string, string>();
  const defaults = new Set<object>();
  const ranges = new Set<object>();
  for (const property of Object.values(properties) as any[]) {
    if (property?.type === "float") {
      defaults.add(property);
      if (Array.isArray(property.range)) ranges.add(property.range);
    }
  }
  const output = JSON.stringify(sorted, function (key, value) {
    if (((defaults.has(this) && key === "default") || ranges.has(this)) && Number.isInteger(value)) {
      const marker = `${prefix}${literals.size}`;
      const number = Object.is(value, -0) ? "-0" : String(value);
      literals.set(JSON.stringify(marker), number.includes(".") ? number : number.replace(/^(.*?)([eE].*)?$/, "$1.0$2"));
      return marker;
    }
    return value;
  }, 2);
  fs.writeFileSync(filepath, output.replace(/"(?:\\.|[^"\\])*"/g, (token) => literals.get(token) ?? token), "utf8");
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
