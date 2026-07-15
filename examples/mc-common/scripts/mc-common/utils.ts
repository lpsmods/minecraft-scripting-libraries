export function isNumber(n: string | number): boolean {
  return !isNaN(parseFloat(String(n))) && isFinite(Number(n));
}
