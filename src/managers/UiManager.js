// this singleton ( an object which lives throughout ) the
// entire program will deal with all functionalities related
// to the accessing , populating , deleting the elements from DOM.
import { GAME_STATES } from "../modules/Enums.js";
import gameMenuHtml from "../views/gameMenu.js";

const GRID_SIZE = 10; // its always going to be a 10x10 board.

let UiManager = (() => {
  // this object represents the element references that exist on the DOM on a specific gameState
  let body = document.querySelector("body");
  let gameState = GAME_STATES.EDITOR_MENU;

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
    addElement("div", "boardShipsCtr", elementReferences.menuBoard1);
    addElement("div", "boardShipsCtr", elementReferences.menuBoard2);
  }

  function populateMenuGrid(grid) {
    let cellClassName = "cell water";
    if (gameState === GAME_STATES.GAME_MENU) {
      cellClassName = "cell";
    }
    for (let i = 0; i < GRID_SIZE; i++) {
      let row = document.createElement("div");
      row.className = "row";

      for (let j = 0; j < GRID_SIZE; j++) {
        let cell = document.createElement("div");
        cell.className = cellClassName;
        cell.dataset.row = i;
        cell.dataset.col = j;
        row.appendChild(cell);
      }
      grid.appendChild(row);
    }
  }

  // helper method
  function addElement(elementType, className, parentElement) {
    let newEl = document.createElement(elementType);
    newEl.className = className;
    parentElement.appendChild(newEl);
  }

  function populateShipsContainer(El_shipsCtr, shipsCtr) {
    // this function just creates all the ships inside the ship container

    for (let i = 0; i < shipsCtr.length; i++) {
      let ship = shipsCtr[i];
      El_shipsCtr.appendChild(ship.img);
      ship.img.className = "shipToBePlaced";
    }
  }

  // this function is called when we switch from a specific gameState to a new gameState
  // and it basically removes the elements from the DOM and removes the elements references in code .
  function switchGameState() {
    gameState = GAME_STATES.GAME_MENU;

    body.innerHTML = "";
    for (let menuEl in elementReferences) {
      delete elementReferences[menuEl];
    }
  }

  // this function populates the DOM with the gameMenu state elements and populates the references with them as well.
  function populateGameMenu() {
    body.insertAdjacentHTML("beforeend", gameMenuHtml);
    populateGameMenuRefs();
    populateMenuGrid(elementReferences.gameBoard1);
    populateMenuGrid(elementReferences.gameBoard2);
    addBoardShipsCtr(elementReferences.gameBoard1);
    addBoardShipsCtr(elementReferences.gameBoard2);
  }

  function populateGameMenuRefs() {
    elementReferences.gameMenuCtr = document.querySelector(".gameMenu");
    elementReferences.gameBoard1 = document.querySelector(".gameBoard1");
    elementReferences.gameBoard2 = document.querySelector(".gameBoard2");
    elementReferences.descriptiveHeading = document.querySelector("#gmh1");
    elementReferences.backToMenuBtn = document.querySelector(".backToMenu");
    elementReferences.playAgainBtn = document.querySelector(".playAgain");
  }

  function addBoardShipsCtr(board) {
    addElement("div", "boardShipsCtr", board);
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
    let boardPrefix = "menuBoard";
    if (gameState === GAME_STATES.GAME_MENU) {
      boardPrefix = "gameBoard";
    }

    let boardKey = boardPrefix + boardNum;
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

  function getAgentChoiceBtn(playerNum, chosenAgent) {
    let EL_agentCtr = getMenuBoard(playerNum).parentElement.children[0];
    for (let i = 0; i < EL_agentCtr.children.length; i++) {
      let EL_agentBtn = EL_agentCtr.children[i];
      let currentAgent = EL_agentBtn.dataset.choose;
      if (currentAgent === chosenAgent) {
        return EL_agentBtn;
      }
    }
  }

  return {
    InitialLoad,
    populateMenuGrid,
    populateGameMenu,
    switchGameState,
    getDomRefs,
    getBoardShip,
    getShipToBePlaced,
    getMenuBoard,
    getBoardShipsCtr,
    getCell,
    getAgentChoiceBtn,
  };
})();

export default UiManager;
