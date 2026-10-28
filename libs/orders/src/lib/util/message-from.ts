/** Turns whatever a failed request threw into text that is safe to show the user. */
export function messageFrom(error: unknown, fallback: string): string {
  return error instanceof Error && error.message.trim().length > 0 ? error.message : fallback;
}