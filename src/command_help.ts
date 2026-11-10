import type { State } from "./state.js"

export async function commandHelp(state: State): Promise<void> {
  console.log("Welcome to the Pokedex!");
  console.log("Usage:\n");
  for (const cmd of Object.values(state.cmds)) {
    console.log(`${cmd.name}: ${cmd.description}`);
  }
}
