import { WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";

import { joinQueue } from "./matchmaking/queue.js";
import {
  getGame,
  removeGame,
  makeMove,
  handleDisconnect,
  handleReconnect
} from "./game/gameManner.js";
import { botMove } from "./game/botEngine.js";
import { PLAYER_2 } from "./game/constants.js";

const clients = new Map();          
const socketToGame = new Map();     

export function initWebSocket(server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws"
  });

  wss.on("connection", (ws) => {
    const socketId = uuid();
    ws.socketId = socketId;

    clients.set(socketId, ws);

    ws.send(JSON.stringify({
      type: "CONNECTED",
      payload: { socketId }
    }));

    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());
        handleMessage(ws, socketId, msg);
      } catch {
        ws.send(JSON.stringify({
          type: "ERROR",
          message: "Invalid JSON"
        }));
      }
    });

    ws.on("close", () => {
      const meta = socketToGame.get(socketId);
      if (!meta) return;

      const { gameId, playerKey } = meta;
      const game = getGame(gameId);
      if (!game) return;

      handleDisconnect(game, playerKey);
    });
  });
}


function handleMessage(ws, socketId, msg) {
  switch (msg.type) {

    case "JOIN_QUEUE":
      joinQueue(msg.username, ws);
      break;

    case "DROP_DISC":
      handleDropDisc(msg);
      break;

    case "RECONNECT":
      handleReconnectMessage(ws, socketId, msg);
      break;

    default:
      ws.send(JSON.stringify({
        type: "ERROR",
        message: "Unknown message type"
      }));
  }
}


function handleDropDisc(msg) {
  const { gameId, column, player } = msg;

  const game = getGame(gameId);
  if (!game) return;

  const result = makeMove(game, player, column);
  if (!result) return;

  broadcast(game, {
    type: "GAME_UPDATE",
    payload: {
      board: game.board,
      lastMove: result
    }
  });

  if (result.type === "WIN" || result.type === "DRAW") {
    broadcast(game, {
      type: "GAME_OVER",
      payload: result
    });
    removeGame(gameId);
    return;
  }

  if (game.players.p2 === "BOT" && game.turn === PLAYER_2) {
    const botColumn = botMove(game);
    const botResult = makeMove(game, PLAYER_2, botColumn);

    broadcast(game, {
      type: "GAME_UPDATE",
      payload: {
        board: game.board,
        lastMove: botResult
      }
    });

    if (botResult.type === "WIN" || botResult.type === "DRAW") {
      broadcast(game, {
        type: "GAME_OVER",
        payload: botResult
      });
      removeGame(gameId);
    }
  }
}


function handleReconnectMessage(ws, socketId, msg) {
  const { gameId, username } = msg;

  const game = getGame(gameId);
  if (!game) return;

  const playerKey =
    game.players.p1 === username ? "p1" :
    game.players.p2 === username ? "p2" :
    null;

  if (!playerKey) return;

  socketToGame.set(socketId, { gameId, playerKey });
  handleReconnect(game, playerKey, ws);
}


function broadcast(game, message) {
  Object.values(game.sockets).forEach(ws => {
    ws?.send(JSON.stringify(message));
  });
}
