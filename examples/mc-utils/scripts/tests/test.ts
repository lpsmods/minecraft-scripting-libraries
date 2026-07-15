export function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg || "Assertion failed");
  }
}

export function assertProperty(propName: string, value: any, matchValue: any = true) {
  return assert(value === matchValue, `${propName} failed! "${value}" != "${matchValue}"`);
}
