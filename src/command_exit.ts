import type { CLICommand } from "./command.js";

export function commandExit(commands: Record<string, CLICommand>): void {
  console.log("Closing the Pokedex... Goodbye!");
  process.exit(0);
}
