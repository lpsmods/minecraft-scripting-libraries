import ts from "typescript";
import {
  generate,
  generateDirectory,
  type DocumentationProvider,
  type GenerateDirectoryOptions,
  type ProviderGeneratedOutput,
} from "@lpsmods/docs-generator";

import addonTemplate from "./templates/addon.mustache?raw";
import functionsTemplate from "./templates/functions.mustache?raw";
import propertiesTemplate from "./templates/properties.mustache?raw";

export interface AddonBridgePropertyDocs {
  name: string;
  type: string;
  description: string;
  writable: boolean;
  enumerable: boolean;
  configurable: boolean;
  signature?: string;
  usage: string;
}

export interface AddonBridgeDocs {
  addonId: string;
  name: string;
  version: string;
  description: string;
  sourcePath: string;
  properties: AddonBridgePropertyDocs[];
  functions: AddonBridgePropertyDocs[];
}

export interface GenerateAddonDocsOptions extends Omit<GenerateDirectoryOptions, "input"> {
  /** Source directory to scan. Defaults to `scripts`. */
  input?: string;
}

function propertyName(node: ts.PropertyName | undefined): string | undefined {
  if (!node) return undefined;
  if (ts.isIdentifier(node) || ts.isStringLiteralLike(node) || ts.isNumericLiteral(node)) return node.text;
  return undefined;
}

function objectProperty(object: ts.ObjectLiteralExpression | undefined, name: string): ts.Expression | undefined {
  if (!object) return undefined;
  for (const property of object.properties) {
    if (ts.isPropertyAssignment(property) && propertyName(property.name) === name) return property.initializer;
  }
  return undefined;
}

function literalText(expression: ts.Expression | undefined, fallback = ""): string {
  if (!expression) return fallback;
  if (ts.isStringLiteralLike(expression) || ts.isNumericLiteral(expression)) return expression.text;
  if (expression.kind === ts.SyntaxKind.TrueKeyword) return "true";
  if (expression.kind === ts.SyntaxKind.FalseKeyword) return "false";
  return fallback;
}

