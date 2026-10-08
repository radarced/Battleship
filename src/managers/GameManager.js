// this object / system is incharge of everything related to the game
// meaning everything External and internal to the game will be handled inside
// here either by itself or its child objects .
// the state of the initial board will also be handled inside here .
import Agent from "../modules/Agent.js";
import { getEmptyBoard, removeTakenShips } from "../modules/BoardFuncs.js";
import { PLAYER_1_NUM, PLAYER_2_NUM } from "../modules/Enums.js";
import { BoardShip } from "../modules/Ship.js";
import UiManager from "./UiManager.js";

let GameManager = (() => {
  let inGame = false; // is a boolean which represents whether or not the game is running
  let currentTurn; // values : PLAYER_1_NUM , PLAYER_2_NUM
  let winner;
  let agent1;
  let agent2;

  function startGame(agentsData) {
    inGame = true;
    agent1 = new Agent(agentsData.agent1);
    agent2 = new Agent(agentsData.agent2);
    currentTurn = Math.round(Math.random() * 1) + 1; // {1,2}
    let firstAgent = getAgent(currentTurn);

    if (firstAgent.type === "computer") {
      computerPlayTurn();
    }
  }

  function endGame() {
    inGame = false;
    agent1 = null;
    agent2 = null;
    winner = null;
    currentTurn = null;
  }

  // this function assumes we are in game.
  // agentNum represents the agent who's being shot at
  function shootCell(agentNum, col, row) {
    if (agentNum !== getOppositeAgent(currentTurn)) {
      return; // the current Turn agent can only shoot the opposite agent not itself...
    }

    let shotAgent = getAgent(getOppositeAgent(currentTurn));
    shotAgent.hitCells.push({ x: col, y: row });

    // if it was ship then we would not switch turns .
    currentTurn = getOppositeAgent(currentTurn);
    if (getAgent(currentTurn).type === "computer") {
      computerPlayTurn();
    }
  }

  function computerPlayTurn() {
    // get the most plausible square to hit access that square / cell in the DOM by UIManager and then dispatch the click event on it after a setTimeout()
    let toHitAgent = getAgent(getOppositeAgent(currentTurn));

    let allPossibleCells = getEmptyBoard(); // a 2d board
    removeTakenShips(allPossibleCells, toHitAgent.hitCells);

    let randomCell = getRandomCell(allPossibleCells); // is returned in the format `${col}${row}`.

    let board_EL = UiManager.getMenuBoard(getOppositeAgent(currentTurn));
    let cellEL = UiManager.getCell(board_EL, +randomCell[0], +randomCell[1]);

    let clickEvent = new Event("click", { bubbles: true });
    setTimeout(() => {
      if (inGame) {
        cellEL.dispatchEvent(clickEvent);
      } // if we are NOT in game then the click event will not be dispatched hence no "inaccessible memory would be accessed"
    }, 32);
  }

  function getAgent(agentNum) {
    if (agentNum === PLAYER_1_NUM) {
      return agent1;
    } else if (agentNum === PLAYER_2_NUM) {
      return agent2;
    }
    return undefined;
  }

  function getOppositeAgent(agent) {
    if (agent === PLAYER_1_NUM) {
      return PLAYER_2_NUM;
    } else if (agent === PLAYER_2_NUM) {
      return PLAYER_1_NUM;
    }
    return undefined;
  }

  // returns the hitCells of an agent grouped together in an object where eahc property represents distinct type of cells whom are hit
  function getAgentHitCells(agentNum) {
    let agent = getAgent(agentNum);
    return {
      waterCells: agent.hitCells,
    };
  }

  function getRandomCell(board) {
    let randomRow = board[Math.floor(Math.random() * board.length)];
    let randomCell = randomRow[Math.floor(Math.random() * randomRow.length)];
    return randomCell;
  }

  // this will be called once after startGame to render the ships behind the cells.
  // it basically returns the boardShips relative to the positions chosen in the agents .
  function getBoardShips(agentNum) {
    let agent = getAgent(agentNum);
    let boardShips = [];
    for (let shipPos of agent.shipsPos) {
      let increasingDecider = shipPos.end.x - shipPos.start.x;
      let level;
      let rotation;

      if (increasingDecider > 0) {
        // horizantal increase
        level = increasingDecider + 1;
        rotation = 0;
      } else {
        level = shipPos.end.y - shipPos.start.y + 1;
        rotation = 90;
      }
      if (
        shipPos.start.x === shipPos.end.x &&
        shipPos.start.y === shipPos.end.y
      ) {
        level = 1;
        rotation = 0;
      }

      boardShips.push(
        new BoardShip(
          level,
          agentNum,
          shipPos.start,
          shipPos.end,
          undefined,
          rotation,
        ),
      );
    }
    return boardShips;
  }

  function getCurrentTurn() {
    return currentTurn;
  }

  function isGameRunning() {
    return inGame;
  }

  return {
    startGame,
    endGame,
    getCurrentTurn,
    getBoardShips,
    isGameRunning,
    shootCell,
    getAgentHitCells,
  };
})();

export default GameManager;
