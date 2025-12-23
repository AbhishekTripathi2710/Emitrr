import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/leaderboard")
      .then((res) => res.json())
      .then(setData);
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
