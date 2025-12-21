import { config } from "@/config";
import { v4, v5 } from "uuid";

/**
 * Generates a unique identifier based on the provided arguments.
 * If no arguments are provided, a v4 UUID is returned.
 * Otherwise, a v5 UUID is returned based on the provided name and the namespace provided by the project (default is uuid.v5.URL).
 * @returns A unique identifier based on the provided arguments.
 */
export function createId(...args: string[]): string {
  if (args.length === 0) {
    return v4();
  }
  const name = args.join(":");
  return v5(name, config.UUID_NAMESPACE);
}
