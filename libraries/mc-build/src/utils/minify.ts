import JSON5 from "json5";

/** Minifies JSON5 without losing the decimal notation of float literals. */
export function minifyJson(source: string): string {
  // Validate the complete document before transforming individual tokens.
  JSON5.parse(source);
  const tokens = source.match(
    /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\/\/[^\r\n\u2028\u2029]*|\/\*[\s\S]*?\*\/|\s+|[{}\[\],:]|[^\s{}\[\],:"'/]+/gu,
  ) ?? [];
  const significant = tokens.filter((token) => !/^\s|^\/\//u.test(token) && !token.startsWith("/*"));

  return significant.map((token, index) => {
    const next = significant[index + 1];
    if (token === "," && (next === "}" || next === "]")) {
      return "";
    }
    if (/^[{}\[\],:]$/u.test(token)) {
      return token;
    }
    if (next === ":") {
      // Parsing a one-key object also decodes JSON5 identifier escapes.
      return JSON.stringify(Object.keys(JSON5.parse(`{${token}:null}`))[0]);
    }
    if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/u.test(token)) {
      return token;
    }
    const value = JSON5.parse(token);
    const normalized = JSON.stringify(value);
    if (typeof value === "number" && Number.isFinite(value) && token.includes(".") && !/[.eE]/u.test(normalized)) {
      return `${Object.is(value, -0) ? "-0" : normalized}.0`;
    }
    return normalized;
  }).join("");
}
