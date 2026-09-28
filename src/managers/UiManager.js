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
    }
  }
  // getters

  function getDomRefs() {
    return elementReferences;
  }

  return { InitialLoad, getDomRefs };
})();

export default UiManager;
