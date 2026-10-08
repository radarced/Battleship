const BOARD_SIZE = 10;
// takes in a set of cells and removes all those cells
// from the board + rows if a row is deleted.
function removeTakenShips(board, takenCells) {
  // takenCell = {x : N,y : N};
  for (let takenCell of takenCells) {
    let col = takenCell.x;
    let row = takenCell.y;
    // we could implement a binary search for searching for a particular cell inside the baord.Why?
    // as we cut off the cells from the board the indexes of the rows and columns become unreliable
    // to match takenCell -> cellOnBoard .
    // but the items of the board dont change and preserve their original dimensions .
    // hence the correspondence of takenCells and itemsOnBoard will remain even after cutoffs .
    // cuz of that its better to implement relative to search mechanisms to not deal with the offset headaches (im not sure if they will work fine in all cases).
    let boardRow;
    let boardCellIndex;

    let leftIndex = 0;
    let rightIndex = board.length;
    let middleIndex = Math.floor((leftIndex + rightIndex) / 2);

    let targetEl = board[middleIndex][0];
    console.log(targetEl);
    while (+targetEl[1] !== row) {
      //  ^^ this represents the cell's row on the baord
      console.log(targetEl, +targetEl[1], row);
      if (+targetEl[1] > row) {
        rightIndex = middleIndex;
      } else {
        leftIndex = middleIndex;
      }
      middleIndex = Math.floor((leftIndex + rightIndex) / 2);
      targetEl = board[middleIndex][0];
    }

    boardRow = board[middleIndex];
    // edge case : if theres only 1 item in the row .
    if (boardRow.length === 1) {
      boardRow.splice(0, 1); // only 1 possible element and that element is the targetCell or takenCell.
      board.splice(middleIndex, 1); // remove the row itself as well
    } else {
      for (let i = 0; i < boardRow.length; i++) {
        let cell = boardRow[i];
        if (+cell[0] === col) {
          boardCellIndex = i;
        }
      }
      boardRow.splice(boardCellIndex, 1);
    }
  }
}

// this function is an intermediary function to accomplish the algorithmic tasks related to placing ships on the baord.
// the board is represented as a 2d array where each item in the main array is a row and each row contains
// cells which represent disinct columns whose data are going be strings like '01' where first char represents the col and the second represents the row aka width,height
function getEmptyBoard() {
  let emptyBoard = [];
  emptyBoard.length = BOARD_SIZE;
  for (let i = 0; i < BOARD_SIZE; i++) {
    let row = [];
    row.length = BOARD_SIZE;
    for (let j = 0; j < BOARD_SIZE; j++) {
      row[j] = `${j}${i}`;
    }
    emptyBoard[i] = row;
  }
  return emptyBoard;
}

describe("Agent board mechanisms", () => {
  test("removeTakenShips", () => {
    let takenCells = [
      {
        x: 0,
        y: 1,
      },
      {
        x: 1,
        y: 1,
      },
    ];
    let allPos = getEmptyBoard();
    removeTakenShips(allPos, takenCells);
    expect(allPos).toBe(["very real test matching data"]);
  });
});
