import { createInterface, type Interface } from "readline";
import { commandHelp } from "./command_help.js";
import { commandExit } from "./command_exit.js";

export type CLICommand = {
  name: string;
  description: string;
  callback: (commands: State) => void;
};

export type State = {
  rl: Interface;
  cmds: Record<string, CLICommand>;
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
  };

  return { rl, cmds };
}
