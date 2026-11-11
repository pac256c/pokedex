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

  async fetchPokemon(pokemonName: string): Promise<Pokemon> {
    const url = `${PokeAPI.baseURL}/pokemon/${pokemonName}`;
    return this.fetchCached<Pokemon>(url);
  }
}

export type RefPointer = {
  name: string;
  url: string;
};

export type ShallowLocations = {
  count: number;
  next: string | null;
  previous: string | null;
  results: RefPointer[];
};

export type Location = {
  id: number;
  name: string;
  game_index: number;
  encounter_method_rates: EncounterMethodRate[];
  location: RefPointer;
  names: Name[];
  pokemon_encounters: PokemonEncounter[];
};

export type EncounterMethodRate = {
  encounter_method: RefPointer;
  version_details: VersionDetail[];
};

export type VersionDetail = {
  rate: number;
  version: RefPointer;
};

export type Name = {
  name: string;
  language: RefPointer;
};

export type PokemonEncounter = {
  pokemon: RefPointer;
  version_details: VersionDetail2[];
};

export type VersionDetail2 = {
  version: RefPointer;
  max_chance: number;
  encounter_details: EncounterDetail[];
};

export type EncounterDetail = {
  min_level: number;
  max_level: number;
  chance: number;
  method: RefPointer;
  condition_values: any[];
  pokemon_details: any;
};

export type Pokemon = {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: Ability[];
  past_abilities: PastAbility[];
  forms: RefPointer[];
  game_indices: Index[];
  held_items: HeldItem[];
  location_area_encounters: string;
  moves: Mfe[];
  species: RefPointer;
  sprites: Sprites;
  cries: Cries;
  stats: Stat[];
  past_stats: PastStat[];
  types: Type[];
  past_types: any[];
};

export type Ability = {
  is_hidden: boolean;
  slot: number;
  ability: RefPointer;
};

export type PastAbility = {
  generation: RefPointer;
  abilities: Ability3[];
};

export type Ability3 = {
  is_hidden: boolean;
  slot: number;
  ability: any;
};

export type Index = {
  game_index: number;
  version: RefPointer;
};

export type HeldItem = {
  item: RefPointer;
  version_details: ItemVersionDetail[];
};

export type ItemVersionDetail = {
  rarity: number;
  version: RefPointer;
};

export type Mfe = {
  move: RefPointer;
  version_group_details: VersionGroupDetail[];
};

export type VersionGroupDetail = {
  level_learned_at: number;
  version_group: RefPointer;
  move_learn_method: RefPointer;
  order?: number;
};

export type Sprites = {
  other: Other;
  versions: Versions2;
  back_shiny: string;
  back_female: any;
  front_shiny: string;
  back_default: string;
  front_female: any;
  front_default: string;
  back_shiny_female: any;
  front_shiny_female: any;
};

export type Other = {
  home: Home;
  showdown: Showdown;
  dream_world: DreamWorld;
  "official-artwork": OfficialArtwork;
};

export type Home = {
  front_shiny: string;
  front_female: any;
  front_default: string;
  front_shiny_female: any;
};

export type Showdown = {
  back_shiny: string;
  back_female: any;
  front_shiny: string;
  back_default: string;
  front_female: any;
  front_default: string;
  back_shiny_female: any;
  front_shiny_female: any;
};

export type DreamWorld = {
  front_female: any;
  front_default: string;
};

export type OfficialArtwork = {
  versions: Versions;
  front_shiny: string;
  front_default: string;
};

export type Versions = {
  "generation-i": GenerationI;
  "generation-ii": GenerationIi;
};

export type GenerationI = {
  "red-and-blue": RedAndBlue;
  "red-and-green": RedAndGreen;
};

export type RedAndBlue = {
  front_default: string;
};

export type RedAndGreen = {
  front_default: string;
};

export type GenerationIi = {
  "gold-and-silver": GoldAndSilver;
};

export type GoldAndSilver = {
  front_default: any;
};

export type Versions2 = {
  "generation-i": GenerationI2;
  "generation-v": GenerationV;
  "generation-ii": GenerationIi2;
  "generation-iv": GenerationIv;
  "generation-ix": GenerationIx;
  "generation-vi": GenerationVi;
  "generation-iii": GenerationIii;
  "generation-vii": GenerationVii;
  "generation-viii": GenerationViii;
};

