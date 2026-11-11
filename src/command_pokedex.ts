import type { State } from "./state.js";
import type { Pokemon } from "./pokeapi.js";

export async function commandPokedex(state: State): Promise<void> {
  if (Object.keys(state.pokedex).length === 0) {
    console.log("No pokemon in pokedex yet!");
    return;
  }

  console.log("Your Pokedex:");
  for (const pokemon of Object.keys(state.pokedex)) {
    console.log(`  -${pokemon}`);
  }
}
