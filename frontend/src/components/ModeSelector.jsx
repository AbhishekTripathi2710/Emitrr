export default function ModeSelector({ onSelect }) {
  return (
    <div className="button-group">
      <button className="action-btn primary" onClick={() => onSelect("PVP")}>
        Play with Player
      </button>

      <button className="action-btn secondary" onClick={() => onSelect("BOT")}>
        Play with Bot
      </button>
    </div>
  );
}
