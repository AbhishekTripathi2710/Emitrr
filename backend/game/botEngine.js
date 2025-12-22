import { dropDisc, checkWin } from "./gameLogic.js";
import { COLS, PLAYER_1, PLAYER_2, EMPTY } from "./constants.js";

export function botMove(game) {
  const board = game.board;

  for (let c = 0; c < COLS; c++) {
    const temp = clone(board);
    if (dropDisc(temp, c, PLAYER_2) !== -1 &&
        checkWin(temp, PLAYER_2)) {
      return c;
    }
  }

  for (let c = 0; c < COLS; c++) {
    const temp = clone(board);
    if (dropDisc(temp, c, PLAYER_1) !== -1 &&
        checkWin(temp, PLAYER_1)) {
      return c;
    }
  }

  if (dropDisc(clone(board), 3, PLAYER_2) !== -1) return 3;

  
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === EMPTY) return c;
  }

  return -1;
}

function clone(board) {
  return board.map(r => [...r]);
}
