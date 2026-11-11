import type { State } from "./state.js";
import type { Pokemon } from "./pokeapi.js";

export async function commandInspect(state: State): Promise<void> {
  if (state.extraArgs.length !== 1) {
    console.log("Usage: 'inspect <caught_pokemon>'");
    return;
  }
  const pokemonName: string = state.extraArgs[0];

  if (!(pokemonName in state.pokedex)) {
    console.log("Inspect: pokemon not in pokedex! try again...");
    return;
  }

  const pokemon: Pokemon = state.pokedex[pokemonName];
  console.log(`Name: ${pokemon.name}`);
  console.log(`Height: ${pokemon.height}`);
  console.log(`Weight: ${pokemon.weight}`);
  console.log("Stats:");
  for (const stat of pokemon.stats) {
    console.log(`  -${stat.stat.name}: ${stat.base_stat}`);
  }
  console.log("Types:");
  for (const poketype of pokemon.types) {
    console.log(`  -${poketype.type.name}`); 
  }
}
