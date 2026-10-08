// enums are basically variables which act as aliases for values which
// are used in code for specific conditioning based upon those values .

// tldr ; theyre basically used to give an alias to magic numbers and make
// code with magic numbers descriptive .

const PLAYER_1_NUM = 1;
const PLAYER_2_NUM = 2; // dont really see any other place to put these guys atm
const SHIP_TO_BE_PLACED = 1;
const BOARD_SHIP = 2;
const BOARD_SIZE = 10;
const GAME_STATES = {
  EDITOR_MENU: 0,
  GAME_MENU: 1,
};

export {
  PLAYER_1_NUM,
  PLAYER_2_NUM,
  SHIP_TO_BE_PLACED,
  BOARD_SHIP,
  GAME_STATES,
  BOARD_SIZE,
};
