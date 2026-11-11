import { Cache } from "./pokecache.js";
import { describe, expect, test, beforeEach, afterEach } from "vitest";

// test inrastructure - functions, types, etc.
const sleep = async (delay: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

type AddSeqItem = {
  action: "add";
  args: Parameters<Cache["add"]>;
};

type GetSeqItem = {
  action: "get";
  args: Parameters<Cache["get"]>;
  expectedResult: any;
};

type SleepSeqItem = {
  action: "sleep";
  args: Parameters<typeof sleep>;
}

type SeqItem = AddSeqItem | GetSeqItem | SleepSeqItem;
type Sequence = {name: string; steps: SeqItem[] };

// sequences
const sequences: Sequence[] = [
  {
    name: "add-then-get",
    steps: [
      {action: "add", args: ["please", 5]},
      {action: "get", args: ["please"], expectedResult: 5},
    ],
  },
  {
    name: "check-value-replaced",
    steps: [
      {action: "add", args: ["peter", 50]},
      {action: "add", args: ["peter", "no"]},
      {action: "get", args: ["peter"], expectedResult: "no"},
    ],
  },
  {
    name: "check-object-insertion",
    steps: [
      {action: "add", args: ["peter", {"hello": 5}]},
      {action: "get", args: ["peter"], expectedResult: {"hello": 5}},
    ],
  },
  {
    name: "missing-key-test",
    steps: [
      {action: "add", args: ["charli", 5]},
      {action: "get", args: ["xcx"], expectedResult: undefined},
    ],
  },
  {
    name: "basic-reap-test",
    steps: [
      {action: "add", args: ["peter", 1]},
      {action: "sleep", args: [500]},
      {action: "get", args: ["peter"], expectedResult: undefined},
    ],
  },
  {
    name: "reap-before-and-after",
    steps: [
      // need 2 reap cycles to pass - 200ms.
      //  "hannah" created in 1st interval, 1st reap clears stuff added BEFORE the 1st interval, i.e. 0th interval
      //  2nd reap clears stuff in the 1st iterval.
      {action: "add", args: ["hannah", true]},
      {action: "get", args: ["hannah"], expectedResult: true},
      {action: "sleep", args: [80]},
      {action: "get", args: ["hannah"], expectedResult: true},
      {action: "sleep", args: [160]},
      {action: "get", args: ["hannah"], expectedResult: undefined},
    ],
  },
  {
    name: "reap-interleave",
    steps: [
      {action: "add", args: ["peter", false]},
      {action: "sleep", args: [150]},
      {action: "add", args: ["hannah", true]},
      {action: "sleep", args: [80]},
      {action: "get", args: ["peter"], expectedResult: undefined},
      {action: "get", args: ["hannah"], expectedResult: true},
      {action: "sleep", args: [100]},
      {action: "get", args: ["hannah"], expectedResult: undefined},
    ]
  },
];

// harness - run the sequences
describe.each(sequences)(`$name`, ({name, steps}) => {
    let cache: Cache;

    beforeEach(() => {
      cache = new Cache(100);
    });

    afterEach(() => {
      cache.stopReapLoop();
    });

    test("direct-sequences", async () => {
      for (const step of steps) {
        if (step.action === "add") {
          cache.add(...step.args);
        }
        else if (step.action === "get") {
          const result = cache.get(...step.args);
          expect(result).toEqual(step.expectedResult);
        }
        else if (step.action === "sleep") {
          await sleep(...step.args);
        }
      }
    }
  );
});
