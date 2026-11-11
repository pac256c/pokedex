import { initState, State } from "./state.js";

export function cleanInput(input: string): string[] {
  const words = input.split(" ").filter(ent => ent.length > 0);
  return words.map(ent => ent.toLowerCase());
}

export function startREPL(): void {
  const state: State = initState();

  state.rl.prompt();
  state.rl.on("line", async (input: string) => {
    const words = cleanInput(input);
    if (words.length > 0) {
      if (words[0] in state.cmds) {
        try {
          state.extraArgs = words.slice(1);
          await state.cmds[words[0]].callback(state);
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.log(`Error encountered: ${error.message}`);
          } else {
            console.log(`Error encountered: ${String(error)}`);
          } 
        }
      }
      else console.log("Unknown command");
    }
    state.rl.prompt();
  });
}
