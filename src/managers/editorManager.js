import { BOARD_SHIP, SHIP_TO_BE_PLACED } from "../modules/Enums.js";
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
  let menuBoardShips1 = []; // this array would hold shipPosition whose prototype will be the Position object and it basically holds the ships that have been placed on board1 or board2 correspondingly .
  let menuBoardShips2 = [];

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

  // LC = lastClicked;
  // this function places the lastClicked ship on the given shipPos.
  // this function's assumptions :
  // this function assumes that the given shipPos is unique relative to all the other shipPos on that menuBoard
  // this function assumes that lastClicked is not null and
  // that the boardShipPos is valid .
  function placeLC_Board(boardShipPos) {
    let correspondingShip = getLastClickedCorrespondingShip();
    let correspondingShipCtr = getLastClickedCorrespondingShips();
    let correspondingShipIndex = getLastClickedCorrespondingShipIndex();

    correspondingShipCtr.splice(correspondingShipIndex, 1); // remove the corresponing ship relative to last Clicked from the corresponding container.
    // now add the correspondingShip onto the board in the given pos
    // hence just push it into the MenuBoard container;
    let menuBoardCtr = getPlayerBoardShips(lastClicked.player);
    menuBoardCtr.push(
      new BoardShip(
        lastClicked.level,
        lastClicked.player,
        boardShipPos.start,
        boardShipPos.end,
        correspondingShip, // points to an object with the Ship prototype in both boardShip and shipTObePlace cases
      ),
    );
    lastClicked = null; // because we put the lastClicked on the board.
  }

  // returns a boolean which represents whether or not the shipPos given intersects
  // with any of the ships that are already placed on that board
  function isShipPosTaken(shipPos, boardNum) {
    let shipCtr = getPlayerBoardShips(boardNum);
  }

  // ship position related functions
  function isShipPosValid(shipPos) {
    return inRange(shipPos.end.x, 0, 9) && inRange(shipPos.end.y, 0, 9);
  }

  // returns if lastClicked's player is the given parameter
  // assume that lastClicked is not null
  function isLastClickedPlayer(playerNum) {
    return lastClicked.player === playerNum;
  }

  function getPlayerBoardShips(boardNum) {
    if (boardNum === PLAYER_1_NUM) {
      return menuBoardShips1;
    } else if (boardNum === PLAYER_2_NUM) {
      return menuBoardShips2;
    }
    // there are no other players as of now so accessing beyond that is not allowed.
    return undefined;
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

  // its redundant but the distinction is that this is alot more concise and i dont care enough to do a find and replace .
  function getBoardShips(boardNum) {
    return getPlayerBoardShips(boardNum);
  }

  function getBoardShip(playerNum, shipLevel) {
    let boardShips = getPlayerBoardShips(playerNum);
    for (let boardShip of boardShips) {
      if (boardShip.ship.level === shipLevel) {
        return boardShip;
      }
    }
    return; // <- if shipLevel does not match any of the ships in state
  }

  function getLastClicked() {
    return lastClicked;
  }

  // returns the ship's renderData(Ship interface) in the boardShip's case and Ship on ship case.
  function getLastClickedCorrespondingShip() {
    if (lastClicked === null) {
      return;
    }
    let correspondingShip;
    if (lastClicked.type === SHIP_TO_BE_PLACED) {
      correspondingShip = getPlayerShipToBePlaced(
        lastClicked.player,
        lastClicked.level,
      );
    } else if (lastClicked.type === BOARD_SHIP) {
      let boardShip = getBoardShip(lastClicked.player, lastClicked.level);
      correspondingShip = boardShip.ship;
    }

    return correspondingShip;
  }
  function getLastClickedCorrespondingShipIndex() {
    if (lastClicked === null) {
      return;
    }
    let correspondingShipCtr = getLastClickedCorrespondingShips();
    let index;
    if (lastClicked.type === BOARD_SHIP) {
      index = correspondingShipCtr.findIndex(
        (currentShip) => currentShip.ship.level === lastClicked.level,
      );
    } else if (lastClicked.type === SHIP_TO_BE_PLACED) {
      index = correspondingShipCtr.findIndex(
        (currentShip) => currentShip.level === lastClicked.level,
      );
    }
    return index;
  }

  // this function returns the container of ships that the lastClicked corresponding ship is inside in.
  function getLastClickedCorrespondingShips() {
    if (lastClicked === null) {
      return;
    }
    let correspondingShipCtr;
    if (lastClicked.type === SHIP_TO_BE_PLACED) {
      correspondingShipCtr = getPlayerShipsToBePlaced(lastClicked.player);
    } else if (lastClicked.type === BOARD_SHIP) {
      correspondingShipCtr = getPlayerBoardShips(lastClicked.player);
    }
    return correspondingShipCtr;
  }

  // this function would never be called with lastClicked being null but whatever ..
  function getLastClickedPos(col, row) {
    if (lastClicked === null) {
      return;
    }
    let correspondingShip = getLastClickedCorrespondingShip();

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
    placeLC_Board,
    isShipPosValid, // ship position related function
    isShipPosTaken, // ship position and board related function
    isLastClickedPlayer,
    getBoardShips,
    getPlayerShipsToBePlaced,
    getLastClicked,
    getLastClickedPos, // ship position related function
    getLastHoveredCell, // last hovered cell related function
    updateLastHoveredCell, // last hovered cell related function
    removeLastHoveredCell, // last hovered cell related function
  };
})();

export default editorManager;
