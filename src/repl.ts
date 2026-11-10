import * as readline from "node:readline";
import { CLICommand, getCommands } from "./command.js";

export function cleanInput(input: string): string[] {
  const words = input.split(" ").filter(ent => ent.length > 0);
  return words.map(ent => ent.toLowerCase());
}

export function startREPL(): void {
  const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout,
    prompt: "Pokedex > ",
  });
  const cmds: Record<string, CLICommand> = getCommands(); 

  rl.prompt();
  rl.on("line", (input: string) => {
    const words = cleanInput(input);
    if (words.length > 0) {
      if (words[0] in cmds) cmds[words[0]].callback(cmds);
      else console.log("Unknown command");
    }
    rl.prompt();
  });
}
