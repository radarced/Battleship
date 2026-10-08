// basic size : 100x50 - > 150x50 - > 200x50 - > 250x50
function Ship(level, player, rotation = 0) {
  this.width = 50 + level * 50; // level starts from 1-5;
  this.height = 50; // constant .
  this.rotation = rotation; // value can be either 0 or 90
  this.level = level;
  this.player = player;
  this.img = new Image(this.width, this.height);
  this.img.src = `./assets/ship${level}.png`;
  // this will be used later in event handling
  this.img.dataset.level = level; // these both are for corresponding DOM to state in event handling.
  this.img.dataset.playerNum = player;
}

function BoardShip(level, player, start, end, ship = undefined, rotation = 0) {
  if (ship !== undefined) {
    this.ship = ship;
  } else {
    this.ship = new Ship(level, player, rotation); // assuming these guys will be passed
  }
  this.shipPos = new Position(start, end); // this represents the boardShip's position on the board
}

function Position(start, end) {
  this.start = start; // start and end themselves are objects which hold the following properties{x,y}
  this.end = end;
}

export { Ship, BoardShip, Position };
