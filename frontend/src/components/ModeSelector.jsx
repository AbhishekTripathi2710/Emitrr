export default function ModeSelector({ onSelect }) {
  return (
    <div className="flex gap-4 mb-6">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => onSelect("PVP")}
      >
        Play with Player
      </button>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => onSelect("BOT")}
      >
        Play with Bot
      </button>
    </div>
  );
}
