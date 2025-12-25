import { useEffect, useState } from "react";
import { connect, send, getConnectionState, onConnectionStateChange, isConnected } from "./ws";
import UsernameForm from "./components/UsernameForm";
import Board from "./components/Board";
import Leaderboard from "./components/LeaderBoard";
import ModeSelector from "./components/ModeSelector";
import "./App.css";

export default function App() {
  const [username, setUsername] = useState(null);
  const [game, setGame] = useState(null);
  const [player, setPlayer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [mode, setMode] = useState(null);
  const [status, setStatus] = useState("");
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    connect((msg) => {
      if (msg.type === "GAME_START") {
        if (msg.payload.opponent === "BOT" && mode === "PVP") {
          setStatus("No player found. Playing against bot.");
        } else {
          setStatus("");
        }

        setGame({
          id: msg.payload.gameId,
          board: Array.from({ length: 6 }, () => Array(7).fill(0)),
          opponent: msg.payload.opponent
        });
        setPlayer(msg.payload.player);
      }

      if (msg.type === "GAME_UPDATE") {
        setGame(g => ({ ...g, board: msg.payload.board }));
      }

      if (msg.type === "GAME_OVER") {
        setGameOver(true);
        alert(msg.payload.type || "Game Over");
      }
    });

    setWsConnected(isConnected());
    const unsubscribe = onConnectionStateChange((state) => {
      setWsConnected(state === "connected");
      if (state === "connected") {
        setStatus("");
      } else if (state === "connecting") {
        setStatus("Connecting to server...");
      } else if (state === "error") {
        setStatus("Connection error. Retrying...");
      }
    });

    return unsubscribe;
  }, []);

  function startGame(username, selectedMode) {
    if (!wsConnected) {
      setStatus("Waiting for connection...");
      return;
    }

    setUsername(username);
    setMode(selectedMode);

    if (selectedMode === "PVP") {
      setStatus("Searching for another player...");
    }

    send({
      type: "JOIN_QUEUE",
      username,
      mode: selectedMode
    });
  }


  function drop(col) {
    if (gameOver) return;
    send({
      type: "DROP_DISC",
      gameId: game.id,
      column: col,
      player
    });
  }

  const playerLabel = username || "You";
  const opponentLabel =
    game?.opponent === "BOT" ? "Bot" : game?.opponent || "Opponent";
  const playerColor = player === 1 ? "Coral" : player === 2 ? "Teal" : "Player";

  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand">
          <span className="brand-dot" />
          <span>Connect Four</span>
        </div>
        {game && (
          <div className="player-stack">
            <div className="player-chip">
              <span className="chip-dot coral" />
              <div className="chip-text">
                <span className="chip-label">You</span>
                <span className="chip-name">{playerLabel}</span>
                <span className="chip-meta">{playerColor}</span>
              </div>
            </div>
            <div className="player-chip">
              <span className="chip-dot teal" />
              <div className="chip-text">
                <span className="chip-label">Opponent</span>
                <span className="chip-name">{opponentLabel}</span>
                <span className="chip-meta">Teal/Coral</span>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="content-grid">
        <div className="board-card">
          {game ? (
            <Board board={game.board} onDrop={drop} />
          ) : (
            <div className="board-placeholder">
              Choose a mode and enter a username to start.
            </div>
          )}
        </div>

        <div className="side-stack">
          <div className="control-card">
            <div>
              <p className="eyebrow">Start a match</p>
              <h2 className="section-title">Game setup</h2>
            </div>
            {!wsConnected && (
              <div className="status-chip connecting">
                Connecting to server...
              </div>
            )}
            {!mode && wsConnected && <ModeSelector onSelect={setMode} />}
            {mode && !username && wsConnected && (
              <UsernameForm onSubmit={(u) => startGame(u, mode)} />
            )}
            {status && wsConnected && <div className="status-chip">{status}</div>}
          </div>

          <Leaderboard />
        </div>
      </div>
    </div>
  );
}
