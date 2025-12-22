import { WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";
import { joinQueue } from "./matchmaking/queue";
import { getGame, removeGame, makeMove } from "./game/gameManner.js";
import { botMove } from "./game/botEngine.js";
import { PLAYER_2 } from "./game/constants.js";


const clients = new Map();

function broadcast(game, message){
  Object.values(game.sockets).forEach(s => {
    ws?.send(JSON.stringify(message));
  });
}

export function initWebSocket(server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws"
  });

  wss.on("connection", (ws) => {
    const socketId = uuid();
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
      clients.delete(socketId);
    });
  });
}

function handleMessage(ws, socketId, msg) {
  switch (msg.type) {
    case "JOIN_QUEUE":
      joinQueue(msg.username, ws);
      break;

    case "DROP_DISC":
      handleDropDisc(ws, msg);
      break;

    default:
      ws.send(JSON.stringify({
        type: "ERROR",
        message: "Unknown message type"
      }));
  }
}


function handleDropDisc(ws, msg) {
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
