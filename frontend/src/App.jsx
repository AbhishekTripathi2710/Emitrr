import { useEffect, useState } from "react";
import { connect, send } from "./ws";
import UsernameForm from "./components/UsernameForm";
import Board from "./components/Board";
import Leaderboard from "./components/LeaderBoard";
import ModeSelector from "./components/ModeSelector";

export default function App() {
  const [username, setUsername] = useState(null);
  const [game, setGame] = useState(null);
  const [player, setPlayer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [mode, setMode] = useState(null);
  const [status, setStatus] = useState("");


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
          board: Array.from({ length: 6 }, () => Array(7).fill(0))
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
  }, []);

  function startGame(username, selectedMode) {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {!mode && <ModeSelector onSelect={setMode} />}
      {mode && !username && <UsernameForm onSubmit={(u) => startGame(u, mode)} />}
      {status && <p className="mb-4">{status}</p>}
      {game && <Board board={game.board} onDrop={drop} />}
      <Leaderboard />
    </div>
  );
}
