import GameManager from "../managers/GameManager.js";
import editorManager from "../managers/editorManager.js";
import RenderManager from "../managers/RenderManager.js";
import UiManager from "../managers/UiManager.js";
import { GAME_STATES, PLAYER_1_NUM, PLAYER_2_NUM } from "../modules/Enums.js";
import { addEditorMenuListeners } from "../modules/eventManagerDriver.js";

function gameCtrClickHandler(e) {
  let eventTarget = e.target;
  let etClassName = eventTarget.classList.item(0);

  switch (etClassName) {
    case "backToMenu":
      // reset states
      editorManager.resetUiState();
      GameManager.endGame();

      // switch gameState
      UiManager.switchGameState(GAME_STATES.EDITOR_MENU);
      // populate the DOM and add the eventListeners
      UiManager.populateEditorMenu();
      UiManager.InitialLoad(
        editorManager.getPlayerShipsToBePlaced(PLAYER_1_NUM),
        editorManager.getPlayerShipsToBePlaced(PLAYER_2_NUM),
      );
      addEditorMenuListeners();

      // render the old editorManager state ; we will only be rendering the old ships state not lastClicked lastHovered and stuff.
      RenderManager.renderBoardShips(
        editorManager.getBoardShips(PLAYER_1_NUM),
        PLAYER_1_NUM,
      );
      RenderManager.renderBoardShips(
        editorManager.getBoardShips(PLAYER_2_NUM),
        PLAYER_2_NUM,
      );
      RenderManager.renderCompOrPlayerBtns(
        editorManager.getChosenAgent(PLAYER_1_NUM),
        PLAYER_1_NUM,
      );
      RenderManager.renderCompOrPlayerBtns(
        editorManager.getChosenAgent(PLAYER_2_NUM),
        PLAYER_2_NUM,
      );
      break;
    case "playAgain":
      GameManager.startGame(editorManager.getAgentsData());

      RenderManager.renderBoardShips(
        GameManager.getBoardShips(PLAYER_1_NUM),
        PLAYER_1_NUM,
      );
      RenderManager.renderBoardShips(
        GameManager.getBoardShips(PLAYER_2_NUM),
        PLAYER_2_NUM,
      );
      const IN_GAME_MENU = true;

      RenderManager.renderMenuBoard(PLAYER_1_NUM, IN_GAME_MENU);
      RenderManager.renderMenuBoard(PLAYER_2_NUM, IN_GAME_MENU);
      break;
    case "cell":
      if (!GameManager.isGameRunning()) {
        return;
      }
      let agentNum = +eventTarget.parentElement.parentElement.dataset.board;
      let row = +eventTarget.dataset.row;
      let col = +eventTarget.dataset.col;

      let gameWon = GameManager.shootCell(agentNum, col, row);
      // Render the shootedCell's board.
      RenderManager.renderHitCells(
        GameManager.getAgentHitCells(agentNum),
        agentNum,
      );

      break;
  }
}

function gameCtrMouseMoveHandler(e) {}

export { gameCtrClickHandler, gameCtrMouseMoveHandler };