function literalBoolean(expression: ts.Expression | undefined, fallback: boolean): boolean {
  if (!expression) return fallback;
  if (expression.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (expression.kind === ts.SyntaxKind.FalseKeyword) return false;
  return fallback;
}

function expressionType(expression: ts.Expression | undefined): string {
  if (!expression) return "unknown";
  if (ts.isArrowFunction(expression) || ts.isFunctionExpression(expression)) return "function";
  if (ts.isStringLiteralLike(expression)) return "string";
  if (ts.isNumericLiteral(expression)) return "number";
  if (expression.kind === ts.SyntaxKind.TrueKeyword || expression.kind === ts.SyntaxKind.FalseKeyword) return "boolean";
  if (ts.isArrayLiteralExpression(expression)) return "array";
  if (ts.isObjectLiteralExpression(expression)) return "object";
  if (expression.kind === ts.SyntaxKind.NullKeyword) return "null";
  return "unknown";
}

function functionSignature(name: string, expression: ts.Expression | undefined, source: ts.SourceFile): string | undefined {
  if (!expression || (!ts.isArrowFunction(expression) && !ts.isFunctionExpression(expression))) return undefined;
  const parameters = expression.parameters.map((parameter) => parameter.getText(source)).join(", ");
  const returnType = expression.type?.getText(source);
  return `${name}(${parameters})${returnType ? `: ${returnType}` : ""}`;
}

function exampleValue(type: string): string {
  const normalized = type.replace(/\s*\|.*$/, "").trim();
  if (normalized === "string") return '"value"';
  if (normalized === "number" || normalized === "bigint") return "0";
  if (normalized === "boolean") return "true";
  if (normalized.endsWith("[]") || normalized.startsWith("Array<")) return "[]";
  if (normalized === "object" || normalized.startsWith("Record<")) return "{}";
  return "undefined";
}

function accessorType(
  getter: ts.Expression | undefined,
  setter: ts.Expression | undefined,
  source: ts.SourceFile,
): string {
  if (getter && (ts.isArrowFunction(getter) || ts.isFunctionExpression(getter)) && getter.type) return getter.type.getText(source);
  if (setter && (ts.isArrowFunction(setter) || ts.isFunctionExpression(setter))) {
    return setter.parameters[0]?.type?.getText(source) ?? "unknown";
  }
  return "unknown";
}

function propertyUsage(name: string, type: string, writable: boolean): string {
  const generic = type === "unknown" ? "" : `<${type}>`;
  const lines = [`const value = await api.get${generic}(${JSON.stringify(name)});`];
  if (writable) lines.push(`await api.set(${JSON.stringify(name)}, ${exampleValue(type)});`);
  return lines.join("\n");
}

function functionUsage(name: string, expression: ts.Expression | undefined, source: ts.SourceFile): string {
  const args =
    expression && (ts.isArrowFunction(expression) || ts.isFunctionExpression(expression))
      ? expression.parameters.map((parameter) => exampleValue(parameter.type?.getText(source) ?? "unknown"))
      : [];
  return `const result = await api.call(${[JSON.stringify(name), ...args].join(", ")});`;
}

function discoverBridges(sourcePath: string, sourceText: string): AddonBridgeDocs[] {
  const source = ts.createSourceFile(sourcePath, sourceText, ts.ScriptTarget.Latest, true);
  const bridges = new Map<string, AddonBridgeDocs>();

  const visit = (node: ts.Node): void => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer && ts.isNewExpression(node.initializer)) {
      const constructorName = node.initializer.expression.getText(source);
      if (constructorName === "Bridge" || constructorName.endsWith(".Bridge")) {
        const args = node.initializer.arguments ?? [];
        const addonId = literalText(args[0], node.name.text);
        const options = args[1] && ts.isObjectLiteralExpression(args[1]) ? args[1] : undefined;
        bridges.set(node.name.text, {
          addonId,
          name: literalText(objectProperty(options, "name"), addonId),
          version: literalText(objectProperty(options, "version"), "1.0.0"),
          description: literalText(objectProperty(options, "description")),
          sourcePath,
          properties: [],
          functions: [],
        });
      }
    }

    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
      const receiver = node.expression.expression;
      if (ts.isIdentifier(receiver) && node.expression.name.text === "defineProperty") {
        const bridge = bridges.get(receiver.text);
        const [nameExpression, descriptorExpression] = node.arguments;
        if (bridge && nameExpression && descriptorExpression && ts.isObjectLiteralExpression(descriptorExpression)) {
          const name = literalText(nameExpression);
          const value = objectProperty(descriptorExpression, "value");
          const getter = objectProperty(descriptorExpression, "get");
          const setter = objectProperty(descriptorExpression, "set");
          const hasGetter = getter !== undefined;
          const hasSetter = setter !== undefined;
          const type = hasGetter && !value ? accessorType(getter, setter, source) : expressionType(value);
          const writable = literalBoolean(
            objectProperty(descriptorExpression, "writable") ?? objectProperty(descriptorExpression, "writeable"),
            hasSetter,
          );
          const member: AddonBridgePropertyDocs = {
            name,
            type,
            description: literalText(objectProperty(descriptorExpression, "description")),
            writable,
            enumerable: literalBoolean(objectProperty(descriptorExpression, "enumerable"), true),
            configurable: literalBoolean(objectProperty(descriptorExpression, "configurable"), false),
            signature: functionSignature(name, value, source),
            usage: expressionType(value) === "function" ? functionUsage(name, value, source) : propertyUsage(name, type, writable),
          };
          if (member.type === "function") bridge.functions.push(member);
          else bridge.properties.push(member);
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(source);
  return [...bridges.values()];
}

function safeFileName(value: string): string {
  return value.replace(/[^a-z0-9._-]+/gi, "-").replace(/^-|-$/g, "") || "bridge";
}

function renderPage(bridge: AddonBridgeDocs, title: string, template: string): string {
  return generate({
    source: "",
    language: "typescript",
    title,
    description: bridge.description,
    template,
    view: {
      ...bridge,
      hasProperties: bridge.properties.length > 0,
      hasFunctions: bridge.functions.length > 0,
      frontmatterTitleYaml: JSON.stringify(title),
      packageDescriptionYaml: JSON.stringify(bridge.description),
    },
  });
}

function providerBridges(contributions: Readonly<Record<string, Readonly<Record<string, unknown>>>>): AddonBridgeDocs[] {
  const bridges = contributions[mcaddonBridgeDocs.name]?.bridges;
  return Array.isArray(bridges) ? (bridges as AddonBridgeDocs[]) : [];
}

/** Docs-generator provider for APIs declared with `Bridge` and `defineProperty`. */
export const mcaddonBridgeDocs: DocumentationProvider = {
  name: "mcaddon-bridge",
  analyze({ files }) {
    const bridges = files.flatMap((file) => discoverBridges(file.path.replaceAll("\\", "/"), file.source));
    return { data: { bridges } };
  },
  generate({ contributions }) {
    const bridges = providerBridges(contributions);
    const outputs: ProviderGeneratedOutput[] = [];
    for (const bridge of bridges) {
      const prefix = bridges.length === 1 ? "" : `${safeFileName(bridge.addonId)}/`;
      outputs.push(
        {
          path: `${prefix}index.md`,
          contents: renderPage(bridge, bridge.name, addonTemplate),
          sidebar: { text: bridges.length === 1 ? "Overview" : bridge.name, group: "API Reference" },
        },
        {
          path: `${prefix}properties.md`,
          contents: renderPage(bridge, `${bridge.name} Properties`, propertiesTemplate),
          sidebar: { text: `${bridges.length === 1 ? "" : `${bridge.name} `}Properties`, group: "API Reference" },
        },
        {
          path: `${prefix}functions.md`,
          contents: renderPage(bridge, `${bridge.name} Functions`, functionsTemplate),
          sidebar: { text: `${bridges.length === 1 ? "" : `${bridge.name} `}Functions`, group: "API Reference" },
        },
      );
    }
    return outputs;
  },
};

/** Generate standard source docs together with mcaddon-bridge provider pages. */
export function generateAddonDocs(options: GenerateAddonDocsOptions = {}) {
  return generateDirectory({
    ...options,
    input: options.input ?? "scripts",
    output: options.output ?? "docs",
    builtInPages: options.builtInPages ?? false,
    agentDocs: options.agentDocs ?? false,
    providers: [...(options.providers ?? []), mcaddonBridgeDocs],
  });
}

/** Create a callback suitable for `task("docs", addonDocsTask(...))`. */
export function addonDocsTask(options: GenerateAddonDocsOptions = {}) {
  return () => generateAddonDocs(options);
}
