/**
 * Safely parse a JSON string, returning a fallback value on failure.
 * If the input is already an object/array, returns it directly.
 */
export function safeJsonParse<T>(json: string | T | null | undefined, fallback: T): T {
  if (json === null || json === undefined) {
    return fallback;
  }
  if (typeof json !== 'string') {
    return json as T;
  }
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
