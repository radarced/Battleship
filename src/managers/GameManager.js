// this object / system is incharge of everything related to the game
// meaning everything External and internal to the game will be handled inside
// here either by itself or its child objects .
// the state of the initial board will also be handled inside here .
import Agent from "../modules/Agent.js";
import { PLAYER_1_NUM, PLAYER_2_NUM } from "../modules/Enums.js";
import { BoardShip } from "../modules/Ship.js";

let GameManager = (() => {
  let inGame = false; // is a boolean which represents whether or not the game is running
  let currentTurn; // values : PLAYER_1_NUM , PLAYER_2_NUM
  let winner;
  let agent1;
  let agent2;

  function startGame(agentsData) {
    agent1 = new Agent(agentsData.agent1);
    agent2 = new Agent(agentsData.agent2);
  }

  function getAgent(agentNum) {
    if (agentNum === PLAYER_1_NUM) {
      return agent1;
    } else if (agentNum === PLAYER_2_NUM) {
      return agent2;
    }
    return undefined;
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
      console.log(shipPos);

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

  return { startGame, getCurrentTurn, getBoardShips };
})();

export default GameManager;
