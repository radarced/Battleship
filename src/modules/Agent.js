// an agent here represents an entity in our game which can make game choices ; it can be both a computer
// or a player.
import { getBoardShipsPos, extractShipsPos } from "./BoardFuncs.js";
// agent_data = {agentType,boardShips,shipsLeft}
function Agent(agent_data) {
  this.type = agent_data.agentType;

  this.shipsPos = getBoardShipsPos(agent_data.boardShips, agent_data.shipsLeft);
  this.shipCellsArray = extractShipsPos(this.shipsPos);

  this.hitCells = []; // this should be broken down into water cells and ship cells
}

export default Agent;
