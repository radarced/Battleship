// this object / system is incharge of everything related to the game
// meaning everything External and internal to the game will be handled inside
// here either by itself or its child objects .
// the state of the initial board will also be handled inside here .
import Agent from "../modules/Agent.js";
import { getEmptyBoard, removeTakenShips } from "../modules/BoardFuncs.js";
import {
  PLAYER_1_NUM,
  PLAYER_2_NUM,
  RANDOM_DEDUCTION,
  SHIP_DRIVEN_DEDUCTION,
} from "../modules/Enums.js";
import { BoardShip } from "../modules/Ship.js";
import UiManager from "./UiManager.js";

let GameManager = (() => {
  let inGame = false; // is a boolean which represents whether or not the game is running
  let currentTurn; // values : PLAYER_1_NUM , PLAYER_2_NUM
  let winner;
  let agent1;
  let agent2;

  let isComputerShooting = false;

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
    if (isComputerShooting) {
      // theres a bug where while the setTimeout of the computer shoot dispatch function is running the player can shoot the cells .
      // even though this doesnt cause bugs or "state issues" its not intended so when a computer is shooting this variable will keep track of it and this way only the computer gets to shoot in its own turn.
      return;
    }

    // check whether or not the cellShot has already been hit
    let toShootAgent = getAgent(getOppositeAgent(currentTurn));
    let toHitCell = { x: col, y: row };
    if (toShootAgent.isHitCell(toHitCell)) {
      return;
    }

    // after these two checks we are certain that the cell the user is hitting rn is not HIT and is hitting his opponent not himself .
    // hence you shoot the agent ( Agent.hitCell )
    // if after shooting the cell agent has won N_hitShipCells === N_shipCells then we end game and return ;
    // if the cell that was hit is a ship then the currentTurn wouldnt change .
    toShootAgent.hitCell(toHitCell);

    if (toShootAgent.AllShipsHit()) {
      // the currentAgent won
      winner = getAgent(currentTurn).agentType + currentTurn;
      inGame = false;
      return;
    }

    if (!toShootAgent.isHitCellType("ship", toHitCell)) {
      // if the hitCell was not ship then we change turns.
      changeTurn();
    }
    // in both cases we will check whether or not the currentAgent is computer and set a turn if it is
    if (getAgent(currentTurn).type === "computer") {
      computerPlayTurn();
    }
  }

  function computerPlayTurn() {
    // get the most plausible square to hit access that square / cell in the DOM by UIManager and then dispatch the click event on it after a setTimeout()
    let toHitAgent = getAgent(getOppositeAgent(currentTurn));

    // deduce what is the variable according to which the algorithm should compute from
    // - a purely random cell on the board
    // - a cell derived from an exposed shipCell ( this condition is met when there is an exposed shipCell on that board )
    // - a minesweeper cell driven computation .
    // the highest precedence holder is variable no 2 then no 3 then no 1.
    let plausibleDeducingVariable = toHitAgent.getPlausibleDeducingVar();

    let functionsMap = {
      [SHIP_DRIVEN_DEDUCTION]: pickAdjacentShipCell,
      [RANDOM_DEDUCTION]: pickRandomCell,
    };

    let deductionFunction = functionsMap[plausibleDeducingVariable];
    let pickedCell = deductionFunction();

    let board_EL = UiManager.getMenuBoard(getOppositeAgent(currentTurn));
    let cellEL = UiManager.getCell(board_EL, +pickedCell[0], +pickedCell[1]);

    let clickEvent = new Event("click", { bubbles: true });
    isComputerShooting = true;
    setTimeout(() => {
      if (inGame) {
        isComputerShooting = false;
        cellEL.dispatchEvent(clickEvent);
        // right before the callback has been queued we set computerShooting to false
      } // if we are NOT in game then the click event will not be dispatched hence no "inaccessible memory would be accessed"
    }, 150);
  }

  function changeTurn() {
    currentTurn = getOppositeAgent(currentTurn);
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
    return agent.allHitCells;
  }

  // all computer thinking functions :
  function pickRandomCell() {
    let toHitAgent = getAgent(getOppositeAgent(currentTurn));
    let allHitCells = toHitAgent.getAllHitCells();
    let allPossibleCells = getEmptyBoard(); // a 2d board
    removeTakenShips(allPossibleCells, allHitCells);
    return getRandomCell(allPossibleCells); // is returned in the format `${col}${row}`.
  }

  function pickAdjacentShipCell() {
    let toHitAgent = getAgent(getOppositeAgent(currentTurn));
    return toHitAgent.getPlausibleShipHitCell();
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
