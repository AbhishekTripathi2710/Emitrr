import { v4 as uuid } from "uuid";
import { createGame } from "../game/gameManner.js";

const queue = [];
const BOT_WAIT_TIME = 10_000;

export function joinQueue(username, ws, mode, socketId) {
    if (mode === "BOT") {
    createGame(username, "BOT", ws, null);
    return;
  }

  if (queue.length > 0) {
    const opponent = queue.shift();
    clearTimeout(opponent.timer);

    return createGame(opponent.username, username, opponent.ws, ws);
  }

  const timer = setTimeout(() => {
    createGame(username, "BOT", ws, null);
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
