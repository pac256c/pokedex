import type { State } from "./state.js";
import type { PokemonEncounter } from "./pokeapi.js";

export async function commandExplore(state: State): Promise<void> {
  if (state.extraArgs.length !== 1) {
    console.log("Usage: 'explore <valid_location>'");
    return;
  }
  const location: string = state.extraArgs[0];
  console.log(`Exploring ${location}...`);

  // get response. if successul, should give a Location object.
  // but if unsuccessful, this will be an http response object still.
  const resp = await state.api.fetchLocation(location);
  if ("status" in resp) {
    console.log("Explore: location not found! try again...");
    return;
  }

  // parse pokemon encountered
  const encs: PokemonEncounter[] = resp.pokemon_encounters;
  if (encs.length === 0) {
    console.log("Found no Pokemon!");
    return;
  }
  console.log("Found Pokemon:");
  for (const pokemon of encs) {
    console.log(`- ${pokemon.pokemon.name}`);
  }
 }
