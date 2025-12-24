import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "analytics-service",
  brokers: ["localhost:9092"]
});

const consumer = kafka.consumer({ groupId: "game-analytics-group" });

const metrics = {
  totalGames: 0,
  totalDuration: 0,
  winsByPlayer: new Map(),
  gamesByHour: new Map()
};

function recordGame(event) {
  metrics.totalGames += 1;
  metrics.totalDuration += event.duration ?? 0;

  const winner = event.winner;
  if (winner) {
    metrics.winsByPlayer.set(
      winner,
      (metrics.winsByPlayer.get(winner) ?? 0) + 1
    );
  }

  const time = event.timestamp ? new Date(event.timestamp) : new Date();
  const key = `${time.getUTCFullYear()}-${time.getUTCMonth() + 1}-${time.getUTCDate()} ${time.getUTCHours()}:00`;
  metrics.gamesByHour.set(key, (metrics.gamesByHour.get(key) ?? 0) + 1);
}

function logSnapshot() {
  const avgDuration =
    metrics.totalGames === 0
      ? 0
      : metrics.totalDuration / metrics.totalGames;

  const topWinners = [...metrics.winsByPlayer.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  console.log("Game Analytics Snapshot ");
  console.log("Total games:", metrics.totalGames);
  console.log("Average duration (s):", avgDuration.toFixed(2));
  console.log("Top winners:", topWinners);
  console.log("Games per hour:", Object.fromEntries(metrics.gamesByHour));
}

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: "game-analytics", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const payload = JSON.parse(message.value.toString());
        if (payload.event === "GAME_COMPLETED") {
          recordGame(payload);
          logSnapshot();
        }
      } catch (err) {
        console.error("Failed to process analytics message", err);
      }
    }
  });
}

run().catch((err) => {
  console.error("Analytics consumer failed", err);
  process.exit(1);
});

export {};


