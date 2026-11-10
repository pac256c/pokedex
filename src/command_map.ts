import { ShallowLocations } from "./pokeapi.js";
import type { State } from "./state.js"

export async function commandMapUtil(state: State, direction: "next" | "prev"): Promise<void> {
  const useURL = (direction === "next") ? state.nextLocationsURL : state.prevLocationsURL;

  let locs: ShallowLocations;
  if (useURL === null) {
    console.log(`at the edge of the list, no ${direction} page!`);
    return;
  } else {
    if (useURL) locs = await state.api.fetchLocations(useURL);
    else locs = await state.api.fetchLocations();
  } 

  for (const loc of locs.results) {
    console.log(`${loc.name}`);
  }
  state.prevLocationsURL = locs.previous;
  state.nextLocationsURL = locs.next;
}

export async function commandMap(state: State): Promise<void> {
  return commandMapUtil(state, "next");
}

export async function commandMapB(state: State): Promise<void> {
  return commandMapUtil(state, "prev");
}
