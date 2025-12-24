import { useEffect, useState } from "react";

const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    const protocol = window.location.protocol === "https:" ? "https:" : "http:";
    return `${protocol}//${apiUrl}`;
  }
  if (import.meta.env.DEV) {
    return "http://localhost:3000";
  }
  return window.location.origin;
};

export default function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const apiUrl = getApiUrl();
    fetch(`${apiUrl}/leaderboard`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Failed to fetch leaderboard:", err));
  }, []);

  return (
    <div className="card leaderboard-card">
      <div>
        <p className="eyebrow">Community</p>
        <h3 className="section-title">Leaderboard</h3>
      </div>
      <div className="leaderboard-list">
        {data.map((u, i) => (
          <div key={i} className="leaderboard-row">
            <span className="username">{u.username}</span>
            <span className="wins">{u.wins}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
