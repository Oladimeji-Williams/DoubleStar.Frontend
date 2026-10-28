/**
 * The API sends UTC timestamps. If the serializer drops the trailing "Z", `new Date(value)` would
 * silently read the value as local time, so we add it back.
 */
export function parseUtc(value: string): Date {
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/i.test(value);
  return new Date(hasZone ? value : `${value}Z`);
}

export function parseUtcOrNull(value: string | null): Date | null {
  return value === null ? null : parseUtc(value);
}