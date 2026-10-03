// this singleton ( an object which lives throughout ) the
// entire program will store every state related to
// the editor as well deal with all functionalities related
// to the accessing , populating , deleting the elements from DOM.
// tldr ; ^ this manager will hold the references to the ship images and deal with
// them minus the rendering .

const GRID_SIZE = 10; // its always going to be a 10x10 board.

let UiManager = (() => {
  let elementReferences = {
    mainCtr: document.querySelector(".mainContainer"),
    menuBoard1: document.querySelector("#menuBoard1"),
    menuBoard2: document.querySelector("#menuBoard2"),
    menuShipsContainer1: document.querySelector("#sTBP1"),
    menuShipsContainer2: document.querySelector("#sTBP2"),
  };

  function InitialLoad(shipsContainer1, shipsContainer2) {
    populateShipsContainer(
      elementReferences.menuShipsContainer1,
      shipsContainer1,
    );
    populateShipsContainer(
      elementReferences.menuShipsContainer2,
      shipsContainer2,
    );

    populateMenuGrid(elementReferences.menuBoard1);
    populateMenuGrid(elementReferences.menuBoard2);

    // adding boardShipsContainer on both boards.
    // i dont give a shit about refactoring this part just know that everything below is just
    // adding a boardShipsCtr(div) to the end of the menuBoards.
    let boardShipsCtr1 = document.createElement("div");
    boardShipsCtr1.className = "boardShipsCtr";
    elementReferences.menuBoard1.appendChild(boardShipsCtr1);
    let boardShipsCtr2 = document.createElement("div");
    boardShipsCtr2.className = "boardShipsCtr";
    elementReferences.menuBoard2.appendChild(boardShipsCtr2);
  }

  function populateMenuGrid(grid) {
    for (let i = 0; i < GRID_SIZE; i++) {
      let row = document.createElement("div");
      row.className = "row";

      for (let j = 0; j < GRID_SIZE; j++) {
        let cell = document.createElement("div");
        cell.className = "cell water";
        cell.dataset.row = i;
        cell.dataset.col = j;
        row.appendChild(cell);
      }
      grid.appendChild(row);
    }
  }

  function populateShipsContainer(El_shipsCtr, shipsCtr) {
    // this function just creates all the ships inside the ship container

    for (let i = 0; i < shipsCtr.length; i++) {
      let ship = shipsCtr[i];
      El_shipsCtr.appendChild(ship.img);
      ship.img.className = "shipToBePlaced";
    }
  }
  // getters

  function getDomRefs() {
    return elementReferences;
  }

  // this function would only be called if there are actual ships inside the container
  function getShipToBePlaced(shipData) {
    let shipCtrKey = "menuShipsContainer" + shipData.player;
    let shipCtrChildren = elementReferences[shipCtrKey].children;
    // loop through them and find the one with the correct level
    for (let i = 0; i < shipCtrChildren.length; i++) {
      let shipEL = shipCtrChildren[i];
      let shipLevel = +shipEL.dataset.level; // the unary + operator to convert the string into number
      if (shipLevel === shipData.level) {
        return shipEL;
      }
    }
  }

  function getBoardShipsCtr(boardNum) {
    let menuBoard = getMenuBoard(boardNum);
    const BOARD_SHIPS_CTR_INDEX = 10;
    return menuBoard.children[BOARD_SHIPS_CTR_INDEX];
  }

  function getMenuBoard(boardNum) {
    let boardKey = "menuBoard" + boardNum;
    return elementReferences[boardKey];
  }

  // cuz arrays are O(1) access this is fast yes really vague and non necessary but whatever
  function getCell(board, col, row) {
    let children = board.children;
    return children[row].children[col]; // cuz they are ordered in that same manner
  }

  function getBoardShip(shipData) {
    let boardShipCtr = getBoardShipsCtr(shipData.player).children;
    for (let i = 0; i < boardShipCtr.length; i++) {
      let boardShip = boardShipCtr[i];
      let boardShipLevel = +boardShip.dataset.level;
      if (boardShipLevel === shipData.level) {
        return boardShip;
      }
    }
    return;
  }

  return {
    InitialLoad,
    getDomRefs,
    getBoardShip,
    getShipToBePlaced,
    getMenuBoard,
    getBoardShipsCtr,
    getCell,
  };
})();

export default UiManager;
