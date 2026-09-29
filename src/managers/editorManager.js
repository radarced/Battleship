import { SHIP_TO_BE_PLACED } from "../modules/Enums.js";
import { Ship, BoardShip, Position } from "../modules/Ship.js";
import { inRange, cosDegrees, sinDegrees } from "../modules/utils.js";
// this object will also be a singleton (even though technically its purpose doesnt last throughout the entire program )
// this object will handle all of the logic and data related to the editor menu.
// this object will NOT do any populating or rendering but will manipulate state
// which will be then passed later to renderManager.

const PLAYER_1_NUM = 1;
const PLAYER_2_NUM = 2; // dont really see any other place to put these guys atm
const SHIPTOBEPLACED = 1;
const BOARDSHIP = 2;

function shallowEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // 1. Check if they have the same number of properties
  if (keys1.length !== keys2.length) {
    return false;
  }

  // 2. Check if every key-value pair matches
  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

// superShips = Position + ship or in another words stateData + renderData .
let editorManager = (() => {
  // the space complexity is alot more as compared to the canvas but i dont think its worth it to adopt the canvas method
  // alongside typical DOM functionality cuz maintainability and context switch hell .

  let player1ShipsContainer = []; // this represents the ships that are in the container which contains the ships that are to be placed on the board .
  let player2ShipsContainer = [];
  let shipsOnMenuBoard1Ctr = []; // this array would hold shipPosition whose prototype will be the Position object and it basically holds the ships that have been placed on board1 or board2 correspondingly .
  let shipsOnMenuBoard2Ctr = [];

  let lastClicked = null; // this represents the last clicked ship on any of the elements ( menuBoards and shipContainers )
  // ^ this will need 3 info ( playerNum , type , level )
  // playerNum = 1,2 ; type = boardShip,shipToBePlaced ;level = 1-5;

  let lastHoveredCell = false; // this variable represents the last cell that was hovered on the board.
  // this is basically there for us to

  function createShips() {
    for (let i = 1; i <= 5; i++) {
      let ship1 = new Ship(i, PLAYER_1_NUM);
      let ship2 = new Ship(i, PLAYER_2_NUM);

      player1ShipsContainer.push(ship1);
      player2ShipsContainer.push(ship2);
    }
  }

  function rotateShips(playerNum) {
    let shipsCtr = getPlayerShipsToBePlaced(playerNum);
    for (let i = 0; i < shipsCtr.length; i++) {
      let ship = shipsCtr[i];
      if (ship.rotation === 0) {
        ship.rotation += 90;
      } else {
        ship.rotation = 0;
      }
    }
  }

  // ship position related functions
  function isShipPosValid(shipPos) {
    return inRange(shipPos.end.x, 0, 9) && inRange(shipPos.end.y, 0, 9);
  }

  function getPlayerShipsToBePlaced(playerNum) {
    if (playerNum === PLAYER_1_NUM) {
      return player1ShipsContainer;
    } else if (playerNum === PLAYER_2_NUM) {
      return player2ShipsContainer;
    }
    // there are no other players as of now so accessing beyond that is not allowed.
    return undefined;
  }

  // this function traverses through the corresponding shipsToBePlaced container and finds the one accordingly
  // to given parameter shipLevel
  function getPlayerShipToBePlaced(playerNum, shipLevel) {
    let shipCtr = getPlayerShipsToBePlaced(playerNum);
    for (let ship of shipCtr) {
      let currentShipLevel = ship.level;
      if (currentShipLevel === shipLevel) {
        return ship;
      }
    }
  }

  function getLastClicked() {
    return lastClicked;
  }

  // this function would never be called with lastClicked being null but whatever ..
  function getLastClickedPos(col, row) {
    if (lastClicked === null) {
      return;
    }
    let correspondingShip;
    if (lastClicked.type === SHIP_TO_BE_PLACED) {
      correspondingShip = getPlayerShipToBePlaced(
        lastClicked.player,
        lastClicked.level,
      );
    }

    let start = { x: col, y: row }; // startingPos
    let end = {
      x:
        col +
        cosDegrees(correspondingShip.rotation) * (correspondingShip.level - 1),
      y:
        row +
        sinDegrees(correspondingShip.rotation) * (correspondingShip.level - 1),
    };

    let resultantPos = new Position(start, end);
    return resultantPos;
  }

  // lastClicked = player,level,type reference lastClicked for their possible values .
  function updateLastClicked(level, type, player) {
    let newClicked = { level: level, type: type, player: player };

    if (lastClicked === null) {
      lastClicked = newClicked;
      return;
    }

    if (shallowEqual(newClicked, lastClicked)) {
      lastClicked = null;
      return;
    }
    // theyre not equal and there was a previous lastClicked which for rendering purposes is dealt with inside the eventHandler
    // and RenderManager beforehand so no need to worry about that .
    lastClicked = newClicked;
  }

  // last hovered cell related functions
  function getLastHoveredCell() {
    return lastHoveredCell;
  }

  // this will be called when the mousemove event happens over a distinct / new cell.
  function updateLastHoveredCell(col, row, playerNum) {
    lastHoveredCell = true;
  }

  // this will be called when the mousemove event is called on something thats not a cell.
  function removeLastHoveredCell() {
    lastHoveredCell = false;
  }

  return {
    createShips,
    rotateShips,
    updateLastClicked,
    isShipPosValid, // ship position related function
    getPlayerShipsToBePlaced,
    getLastClicked,
    getLastClickedPos, // ship position related function
    getLastHoveredCell, // last hovered cell related function
    updateLastHoveredCell, // last hovered cell related function
    removeLastHoveredCell, // last hovered cell related function
  };
})();

export default editorManager;