export type GenerationI2 = {
  yellow: Yellow;
  "red-blue": RedBlue;
  "red-green-japan": RedGreenJapan;
};

export type Yellow = {
  back_gbc: string;
  back_gray: string;
  front_gbc: string;
  front_gray: string;
  back_default: string;
  front_default: string;
  back_transparent: string;
  front_transparent: string;
  back_transparent_gray: string;
  front_transparent_gray: string;
};

export type RedBlue = {
  back_gray: string;
  front_gray: string;
  back_default: string;
  front_default: string;
  back_transparent: string;
  front_transparent: string;
  back_transparent_gray: string;
  front_transparent_gray: string;
};

export type RedGreenJapan = {
  back_gray: string;
  front_gray: string;
  back_default: string;
  front_default: string;
};

export type GenerationV = {
  icons: Icons;
  "black-white": BlackWhite;
};

export type Icons = {
  animated: Animated;
  front_default: string;
};

export type Animated = {
  front_default: string;
};

export type BlackWhite = {
  animated: Animated2;
  back_shiny: string;
  back_female: any;
  front_shiny: string;
  back_default: string;
  front_female: any;
  front_default: string;
  back_shiny_female: any;
  front_shiny_female: any;
};

export type Animated2 = {
  back_shiny: string;
  back_female: any;
  front_shiny: string;
  back_default: string;
  front_female: any;
  front_default: string;
  back_shiny_female: any;
  front_shiny_female: any;
};

export type GenerationIi2 = {
  gold: Gold;
  silver: Silver;
  crystal: Crystal;
};

export type Gold = {
  back_shiny: string;
  front_shiny: string;
  back_default: string;
  front_default: string;
  back_transparent: string;
  front_transparent: string;
  back_shiny_transparent: string;
  front_shiny_transparent: string;
};

export type Silver = {
  back_shiny: string;
  front_shiny: string;
  back_default: string;
  front_default: string;
  back_transparent: string;
  front_transparent: string;
  back_shiny_transparent: string;
  front_shiny_transparent: string;
};

export type Crystal = {
  animated: Animated3;
  back_shiny: string;
  front_shiny: string;
  back_default: string;
  front_default: string;
  back_transparent: string;
  front_transparent: string;
  back_shiny_transparent: string;
  front_shiny_transparent: string;
};

export type Animated3 = {
  front_shiny: string;
  front_default: string;
};

export type GenerationIv = {
  icons: Icons2;
  platinum: Platinum;
  "diamond-pearl": DiamondPearl;
  "heartgold-soulsilver": HeartgoldSoulsilver;
};

export type Icons2 = {
  front_default: string;
};

export type Platinum = {
  animated: Animated4;
  back_shiny: string;
  back_female: any;
  front_shiny: string;
  back_default: string;
  front_female: any;
  front_default: string;
  back_shiny_female: any;
  front_shiny_female: any;
};

export type Animated4 = {
  front_shiny: string;
  front_female: any;
  front_default: string;
  front_shiny_female: any;
};

export type DiamondPearl = {
  animated: Animated5;
  back_shiny: string;
  back_female: any;
  front_shiny: string;
  back_default: string;
  front_female: any;
  front_default: string;
  back_shiny_female: any;
  front_shiny_female: any;
};

export type Animated5 = {
  front_shiny: string;
  front_female: any;
  front_default: string;
  front_shiny_female: any;
};

export type HeartgoldSoulsilver = {
  animated: Animated6;
  back_shiny: string;
  back_female: any;
  front_shiny: string;
  back_default: string;
  front_female: any;
  front_default: string;
  back_shiny_female: any;
  front_shiny_female: any;
};

export type Animated6 = {
  front_shiny: string;
  front_female: any;
  front_default: string;
  front_shiny_female: any;
};

export type GenerationIx = {
  champions: Champions;
  "legends-za": LegendsZa;
  "scarlet-violet": ScarletViolet;
};

export type Champions = {
  icons: Icons3;
  back_shiny: any;
  back_female: any;
  front_shiny: any;
  back_default: any;
  front_female: any;
  front_default: any;
  back_shiny_female: any;
  front_shiny_female: any;
};

export type Icons3 = {
  front_shiny: any;
  front_default: any;
};

export type LegendsZa = {
  icons: Icons4;
  back_shiny: any;
  back_female: any;
  front_shiny: any;
  back_default: any;
  front_female: any;
  front_default: any;
  back_shiny_female: any;
  front_shiny_female: any;
};

