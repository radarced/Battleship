import Ship from "../modules/Ship.js";
// this object will also be a singleton (even though technically its purpose doesnt last throughout the entire program )
// this object will handle all of the logic and data related to the editor menu.
// this object will NOT do any populating or rendering but will manipulate state
// which will be then passed later to renderManager.

const PLAYER_1_NUM = 1;
const PLAYER_2_NUM = 2; // dont really see any other place to put these guys atm

function Position(start, end) {
  this.start = start; // start and end themselves are objects which hold the following properties{x,y}
  this.end = end;
}
// superShips = Position + ship or in another words stateData + renderData .
let editorManager = (() => {
  // the space complexity is alot more as compared to the canvas but i dont think its worth it to adopt the canvas method
  // alongside typical DOM functionality cuz maintainability and context switch hell .

  let player1ShipsContainer = []; // this represents the ships that are in the container which contains the ships that are to be placed on the board .
  let player2ShipsContainer = [];
  let shipsOnMenuBoard1Ctr = []; // this array would hold shipPosition whose prototype will be the Position object and it basically holds the ships that have been placed on board1 or board2 correspondingly .
  let shipsOnMenuBoard2Ctr = [];

  let lastClicked = null; // this represents the last clicked ship on any of the elements ( menuBoards and shipContainers )

  function createShips() {
    for (let i = 1; i <= 5; i++) {
      let ship1 = new Ship(i, PLAYER_1_NUM);
      let ship2 = new Ship(i, PLAYER_2_NUM);

      player1ShipsContainer.push(ship1);
      player2ShipsContainer.push(ship2);
    }
  }

  function rotateShips(playerNum) {
    console.log(playerNum);
    let shipsCtr = getPlayerShips(playerNum);
    for (let i = 0; i < shipsCtr.length; i++) {
      let ship = shipsCtr[i];
      if (ship.rotation === 0) {
        ship.rotation += 90;
      } else {
        ship.rotation = 0;
      }
    }
  }

  function getPlayerShips(playerNum) {
    if (playerNum === PLAYER_1_NUM) {
      return player1ShipsContainer;
    } else if (playerNum === PLAYER_2_NUM) {
      return player2ShipsContainer;
    }
    // there are no other players as of now so accessing beyond that is not allowed.
    return undefined;
  }

  function getLastClicked() {
    return lastClicked;
  }

  function updateLastClicked() {}

  return { createShips, getPlayerShips, rotateShips };
})();

export default editorManager;
