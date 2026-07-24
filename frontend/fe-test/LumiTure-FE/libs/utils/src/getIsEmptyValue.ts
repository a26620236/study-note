export function getIsEmptyValue(value: unknown): boolean {
  return value === null || value === undefined || value === '' || Number(value) === 0;
}
