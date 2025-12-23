export default function Board({ board, onDrop }) {
  if (!board) return null;

  return (
    <div className="board-wrapper">
      <div className="board-surface">
        {board.map((row, r) => (
          <div key={r} className="board-row">
            {row.map((cell, c) => {
              const color =
                cell === 1 ? "disc-red" : cell === 2 ? "disc-teal" : "disc-empty";
              return (
                <button
                  key={c}
                  onClick={() => onDrop(c)}
                  className="slot"
                  aria-label={`Drop disc in column ${c + 1}`}
                >
                  <span className={`disc ${color}`} />
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
