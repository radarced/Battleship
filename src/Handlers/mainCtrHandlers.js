import editorManager from "../managers/editorManager.js";
import RenderManager from "../managers/RenderManager.js";

function mainCtrClickHandler(e) {
  let eventTarget = e.target;
  let etClassName = eventTarget.classList.item(0); // like Array.at() just a safeguard

  switch (etClassName) {
    case "rotate":
      // rotate the ships inside the shipsContainer of the corresponding player inside the editorManager.
      let playerNum = +eventTarget.dataset.board; // this represents the answer of which player's ships are to be rotated .
      editorManager.rotateShips(playerNum);
      RenderManager.renderShipsContainer(
        editorManager.getPlayerShips(playerNum),
        playerNum,
      );
      break;
  }
}

export { mainCtrClickHandler };
