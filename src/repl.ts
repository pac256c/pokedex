import * as readline from "node:readline";

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

  rl.prompt();
  rl.on("line", (input: string) => {
    const words = cleanInput(input);
    if (words.length > 0) {
      console.log(`Your command was: ${words[0]}`);
    }
    rl.prompt();
  });
}
