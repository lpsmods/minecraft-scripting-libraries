import { system } from "@minecraft/server";

export interface AutosaveOptions {
  /**
   * The delay in ticks before the save function is called. Default is 20 ticks (1 second).
   */
  delay?: number;
}

/**
 * Creates an autosave function that will call the provided save function after a specified delay.
 * @param {(data: T) => void | Promise<void>} saveFn
 * @param {AutosaveOptions} options
 * @returns {(data: T) => void}
 */
export function createAutosave<T>(
  saveFn: (data: T) => void | Promise<void>,
  options: AutosaveOptions = {},
): (data: T) => void {
  const delay = options.delay ?? 20;
  let runId: number | null = null;
  return (data: T) => {
    if (runId) system.clearRun(runId);
    runId = system.runTimeout(() => {
      saveFn(data);
    }, delay);
  };
}

/**
 *
 * @param {(key: K, data: T) => void | Promise<void>} saveFn
 * @param {AutosaveOptions} options
 * @returns {(key: K, data: T) => void}
 */
export function createKeyedAutosave<K, T>(
  saveFn: (key: K, data: T) => void | Promise<void>,
  options: AutosaveOptions = {},
): (key: K, data: T) => void {
  const delay = options.delay ?? 20;
  const timers = new Map<K, number>();
  return (key: K, data: T) => {
    const existing = timers.get(key);
    if (existing) system.clearRun(existing);
    const runId = system.runTimeout(() => {
      saveFn(key, data);
      timers.delete(key);
    }, delay);

    timers.set(key, runId);
  };
}
