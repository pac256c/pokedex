import { createInterface, type Interface } from "readline";
import { commandHelp } from "./command_help.js";
import { commandExit } from "./command_exit.js";
import { commandMap, commandMapB } from "./command_map.js";
import { commandExplore } from "./command_explore.js";
import { commandCatch } from "./command_catch.js";
import { PokeAPI, Pokemon } from "./pokeapi.js";
import { commandInspect } from "./command_inspect.js";
import { commandPokedex } from "./command_pokedex.js";

export type CLICommand = {
  name: string;
  description: string;
  callback: (commands: State) => Promise<void>;
};

export type State = {
  rl: Interface;
  cmds: Record<string, CLICommand>;
  api: PokeAPI;
  nextLocationsURL: string | null;
  prevLocationsURL: string | null;
  extraArgs: string[];
  pokedex: Record<string, Pokemon>;
}

export function initState(): State {
  // init readline
  const rl: Interface = createInterface({
    input: process.stdin, 
    output: process.stdout,
    prompt: "Pokedex > ",
  });

  // init commands registry
  const cmds: Record<string, CLICommand> = {
    exit: {
      name: "exit",
      description: "Exit the Pokedex",
      callback: commandExit,
    },
    help: {
      name: "help",
      description: "Displays a help message",
      callback: commandHelp,
    },
    map: {
      name: "map",
      description: "Displays names of next 20 location areas in the Pokemon world",
      callback: commandMap,
    },
    mapb: {
      name: "mapb",
      description: "Displays names of prev 20 location areas in the Pokemon world",
      callback: commandMapB,
    },
    explore: {
      name: "explore",
      description: "Explore an area to see what pokemon are there",
      callback: commandExplore,
    },
    catch: {
      name: "catch",
      description: "Throw a pokeball at a pokemon by name and try to catch",
      callback: commandCatch,
    },
    inspect: {
      name: "inspect",
      description: "Inspect a caught pokemon by name - stats/types/etc.",
      callback: commandInspect,
    },
    pokedex: {
      name: "pokedex",
      description: "List caught pokemon in your pokedex",
      callback: commandPokedex,
    },
  };

  // init pokeapi, first and prev loc URLs
  const api = new PokeAPI(300_000);
  const nextLocationsURL = "";
  const prevLocationsURL = null;
  const extraArgs: string[] = [];
  const pokedex = {};

  // init state
  const state: State = {
    rl,
    cmds,
    api,
    nextLocationsURL,
    prevLocationsURL,
    extraArgs,
    pokedex,
  };

  return state;
}
