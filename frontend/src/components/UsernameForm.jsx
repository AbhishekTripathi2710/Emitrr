import { useState } from "react";

export default function UsernameForm({ onSubmit }) {
  const [username, setUsername] = useState("");

  return (
    <div className="username-form">
      <input
        className="text-input"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button className="action-btn primary" onClick={() => onSubmit(username)}>
        Play
      </button>
    </div>
  );
}
