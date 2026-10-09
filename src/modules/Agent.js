// an agent here represents an entity in our game which can make game choices ; it can be both a computer
// or a player.
import { getBoardShipsPos, extractShipsPos } from "./BoardFuncs.js";
import { CapitilizeWord } from "./utils.js";
// agent_data = {agentType,boardShips,shipsLeft}
function Agent(agent_data) {
  this.type = agent_data.agentType;

  this.shipsPos = getBoardShipsPos(agent_data.boardShips, agent_data.shipsLeft);
  // ^^ this variable is used for passing renderingData to RenderManager purposes as well acts an intermediary funciton for populating the shipCellsArray
  this.shipCellsArray = extractShipsPos(this.shipsPos);
  this.N_OfShipCells = this.shipCellsArray.length;

  this.allHitCells = {
    hitWaterCells: [],
    hitShipCells: [],
  };
  this.N_Of_hitShipCells = 0; // important for win condition
}

// this function as of now is only called when the passed in hitCell is not already a cell hit in the agents state variables
Agent.prototype.hitCell = function (toHitCell) {
  // this function basically checks what type of cell are we hitting and then updates the hitCell containers
  // based upon what type of cell was hit .

  // checking whether or not the hitCell is a shipCell
  for (let shipCell of this.shipCellsArray) {
    if (shipCell.x === toHitCell.x && shipCell.y === toHitCell.y) {
      // its a shipCell!
      this.allHitCells.hitShipCells.push(toHitCell);
      //  i dont think its worth removing the already hit shipCells from shipCellsArray .
      this.N_Of_hitShipCells++;
      return;
    }
  }
  // by now it means that it was NOT a ship Cell hence its a water cell < - as of now these are the only categories .
  // ill have to create a deduceTypeFunction later on for this but for now this works.
  this.allHitCells.hitWaterCells.push(toHitCell);
};

// checks whether or not the cell given is hitCell of a particular type ("ship","water")
Agent.prototype.isHitCellType = function (type, cell) {
  type = CapitilizeWord(type); // so i dont have to write "Ship" instead of "ship"
  let hitCellCtrKey = "hit" + type + "Cells"; // this is the format that this.allHitCells will use.
  let hitCells = this.allHitCells[hitCellCtrKey];

  for (let hitCell of hitCells) {
    if (cell.x === hitCell.x && cell.y === hitCell.y) {
      return true;
    }
  }
  return false;
};

Agent.prototype.isHitCell = function (hitCell) {
  // loop through all containers of hitCells
  for (let distinctHitCells of Object.values(this.allHitCells)) {
    // a set or a map could def be better as O(1) search but im not sure if its worth to pre-optimize.
    for (let distinctHitCell of distinctHitCells) {
      if (distinctHitCell.x === hitCell.x && distinctHitCell.y === hitCell.y) {
        return true;
      }
    }
  }
  return false;
};

Agent.prototype.getAllHitCells = function () {
  let allCells = [];
  for (let hitCellsKey in this.allHitCells) {
    let distinctHitCells = this.allHitCells[hitCellsKey];
    allCells = allCells.concat(distinctHitCells);
  }
  return allCells;
};

Agent.prototype.AllShipsHit = function () {
  return this.N_Of_hitShipCells === this.N_OfShipCells;
};

export default Agent;
