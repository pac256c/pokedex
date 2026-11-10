import { Cache } from "./pokecache.js";
import { describe, expect, it, beforeEach } from "vitest";

type AddStep = {
  action: "add";
  args: Parameters<Cache["add"]>;
};

type GetStep = {
  action: "get";
  args: Parameters<Cache["get"]>;
  expectedResult: any;
};

type Step = AddStep | GetStep;
type Sequence = {name: string; steps: Step[] };

const sequences: Sequence[] = [
  {
    name: "add then immediate get",
    steps: [
      {action: "add", args: ["please", 5]},
      {action: "get", args: ["please"], expectedResult: 5},
    ],
  },
  {
    name: "check value is replaced",
    steps: [
      {action: "add", args: ["peter", 50]},
      {action: "add", args: ["peter", "no"]},
      {action: "get", args: ["peter"], expectedResult: "no"},
    ],
  },
  {
    name: "check insertion of object",
    steps: [
      {action: "add", args: ["peter", {"hello": 5}]},
      {action: "get", args: ["peter"], expectedResult: {"hello": 5}},
    ],
  },
  {
    name: "missing key test",
    steps: [
      {action: "add", args: ["charli", 5]},
      {action: "get", args: ["xcx"], expectedResult: undefined},
    ]
  },
];

describe.each(sequences)(
  (sequence: Sequence) => `${sequence.name}`, 
  (sequence: Sequence) => {
    let cache: Cache;

    //initial block before each sequence
    beforeEach(() => {
      cache = new Cache();
    });

    it("executes sequences in order and validates states", () => {
      for (const step of sequence.steps) {
        if (step.action === "add") {
          cache.add(...step.args);
        }
        else if (step.action === "get") {
          const result = cache.get(...step.args);
          expect(result).toEqual(step.expectedResult);
        }
      }
    }
  );
});