export type Icons4 = {
  front_shiny: any;
  front_female: any;
  front_default: any;
  front_shiny_female: any;
};

export type ScarletViolet = {
  icons: Icons5;
  back_shiny: string;
  back_female: any;
  front_shiny: string;
  back_default: string;
  front_female: any;
  front_default: string;
  back_shiny_female: any;
  front_shiny_female: any;
};

export type Icons5 = {
  front_female: any;
  front_default: string;
};

export type GenerationVi = {
  "x-y": XY;
  icons: Icons6;
  "omega-ruby-alpha-sapphire": OmegaRubyAlphaSapphire;
};

export type XY = {
  back_shiny: string;
  back_female: any;
  front_shiny: string;
  back_default: string;
  front_female: any;
  front_default: string;
  back_shiny_female: any;
  front_shiny_female: any;
};

export type Icons6 = {
  front_female: any;
  front_default: string;
};

export type OmegaRubyAlphaSapphire = {
  back_shiny: string;
  back_female: any;
  front_shiny: string;
  back_default: string;
  front_female: any;
  front_default: string;
  back_shiny_female: any;
  front_shiny_female: any;
};

export type GenerationIii = {
  icons: Icons7;
  emerald: Emerald;
  "ruby-sapphire": RubySapphire;
  "firered-leafgreen": FireredLeafgreen;
};

export type Icons7 = {
  front_default: string;
};

export type Emerald = {
  animated: Animated7;
  back_shiny: string;
  front_shiny: string;
  back_default: string;
  front_default: string;
};

export type Animated7 = {
  back_shiny: string;
  front_shiny: string;
  back_default: string;
  front_default: string;
};

export type RubySapphire = {
  back_shiny: string;
  front_shiny: string;
  back_default: string;
  front_default: string;
};

export type FireredLeafgreen = {
  back_shiny: string;
  front_shiny: string;
  back_default: string;
  front_default: string;
};

export type GenerationVii = {
  icons: Icons8;
  "ultra-sun-ultra-moon": UltraSunUltraMoon;
  "lets-go-pikachu-lets-go-eevee": LetsGoPikachuLetsGoEevee;
};

export type Icons8 = {
  front_female: any;
  front_default: string;
};

export type UltraSunUltraMoon = {
  back_shiny: string;
  back_female: any;
  front_shiny: string;
  back_default: string;
  front_female: any;
  front_default: string;
  back_shiny_female: any;
  front_shiny_female: any;
};

export type LetsGoPikachuLetsGoEevee = {
  icons: Icons9;
  back_shiny: string;
  back_female: any;
  front_shiny: string;
  back_default: string;
  front_female: any;
  front_default: string;
  back_shiny_female: any;
  front_shiny_female: any;
};

export type Icons9 = {
  front_default: string;
};

export type GenerationViii = {
  "sword-shield": SwordShield;
  "legends-arceus": LegendsArceus;
  "brilliant-diamond-shining-pearl": BrilliantDiamondShiningPearl;
};

export type SwordShield = {
  icons: Icons10;
  back_shiny: string;
  back_female: any;
  front_shiny: string;
  back_default: string;
  front_female: any;
  front_default: string;
  back_shiny_female: any;
  front_shiny_female: any;
};

export type Icons10 = {
  front_female: any;
  front_default: string;
};

export type LegendsArceus = {
  icons: Icons11;
  back_shiny: string;
  back_female: any;
  front_shiny: string;
  back_default: string;
  front_female: any;
  front_default: string;
  back_shiny_female: any;
  front_shiny_female: any;
};

export type Icons11 = {
  front_shiny: string;
  front_female: any;
  front_default: string;
  front_shiny_female: any;
};

export type BrilliantDiamondShiningPearl = {
  icons: Icons12;
  back_shiny: string;
  back_female: any;
  front_shiny: string;
  back_default: string;
  front_female: any;
  front_default: string;
  back_shiny_female: any;
  front_shiny_female: any;
};

export type Icons12 = {
  front_default: string;
};

export type Cries = {
  latest: string;
  legacy: string;
};

export type Stat = {
  base_stat: number;
  effort: number;
  stat: RefPointer;
};

export type PastStat = {
  generation: RefPointer;
  stats: Stat3[];
};

export type Stat3 = {
  base_stat: number;
  effort: number;
  stat: RefPointer;
};

export type Type = {
  slot: number;
  type: RefPointer;
};
