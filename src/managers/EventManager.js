import UiManager from "./UiManager.js";
import {
  mainCtrClickHandler,
  mainCtrMouseMoveHandler,
} from "../Handlers/mainCtrHandlers.js";

let EventManager = (() => {
  function attachInitialHandlers() {
    let domRefs = UiManager.getDomRefs();
    domRefs.mainCtr.addEventListener("click", mainCtrClickHandler);
    domRefs.mainCtr.addEventListener("mousemove", mainCtrMouseMoveHandler);
  }

  // using an intermediary class
  // this will somehow be run when the gameState switches from editorMenu - > gameMenu
  function attachGameMenuHandlers() {}

  return { attachInitialHandlers };
})();

export default EventManager;
