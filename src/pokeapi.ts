import { Cache } from "./pokecache.js";

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  private cache: Cache;

  constructor(interval: number) {
    this.cache = new Cache(interval);
  }

  async fetchCached<T>(url: string): Promise<T> {
    const cacheEntry = this.cache.get<T>(url);
    // console.log(`cache ${cacheEntry === undefined ? 'MISS' : 'HIT'} for URL ${url}`);
    if (cacheEntry !== undefined) return cacheEntry;
    
    const resp: Response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const newEntry: T = await resp.json();
    // console.log(`fetched item at url = ${url}, caching...`);
    this.cache.add(url, newEntry);
    return newEntry;
  }

  closeCache() {
    this.cache.stopReapLoop();
  }

  async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
    const url = pageURL ?? `${PokeAPI.baseURL}/location-area`;
    return this.fetchCached<ShallowLocations>(url);
  }

  async fetchLocation(locationName: string): Promise<Location> {
    const url = `${PokeAPI.baseURL}/location-area/${locationName}`;
    return this.fetchCached<Location>(url);
  }
}

export type ShallowLocations = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ShallowLocation[];
};

export type Location = {
  id: number;
  name: string;
  game_index: number;
  encounter_method_rates: EncounterMethodRate[];
  location: ShallowLocation;
  names: Name[];
  pokemon_encounters: PokemonEncounter[];
};

export type EncounterMethodRate = {
  encounter_method: EncounterMethod;
  version_details: VersionDetail[];
};

export type EncounterMethod = {
  name: string;
  url: string;
};

export type VersionDetail = {
  rate: number;
  version: Version;
};

export type Version = {
  name: string;
  url: string;
};

export type ShallowLocation = {
  name: string;
  url: string;
};

export type Name = {
  name: string;
  language: Language;
};

export type Language = {
  name: string;
  url: string;
};

export type PokemonEncounter = {
  pokemon: Pokemon;
  version_details: VersionDetail2[];
};

export type Pokemon = {
  name: string;
  url: string;
};

export type VersionDetail2 = {
  version: Version2;
  max_chance: number;
  encounter_details: EncounterDetail[];
};

export type Version2 = {
  name: string;
  url: string;
};

export type EncounterDetail = {
  min_level: number;
  max_level: number;
  chance: number;
  method: Method;
  condition_values: any[];
  pokemon_details: any;
};

export type Method = {
  name: string;
  url: string;
};

