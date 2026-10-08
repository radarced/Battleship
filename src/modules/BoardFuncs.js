import { cosDegrees, inRange, sinDegrees } from "../modules/utils.js";
import { Position } from "../modules/Ship.js";

import { BOARD_SIZE } from "./Enums.js";
// it takes in the data about what ships are placed and what are not ;
// places the ships that arent placed .
// and accumulates an array which represents all positions of the ships on the board.
function getBoardShipsPos(boardShips, shipsTobePlaced) {
  let placedShipsPos = boardShips.map((boardShip) => boardShip.shipPos);
  if (shipsTobePlaced.length > 0) {
    // place these ships on the board
    // the rotation related code basically exists to preserve the state of the shipsToBePlaced variable as that is not part of Agent.js or GameManager but rather of editorManager;
    let rotations = shipsTobePlaced.map((ship) => ship.rotation);
    randomizeShipRotation(shipsTobePlaced); // for more variety
    placeShips(shipsTobePlaced, placedShipsPos);
    shipsTobePlaced.forEach(
      (ship, index) => (ship.rotation = rotations[index]),
    );
  }
  return placedShipsPos;
}
// note to current self : ideally deal with cell driven abstractions and not Positions.

function randomizeShipRotation(shipsTobePlaced) {
  for (let ship of shipsTobePlaced) {
    ship.rotation = Math.round(Math.random() * 1) * 90;
  }
}

// places the shipsTobePlaced on boardShipsPos.
function placeShips(shipsTobePlaced, boardShipsPos) {
  // get all positions of the baord that boardShipsPos take up.
  let allTakenPos = extractShipsPos(boardShipsPos);
  for (let i = 0; i < shipsTobePlaced.length; i++) {
    let shipToBePlaced = shipsTobePlaced[i];

    // remove takenPos from AllPos.
    let allPos = getEmptyBoard(); // this is the baord on which the random access is going to be invoked on.
    allTakenPos = extractShipsPos(boardShipsPos);
    removeTakenShips(allPos, allTakenPos);

    // loop over the cells of allPos till the ship is placed
    // pick a random cell
    // check whether or not the shipToBePlaced is able to be placed on that cell
    // ^ this would depend upon the takenPos as well as whether or not the shipPos is out of range
    // and more precisely whether or not the ships end point is out of range cuz the start will always be a coherent point.
    let placed = false;

    while (!placed) {
      let randomRowIndex = Math.floor(Math.random() * allPos.length);
      let randomRow = allPos[randomRowIndex]; // allPos = 2d array.

      let randomCellIndex = Math.floor(Math.random() * randomRow.length);
      let randomCell = randomRow[randomCellIndex];

      let currentShipPos = deduceShipPos(
        +randomCell[0],
        +randomCell[1],
        shipToBePlaced,
      );

      let isShipPosValid = deduceShipPosValidity(currentShipPos, allTakenPos);
      if (isShipPosValid) {
        boardShipsPos.push(currentShipPos);
        placed = true;
      } else {
        // if theres only 1 cell left in the randomRow and we're deleting then we have to delete the entire row.
        if (randomRow.length === 1) {
          allPos.splice(randomRowIndex, 1);
        } else {
          // remove 1 cell
          randomRow.splice(randomCellIndex, 1);
        }
      }
    }
  }
}

function deduceShipPos(col, row, ship) {
  // col,row = startCell
  let start = { x: col, y: row };
  let end = {
    x: col + cosDegrees(ship.rotation) * (ship.level - 1),
    y: row + sinDegrees(ship.rotation) * (ship.level - 1),
  };
  let resultantPos = new Position(start, end);
  return resultantPos;
}

