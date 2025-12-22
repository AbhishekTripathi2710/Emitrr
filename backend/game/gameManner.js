import { v4 as uuid } from "uuid";
import { createBoard, dropDisc, isDraw, checkWin } from "./gameLogic.js";
import { PLAYER_1, PLAYER_2 } from "./constants.js";

const activeGames = new Map();

export function createGame(p1, p2, ws1, ws2) {
  const gameId = uuid();

  const game = {
    id: gameId,
    board: createBoard(),
    players: {
      p1,
      p2
    },
    sockets: {
      p1: ws1,
      p2: ws2
    },
    turn: PLAYER_1,
    status: "ACTIVE",
    createdAt: Date.now()
  };

  activeGames.set(gameId, game);

  ws1?.send(JSON.stringify({
    type: "GAME_START",
    payload: { gameId, player: PLAYER_1, opponent: p2 }
  }));

  ws2?.send(JSON.stringify({
    type: "GAME_START",
    payload: { gameId, player: PLAYER_2, opponent: p1 }
  }));

  return game;
}

export function getGame(gameId) {
  return activeGames.get(gameId);
}

export function removeGame(gameId) {
  activeGames.delete(gameId);
}

export function makeMove(game, player, column){
  if(game.status !== "ACTIVE") return null;
  if(game.turn !== player) return null;

  const row = dropDisc(game.board, column, player);
  if(row === -1) return null;

  if(checkWin(game.board, player)){
    game.status = "FINISHED";
    return{
      type: "WIN",
      winner: player,
      row,
      column
    };
  }

  if(isDraw(game.board)){
    game.status = "FINISHED";
    return{
      type: "DRAW"
    };
  }

  game.turn = player === PLAYER_1 ? PLAYER_2 : PLAYER_1;

  return {
    type: "MOVE",
    row,
    column
  };
}