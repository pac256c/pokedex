import type { State } from "./state.js";

export async function commandCatch(state: State): Promise<void> {
  if (state.extraArgs.length !== 1) {
    console.log("Usage: 'catch <valid_pokemon>'");
    return;
  }
  const pokemonName: string = state.extraArgs[0];

  // get response. if successul, should give a Location object.
  // but if unsuccessful, this will be an http response object still.
  const resp = await state.api.fetchPokemon(pokemonName);
  if ("status" in resp) {
    console.log("Catch: no such pokemon! try again...");
    return;
  }

  console.log(`Throwing a Pokeball at ${pokemonName}...`);
  const catchRate = Math.exp(-0.005*resp.base_experience);
  const caught = Math.random() < catchRate;

  if (caught === false) {
    console.log(`${pokemonName} escaped!`);
  } else {
    console.log(`${pokemonName} was caught!`);
    state.pokedex[pokemonName] = resp;
  }
}
