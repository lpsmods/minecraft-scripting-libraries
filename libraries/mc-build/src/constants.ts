export const MIN_ENGINE_VERSION: [number, number, number] = [1, 26, 20];

/**
 * Gets the namespace used for generated project resources.
 *
 * PROJECT_NAMESPACE takes precedence and PROJECT_NAME is used as a fallback.
 */
export function getProjectNamespace(): string | undefined {
  return process.env["PROJECT_NAMESPACE"] || process.env["PROJECT_NAME"];
}
