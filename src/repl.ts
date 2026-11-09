export function cleanInput(input: string): string[] {
  const words = input.split(" ").filter(ent => ent.length > 0);
  return words.map(ent => ent.toLowerCase());
}
