import { WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";
import { joinQueue } from "./matchmaking/queue";

const clients = new Map();

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
      break;

    default:
      ws.send(JSON.stringify({
        type: "ERROR",
        message: "Unknown message type"
      }));
  }
}

