// an agent here represents an entity in our game which can make game choices ; it can be both a computer
// or a player.
import {
  getBoardShipsPos,
  extractShipsPos,
  getShipParts,
} from "./BoardFuncs.js";
import { CapitilizeWord, cosDegrees, sinDegrees } from "./utils.js";

import { RANDOM_DEDUCTION, SHIP_DRIVEN_DEDUCTION } from "./Enums.js";

// agent_data = {agentType,boardShips,shipsLeft}
function Agent(agent_data) {
  this.type = agent_data.agentType;

  this.shipsPos = getBoardShipsPos(agent_data.boardShips, agent_data.shipsLeft);
  // ^^ this variable is used for passing renderingData to RenderManager purposes as well acts an intermediary funciton for populating the shipCellsArray
  this.shipCellsArray = extractShipsPos(this.shipsPos);
  this.N_OfShipCells = this.shipCellsArray.length;

  // this does not track state for the sake of the game functionalities OTHER than the ai and other purposes if they ever do exist ; important point is that this is just another representation of the ships not a core state variable of Agent
  this.shipsParts = getShipParts(this.shipsPos); // shipsPart is an array / object ( i havent decided yet ) which basically represent the hitShips on the board in a representation which preserves alot of information relative to the ai algorithm.

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

      // shipsParts related state tracking
      let shipPart = this.getCorrespondingShip(toHitCell);

      let partIndex = this.getCorrespondingPartIndex(toHitCell, shipPart);

      shipPart.parts.push({
        cell: { x: toHitCell.x, y: toHitCell.y },
        index: partIndex,
      });
      shipPart.amountOfParts++; // cuz a new part of that ship is hit / discovered
      console.log(this.shipsParts);
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

Agent.prototype.getPlausibleDeducingVar = function () {
  // check whether or not there is an exposed shipPart in shipsPart .
  for (let shipPart of this.shipsParts) {
    if (shipPart.amountOfParts !== shipPart.shipCells.length) {
      // if all parts of the ship have not been discovered
      if (shipPart.parts.length !== 0) {
        // if there are parts in the ship that can be used to derive the adjacent shipParts
        return SHIP_DRIVEN_DEDUCTION;
      }
    }
  }
  // if there are no shipParts that can be used to deduce a plausible toHitShipCell than we randomly derive for now no minesweeper algo.
  return RANDOM_DEDUCTION;
};

Agent.prototype.getCorrespondingPartIndex = function (cell, shipPart) {
  for (let i = 0; i < shipPart.shipCells.length; i++) {
    let shipCell = shipPart.shipCells[i];
    if (shipCell.x === cell.x && shipCell.y === cell.y) {
      return i;
    }
  }
};

// returns the shipPart which holds the cell inside its cells
Agent.prototype.getCorrespondingShip = function (cell) {
  for (let shipPart of this.shipsParts) {
    for (let shipCell of shipPart.shipCells) {
      if (shipCell.x === cell.x && shipCell.y === cell.y) {
        return shipPart;
      }
    }
  }
  return; // undefined meaning a ship on that particular cell doesnt exist
};

// returns in terms of this.shipsParts .
Agent.prototype.getPlausibleShip = function () {
  for (let shipPart of this.shipsParts) {
    if (shipPart.amountOfParts !== shipPart.shipCells.length) {
      // if all parts of the ship have not been discovered
      if (shipPart.parts.length !== 0) {
        // if there are parts in the ship that can be used to derive the adjacent shipParts
        return shipPart;
      }
    }
  }
  return;
};

Agent.prototype.getPlausibleShipHitCell = function () {
  let plausible_ShipPart = this.getPlausibleShip();

  let possiblePartIndexes = [0, 1, 2, 3, 4];
  for (let part of plausible_ShipPart.parts) {
    let possiblePartIndex = possiblePartIndexes.findIndex(
      (index) => index === part.index,
    );
    possiblePartIndexes.splice(possiblePartIndex, 1);
  }
  // there will atleast be 1 index inside possiblePartIndex
  let toHitPartIndex = possiblePartIndexes[0];
  let arbitraryPart = plausible_ShipPart.parts[0]; // any part would work here

  let startPos = {
    x:
      arbitraryPart.cell.x -
      cosDegrees(plausible_ShipPart.rotation) * arbitraryPart.index,
    y:
      arbitraryPart.cell.y -
      sinDegrees(plausible_ShipPart.rotation) * arbitraryPart.index,
  };

  let toHitCellCol =
    startPos.x + cosDegrees(plausible_ShipPart.rotation) * toHitPartIndex;
  let toHitCellRow =
    startPos.y + sinDegrees(plausible_ShipPart.rotation) * toHitPartIndex;
  let resultantCell = `${toHitCellCol}${toHitCellRow}`;

  console.log(startPos, possiblePartIndexes, plausible_ShipPart, resultantCell); // i hope this works?.
  return resultantCell;
};

export default Agent;
