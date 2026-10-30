/** OAuth returns to the public home page; only navigate internally after validation. */
export function safeAuthDestination(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u001f]/.test(value)) return null;
  return value;
}