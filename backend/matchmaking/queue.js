import { v4 as uuid } from "uuid";
import { createGame } from "../game/gameManner.js";

const queue = [];
const BOT_WAIT_TIME = 10_000;

export function joinQueue(username, ws, mode, socketId, onMatch) {
    if (mode === "BOT") {
    const game = createGame(username, "BOT", ws, null);
    onMatch?.(socketId, game.id, "p1");
    return;
  }

  if (queue.length > 0) {
    const opponent = queue.shift();
    clearTimeout(opponent.timer);

    const game = createGame(opponent.username, username, opponent.ws, ws);
    onMatch?.(opponent.socketId, game.id, "p1");
    onMatch?.(socketId, game.id, "p2");
    return game;
  }

  const timer = setTimeout(() => {
    const game = createGame(username, "BOT", ws, null);
    onMatch?.(socketId, game.id, "p1");
  }, BOT_WAIT_TIME);

  queue.push({ username, ws, timer, socketId });
}

function startBotGame(username, ws) {
  const index = queue.findIndex(p => p.username === username);
  if (index === -1) return;

  queue.splice(index, 1);
  createGame(username, "BOT", ws, null);
}

export function removeFromQueue(socketId) {
  const index = queue.findIndex(p => p.socketId === socketId);
  if (index === -1) return;

  clearTimeout(queue[index].timer);
  queue.splice(index, 1);
}
