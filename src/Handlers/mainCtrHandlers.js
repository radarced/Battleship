import editorManager from "../managers/editorManager.js";
import RenderManager from "../managers/RenderManager.js";
import { BOARD_SHIP, SHIP_TO_BE_PLACED } from "../modules/Enums.js";

function mainCtrClickHandler(e) {
  let eventTarget = e.target;
  let etClassName = eventTarget.classList.item(0); // like Array.at() just a safeguard

  switch (etClassName) {
    case "rotate":
      {
        // this block scope is required so that its variables scope does not conflict with the other cases
        // rotate the ships inside the shipsContainer of the corresponding player inside the editorManager.
        let playerNum = +eventTarget.dataset.board; // this represents the answer of which player's ships are to be rotated .
        editorManager.rotateShips(playerNum);
        RenderManager.renderShipsContainer(
          editorManager.getPlayerShipsToBePlaced(playerNum),
          playerNum,
        );
        RenderManager.renderRotateShipsContainer(playerNum);
        RenderManager.renderLastClicked(editorManager.getLastClicked());
      }
      break;
    case "shipToBePlaced":
    case "boardShip":
      // a ship inside the ShipsToBePlacedContainer is clicked
      RenderManager.renderPrecedingLastClicked(editorManager.getLastClicked());

      let level = +eventTarget.dataset.level;
      let playerNum = +eventTarget.dataset.playerNum;
      let shipType =
        etClassName === "shipToBePlaced" ? SHIP_TO_BE_PLACED : BOARD_SHIP;

      editorManager.updateLastClicked(level, shipType, playerNum);
      RenderManager.renderLastClicked(
        editorManager.getLastClicked(),
        eventTarget,
      );
      break;
    case "cell":
      // clicking on a cell we should first check whether or not the lastClicked
      if (editorManager.getLastClicked() !== null) {
        // there is a ship(boardShip || shipToBePlaced) which is clicked
        // at this point we have to check whether or not the ship that is clicked belongs to the board/player that was clicked .
        let currentCellPlayer =
          +eventTarget.parentElement.parentElement.dataset.player; // the boardEl has the player attribute in it board - > row - > cell.
        let isSameBoard = editorManager.isLastClickedPlayer(currentCellPlayer);
        if (!isSameBoard) {
          return;
        }
        // check whether or not the desired position is valid.
        // if it is valid then update the lastClickedCorrespondingShip to the new location and then
        // render both shipContainers the boardShips and shipsToBePlaced.
        let col = +eventTarget.dataset.col;
        let row = +eventTarget.dataset.row;
        let shipPos = editorManager.getLastClickedPos(col, row);

        if (!editorManager.isShipPosValid(shipPos)) {
          // check if the shipPos is valid
          return;
        }
        console.log(shipPos);
        if (editorManager.isShipPosTaken(shipPos, currentCellPlayer)) {
          return;
        }
        // ship can be placed on the board on this position
        // hence we update the state and render both containers as both can be the changed state as the consequences of the ship's state manipulation.
        let lastClicked = editorManager.getLastClicked();
        console.log(shipPos);
        editorManager.placeLC_Board(shipPos);
        editorManager.updateLastClicked(
          lastClicked.level,
          lastClicked.type,
          lastClicked.player,
        ); // sets lastClicked to null

        RenderManager.renderMenuBoard(currentCellPlayer);
        RenderManager.renderShipsContainer(
          editorManager.getPlayerShipsToBePlaced(currentCellPlayer),
          currentCellPlayer,
        );
        RenderManager.renderBoardShips(
          editorManager.getBoardShips(currentCellPlayer),
          currentCellPlayer,
        );
      }
      break;
    case "shipsToBePlaced":
      // if lastClicked refers to a ship on the board which is of the same playerNum of the
      // shipsToBePlacedContainer then make the lastClicked ship back into as a shipToBePlaced and make the lastClicked refer to null as well
      // as render the precedingLastClicked
      if (editorManager.getLastClicked() === null) {
        return;
      }
      if (editorManager.getLastClicked().type === BOARD_SHIP) {
        let boardNum = +eventTarget.dataset.board;
        if (!editorManager.isLastClickedPlayer(boardNum)) {
          // if lastClicked is not on the same board as the shipsToBePlaced container is
          return;
        }
        RenderManager.renderPrecedingLastClicked(
          editorManager.getLastClicked(),
        );
        editorManager.placeLC_shipsCtr();
        let lastClicked = editorManager.getLastClicked();
        editorManager.updateLastClicked(
          lastClicked.level,
          lastClicked.type,
          lastClicked.player,
        ); // if lastClicked is not null
        // no need to call the renderLastClicked fn() because lastClicked has already been removed from display as well as from state hence the operation was carried out and both are in sync!.
        RenderManager.renderShipsContainer(
          editorManager.getPlayerShipsToBePlaced(boardNum),
          boardNum,
        );
        RenderManager.renderBoardShips(
          editorManager.getBoardShips(boardNum),
          boardNum,
        );
      }
      break;
  }
}

function mainCtrMouseMoveHandler(e) {
  // simplest check is with is lastClicked null if so then terminate.

  if (editorManager.getLastClicked() === null) {
    return;
  }

  let eventTarget = e.target;
  let etClassName = eventTarget.classList.item(0);

  if (etClassName !== "cell" && editorManager.getLastHoveredCell()) {
    // if we were hovering over a cell before but now are not we will reset the two boards back to what they were .
    RenderManager.renderMenuBoards();
    editorManager.removeLastHoveredCell(); // because we are not hovering over a cell anymore
    return;
  } else if (etClassName !== "cell") {
    // this will occur when we have no lastHoveredCell and are also not hovering over a cell.
    // hence we dont have to reset anything and we also dont have to render the hovered cells.
    return;
  }

  // lastClicked is true and cell is the element that the user is hovering over.

  let col = +eventTarget.dataset.col;
  let row = +eventTarget.dataset.row;
  let playerNum = +eventTarget.parentElement.parentElement.dataset.player; // the board elements data set - > player.
  let isSameBoard = playerNum === editorManager.getLastClicked().player;

  if (!isSameBoard) {
    // we are on the wrong board hence we will do nothing;
    return;
  }
  // now we are on the same board.
  RenderManager.renderMenuBoards();

  let toBePlacedShipPos = editorManager.getLastClickedPos(col, row); // going to be an object with {start : (x,y) , end : (x,y) } representing cells on the board
  editorManager.updateLastHoveredCell(); // so now the last hovered thing is a cell and tbh more appropriate its a cell which entailed the "hovering effect"
  let isPosValid =
    editorManager.isShipPosValid(toBePlacedShipPos) &&
    !editorManager.isShipPosTaken(toBePlacedShipPos, playerNum);
  if (isPosValid) {
    RenderManager.renderHoveredShip(toBePlacedShipPos, "black", playerNum); // the second parameter represents the colour that should be represented in the hover effect
  } else {
    RenderManager.renderHoveredShip(toBePlacedShipPos, "red", playerNum);
  }
}

export { mainCtrClickHandler, mainCtrMouseMoveHandler };
