import type { State } from "./state.js"

export function commandHelp(state: State): void {
  console.log("Welcome to the Pokedex!");
  console.log("Usage:\n");
  for (const cmd of Object.values(state.cmds)) {
    console.log(`${cmd.name}: ${cmd.description}`);
  }
}
