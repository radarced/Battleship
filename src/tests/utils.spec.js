import { inRange } from "../modules/utils.js";

describe("inRange", () => {
  test("5 comes in between 2 and 7", () => {
    expect(inRange(5, 2, 7)).toBe(true);
  });

  test("6 does not come in between 2 and 5", () => {
    expect(inRange(6, 2, 5)).toBe(false);
  });
});
