export function argumentsFor(
  args: string[],
  allowed: string[],
  required: string[],
): Record<string, string> {
  const values: Record<string, string> = {};
  for (let i = 0; i < args.length; i += 2) {
    const name = args[i]?.replace(/^--/, ""), value = args[i + 1];
    if (
      !args[i]?.startsWith("--") || !allowed.includes(name) || !value ||
      value.startsWith("--") || name in values
    ) throw new Error("Invalid arguments");
    values[name] = value;
  }
  if (required.some((name) => !values[name])) {
    throw new Error("Missing arguments");
  }
  return values;
}
export async function unusedPath(path: string) {
  try {
    await Deno.stat(path);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) return;
    throw error;
  }
  throw new Error("Output already exists");
}
