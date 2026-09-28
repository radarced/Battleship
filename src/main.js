import UiManager from "./managers/UiManager.js";
import editorManager from "./managers/editorManager.js";
import EventManager from "./managers/EventManager.js";

const PLAYER_1_NUM = 1;
const PLAYER_2_NUM = 2; // dont really see any other place to put these guys atm

function main() {
  editorManager.createShips();
  UiManager.InitialLoad(
    editorManager.getPlayerShips(PLAYER_1_NUM),
    editorManager.getPlayerShips(PLAYER_2_NUM),
  );
  EventManager.attachInitialHandlers();
}

main();
