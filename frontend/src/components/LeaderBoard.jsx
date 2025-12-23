import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/leaderboard")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Leaderboard</h3>
      <div className="space-y-1">
        {data.map((u, i) => (
          <div key={i} className="flex justify-between w-64">
            <span>{u.username}</span>
            <span>{u.wins}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
