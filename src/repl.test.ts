import { cleanInput } from "./repl.js";
import { describe, expect, test } from "vitest";

// test inrastructure - functions, types, etc.
type SeqItem = {
  name: string;
  input: string;
  expected: string[];
}

// sequences
const seqitems: SeqItem[] = [
  {
    name: "spaced-hello-world",
    input: "  hello  world  ",
    expected: ["hello", "world"],
  },
  {
    name: "longer-input",
    input: "peter has a lot of     it ",
    expected: ["peter", "has", "a", "lot", "of", "it"],
  },
  {
    name: "empty",
    input: "            ",
    expected: [],
  },
  {
    name: "leading-space-only",
    input: "   bulbasoour",
    expected: ["bulbasoour"],
  },
  {
    name: "capitals-beginning-full",
    input: "Charmander Bulbasaur PIKACHU",
    expected: ["charmander", "bulbasaur", "pikachu"],
  },
  {
    name: "capitals-partial-word",
    input: "-- pikaCHU  TENTAcool  ",
    expected: ["--", "pikachu", "tentacool"],
  },
];

describe.each(seqitems)(`$name`, ({name, input, expected}) => {
  test("direct-seqitems", () => {
    // call cleanInput with the input here
    const actual = cleanInput(input);

    // The `expect` and `toHaveLength` functions are from vitest
    // they will fail the test if the condition is not met
    expect(actual).toHaveLength(expected.length);
    for (const i in expected) {
      // likewise, the `toBe` function will fail the test if the values are not equal.
      expect(actual[i]).toBe(expected[i]);
    }
  });
});
