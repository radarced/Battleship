// this singleton ( an object which lives throughout ) the
// entire program will store every state related to
// the editor as well deal with all functionalities related
// to the accessing , populating , deleting the elements from DOM.
// tldr ; ^ this manager will hold the references to the ship images and deal with
// them minus the rendering .
import Ship from "../modules/Ship.js";

const GRID_SIZE = 10; // its always going to be a 10x10 board.

let UiManager = (() => {
  let elementReferences = {
    menuBoard1: document.querySelector(".board1"),
    menuBoard2: document.querySelector(".board2"),
    menuShipsContainer1: document.querySelector("#sTBP1"),
    menuShipsContainer2: document.querySelector("#sTBP2"),
  };
  // the space complexity is alot more as compared to the canvas but i dont think its worth it to adopt the canvas method
  // alongside typical DOM functionality cuz maintainability and context switch hell .

  let player1ShipsContainer = []; // the container in memory not DOM related
  let player2ShipsContainer = [];
  let shipsOnMenuBoard1Ctr = [];
  let shipsOnMenuBoard2Ctr = [];

  // axiom : the dynamic images / ships are the only ones
  // whose states and memory needs to be deliberately held and dealt with in code .

  function InitialLoad() {
    // populate the toBePlacedShipContainers
    // populate the grids
    createShips(); // populates the shipImages array

    populateShipsContainer(elementReferences.menuShipsContainer1);
    populateShipsContainer(elementReferences.menuShipsContainer2);

    populateMenuGrid(elementReferences.menuBoard1);
    populateMenuGrid(elementReferences.menuBoard2);
  }

  function createShips() {
    for (let i = 1; i <= 5; i++) {
      let ship1 = new Ship(i);
      let ship2 = new Ship(i);
      player1ShipsContainer.push(ship1);
      player2ShipsContainer.push(ship2);
    }
  }

  function populateMenuGrid(grid) {}

  function populateShipsContainer(El_shipsCtr) {
    // this function just creates all the ships inside the ship container
    // ill think and take care of the state functionality and its rendering later .

    let boardNum = +El_shipsCtr.dataset.board; // represents whose board it is
    let shipsCtr;
    if (boardNum === 1) {
      shipsCtr = player1ShipsContainer;
    } else if (boardNum === 2) {
      shipsCtr = player2ShipsContainer;
    }

    for (let i = 0; i < shipsCtr.length; i++) {
      let ship = shipsCtr[i];
      El_shipsCtr.appendChild(ship.img);
    }
  }

  return { InitialLoad };
})();

export default UiManager;