// returns true when shipPos is inRange of the boardsize and none of the shipPos's cells
// interfere with takenCells.
function deduceShipPosValidity(shipPos, takenCells) {
  // easiest check is the inRange one.
  if (!inRange(shipPos.end.x, 0, 9) || !inRange(shipPos.end.y, 0, 9)) {
    // if either of the component exceed the board then the shipPos is not valid
    return false;
  }
  let allShipCells = extractShipsPos([shipPos]);
  for (let shipCell of allShipCells) {
    for (let takenCell of takenCells) {
      // if any of the takenCell match a shipCell then that means the shipPos is not valid hence we return false.
      if (shipCell.x === takenCell.x && shipCell.y === takenCell.y) {
        return false;
      }
      // we have to check all of them cuz the ds of takenCells is an unsorted array so cant really do muhc there .
    }
  }

  return true;
}
// takes in a set of cells and removes all those cells
// from the board + rows if a row is deleted.
function removeTakenShips(board, takenCells) {
  // takenCell = {x : N,y : N};
  for (let takenCell of takenCells) {
    let col = takenCell.x;
    let row = takenCell.y;
    // we could implement a binary search for searching for a particular cell inside the baord.Why?
    // as we cut off the cells from the board the indexes of the rows and columns become unreliable
    // to match takenCell -> cellOnBoard .
    // but the items of the board dont change and preserve their original dimensions .
    // hence the correspondence of takenCells and itemsOnBoard will remain even after cutoffs .
    // cuz of that its better to implement relative to search mechanisms to not deal with the offset headaches (im not sure if they will work fine in all cases).
    let boardRow;
    let boardCellIndex;

    let leftIndex = 0;
    let rightIndex = board.length;
    let middleIndex = Math.floor((leftIndex + rightIndex) / 2);

    let targetEl = board[middleIndex][0];

    while (+targetEl[1] !== row) {
      //  ^^ this represents the cell's row on the baord
      if (+targetEl[1] > row) {
        rightIndex = middleIndex;
      } else {
        leftIndex = middleIndex;
      }
      middleIndex = Math.floor((leftIndex + rightIndex) / 2);
      targetEl = board[middleIndex][0];
    }
    boardRow = board[middleIndex];
    // edge case : if theres only 1 item in the row .
    if (boardRow.length === 1) {
      //   boardRow.splice(0, 1); // only 1 possible element and that element is the targetCell or takenCell.
      board.splice(middleIndex, 1); // remove the row itself as well
    } else {
      for (let i = 0; i < boardRow.length; i++) {
        let cell = boardRow[i];
        if (+cell[0] === col) {
          boardCellIndex = i;
          break;
        }
      }
      boardRow.splice(boardCellIndex, 1);
    }
  }
}

// this function is an intermediary function to accomplish the algorithmic tasks related to placing ships on the baord.
// the board is represented as a 2d array where each item in the main array is a row and each row contains
// cells which represent disinct columns whose data are going be strings like '01' where first char represents the col and the second represents the row aka width,height
function getEmptyBoard() {
  let emptyBoard = [];
  emptyBoard.length = BOARD_SIZE;
  for (let i = 0; i < BOARD_SIZE; i++) {
    let row = [];
    row.length = BOARD_SIZE;
    for (let j = 0; j < BOARD_SIZE; j++) {
      row[j] = `${j}${i}`;
    }
    emptyBoard[i] = row;
  }
  return emptyBoard;
}

// given an array of shipPos extract all positions of the board those ships take up.
function extractShipsPos(shipsPos) {
  let allPos = [];
  for (let shipPos of shipsPos) {
    let startNode;
    let endNode;
    let increasingDecider = shipPos.end.x - shipPos.start.x; // if it is more than 0 than that means it is horizantally placed
    if (increasingDecider > 0) {
      startNode = shipPos.start.x;
      endNode = shipPos.end.x;
    } else {
      startNode = shipPos.start.y;
      endNode = shipPos.end.y;
    }
    for (let i = startNode; i <= endNode; i++) {
      let currentCell;
      if (increasingDecider > 0) {
        currentCell = { x: i, y: shipPos.start.y };
      } else {
        currentCell = { x: shipPos.start.x, y: i };
      }
      allPos.push(currentCell);
    }
  }
  return allPos;
}

export {
  extractShipsPos,
  getEmptyBoard,
  removeTakenShips,
  deduceShipPosValidity,
  deduceShipPos,
  placeShips,
  randomizeShipRotation,
  getBoardShipsPos,
};
