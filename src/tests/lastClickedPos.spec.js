import { Position } from "../modules/Ship.js";
import { cosDegrees, sinDegrees } from "../modules/utils.js";

function getShipPos(col, row, rotation, level) {
  let start = { x: col, y: row }; // startingPos
  let end = {
    x: col + cosDegrees(rotation) * (level - 1),
    y: row + sinDegrees(rotation) * (level - 1),
  };

  let resultantPos = new Position(start, end);
  return resultantPos;
}

describe("lastClicked pos check by various positions : ", () => {
  test("#1 big one", () => {
    expect(getShipPos(0, 0, 0, 5)).toEqual({
      start: { x: 0, y: 0 },
      end: { x: 4, y: 0 },
    });
  });
});
