import { db } from "./db";

export async function getOrCreateUser(username) {
    const [rows] = await db.query(
        "SELECT id FROM users WHERE username=?",
        [username]
    );

    if(rows.length) return rows[0].id;

    const [result] = await db.query(
        "INSERT INTO users (username) VALUES (?)",
        [username]
    );

    await db.query(
        "INSERT INTO leadboard (user_id, wins) VALUES (?, 0)",
        [result.insertId]
    );

    return result.insertId;
}

export async function saveGame({
  gameId,
  p1,
  p2,
  winner,
  result,
  duration
}) {
  await db.query(
    `INSERT INTO games
     (id, player1_id, player2_id, winner_id, result, duration)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [gameId, p1, p2, winner, result, duration]
  );
}

export async function incrementWin(userId) {
  await db.query(
    "UPDATE leaderboard SET wins = wins + 1 WHERE user_id = ?",
    [userId]
  );
}

export async function getLeaderboard() {
  const [rows] = await db.query(`
    SELECT u.username, l.wins
    FROM leaderboard l
    JOIN users u ON u.id = l.user_id
    ORDER BY l.wins DESC
    LIMIT 10
  `);

  return rows;
}
