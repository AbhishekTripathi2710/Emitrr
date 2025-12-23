export default function Board({ board, onDrop }) {
  if (!board) return null;

  return (
    <div className="space-y-1">
      {board.map((row, r) => (
        <div key={r} className="flex gap-1">
          {row.map((cell, c) => (
            <div
              key={c}
              onClick={() => onDrop(c)}
              className={`
                w-12 h-12 flex items-center justify-center
                border rounded cursor-pointer
                ${cell === 1 ? "bg-red-500" : ""}
                ${cell === 2 ? "bg-yellow-400" : ""}
              `}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
