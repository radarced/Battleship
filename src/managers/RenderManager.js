import UiManager from "./UiManager.js";
import { BOARD_SHIP, SHIP_TO_BE_PLACED } from "../modules/Enums.js";
import { inRange, sinDegrees } from "../modules/utils.js";
// ^^ this is going to be used to access the DOM references .
// as renderManager itself is not responsible for that it only cares about
// taking space and converting it into a visual display for the user .
// this singleton will essentially take care of all
// functionality which renders something on the DOM based upon state stored
// in code . it is basically an object with public methods
// that take the state - > render it accordingly to whatever state was passed .

// what it knows about : how to render each state .

let RenderManager = (() => {
  // boardNum represents which shipsContainer (1,2) is the one which needs to be rendered.
  function renderShipsContainer(shipsState, boardNum) {
    let domRefs = UiManager.getDomRefs();
    let shipsElKey = "menuShipsContainer" + boardNum;
    let shipsEl = domRefs[shipsElKey]; // this function will assume that this does exist
    shipsEl.innerHTML = ""; // reset it
    for (let ship of shipsState) {
      shipsEl.appendChild(ship.img);
      ship.img.className = "shipToBePlaced";
      ship.img.style.transform = `rotate(${ship.rotation}deg)`;
    }
  }

  function renderRotateShipsContainer(boardNum) {
    let domRefs = UiManager.getDomRefs();
    let shipsElKey = "menuShipsContainer" + boardNum;
    let shipsEl = domRefs[shipsElKey]; // this function will assume that this does exist

    shipsEl.classList.toggle("horizantal"); // these two lines toggle off the class that was already active and toggles on the one that was not and it matches it
    shipsEl.classList.toggle("vertical");
  }

  function renderLastClicked(lastClicked, EL_lastClickedShip) {
    if (EL_lastClickedShip === undefined && lastClicked === null) {
      // this code just exists on the edge case where the user rotates the ships without having an actual lastClicked or lastClicked_EL so we get undefined this basically acts as a safeguard for that particular call.
      return;
    }
    if (lastClicked === null) {
      // lastClicked was set to null.
      EL_lastClickedShip.classList.remove("clicked");
      return;
    }
    if (EL_lastClickedShip !== undefined) {
      // the element is passed meaning simply render that element
      EL_lastClickedShip.classList.add("clicked");
      return;
    }
    // getting the element

    let type = lastClicked.type;
    if (type === SHIP_TO_BE_PLACED) {
      EL_lastClickedShip = UiManager.getShipToBePlaced(lastClicked);
    } else if (type === BOARD_SHIP) {
      EL_lastClickedShip = UiManager.getBoardShip(lastClicked);
    } else {
      console.log(lastClicked);
      throw new RangeError(
        "the type of lastClicked goes beyond or underneath 1 and 2 ",
      );
    }
    EL_lastClickedShip.classList.add("clicked");
  }

  // this function serves the sole purpose to redo the preceding lastClicked before setting the new lastClicked to clicked;
  function renderPrecedingLastClicked(lastClicked) {
    if (lastClicked === null) {
      return; // no lastClicked element
    }
    // lastClicked = (level,type,player);
    // hence traverse through the corresponding type of containers and find the ship.
    let type = lastClicked.type;
    let EL_lastClickedShip;
    if (type === SHIP_TO_BE_PLACED) {
      EL_lastClickedShip = UiManager.getShipToBePlaced(lastClicked);
    } else if (type === BOARD_SHIP) {
      EL_lastClickedShip = UiManager.getBoardShip(lastClicked);
    } else {
      console.log(lastClicked);
      throw new RangeError(
        "the type of lastClicked goes beyond or underneath 1 and 2 ",
      );
    }
    EL_lastClickedShip.classList.remove("clicked");
  }

  // this function is going to assume that these dom refs work and we are in the editor menu state
  function renderMenuBoards() {
    let domRefs = UiManager.getDomRefs();
    // go through both board and reset each cell's class to default cell.water
    renderBoard(domRefs.menuBoard1);
    renderBoard(domRefs.menuBoard2);
  }

  function renderMenuBoard(boardNum) {
    let menuBoard = UiManager.getMenuBoard(boardNum);
    renderBoard(menuBoard); //
  }

  function renderBoardShips(boardShips, boardNum, EL_boardShipsCtr) {
    if (EL_boardShipsCtr === undefined) {
      // get the board
      EL_boardShipsCtr = UiManager.getBoardShipsCtr(boardNum);
    }
    EL_boardShipsCtr.innerHTML = "";
    for (let boardShip of boardShips) {
      EL_boardShipsCtr.appendChild(boardShip.ship.img);
      let ship = boardShip.ship;
      boardShip.ship.img.className = "boardShip";
      let offsetFactor = sinDegrees(boardShip.ship.rotation); // this is basically there because rotation doesnt work seamlessly and there seems to be a 1 off problem in the y axis
      boardShip.ship.img.style.top = `${(boardShip.shipPos.start.y - offsetFactor) * 10}%`;
      boardShip.ship.img.style.left = `${boardShip.shipPos.start.x * 10}%`;
      ship.img.width = 41.88 * ship.level;
      ship.img.height = 41.88;
      boardShip.ship.img.style.transform = `rotate(${boardShip.ship.rotation}deg)`;
    }
  }

  function renderBoard(board) {
    let boardChildren = board.children;
    for (let i = 0; i < boardChildren.length; i++) {
      if (i === 10) {
        // we are on the ships container inside board which basically is a container filled
        // with absolute positioning ships and its ships so not cells hence ignore
        continue;
      }
      let row = boardChildren[i];
      let rowChildren = row.children;
      for (let j = 0; j < rowChildren.length; j++) {
        let col = rowChildren[j];
        col.className = "cell water";
      }
    }
  }

  function renderHoveredShip(shipPos, hoverColour, boardNum) {
    // make the cells in shipPos that correspond with the board the hoverColour just add a class of hoverColour to it
    let menuBoard = UiManager.getMenuBoard(boardNum);
    // decide whether its increasing horizantally or veritclaly.
    let startPos = shipPos.start;
    let startNode;
    let endNode;
    let increasingDecider = shipPos.end.x - shipPos.start.x;

    if (shipPos.end.x - shipPos.start.x > 0) {
      // its increasing horizantally
      startNode = shipPos.start.x;
      endNode = shipPos.end.x;
    } else {
      // vertically and the 1x1 case is handled by itself so no worries there.
      startNode = shipPos.start.y;
      endNode = shipPos.end.y;
    }

    // we traverse from the startNode to the endNode and paint it ; if we reach a point outside the range of the board then we terminate
    for (let i = startNode; i <= endNode; i++) {
      if (!inRange(i, 0, 9)) {
        // we are traversing through something beyond the board
        break;
      }

      if (increasingDecider > 0) {
        // its increasing horizantally
        startPos.x = i;
        // the other component remains constant
      } else {
        startPos.y = i;
      }

      let EL_cell = UiManager.getCell(menuBoard, startPos.x, startPos.y);
      EL_cell.classList.add(hoverColour);
    }
  }

  return {
    renderShipsContainer,
    renderMenuBoards,
    renderMenuBoard,
    renderBoardShips,
    renderRotateShipsContainer,
    renderLastClicked,
    renderPrecedingLastClicked,
    renderHoveredShip,
  };
})();

export default RenderManager;
