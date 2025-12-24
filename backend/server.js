import express from "express";
import http from "http";
import cors from "cors";
import { initWebSocket } from "./websocket.js";
import leaderboardRoutes from "./leaderboard/leaderboardService.js"
import { initProducer } from "./analytics/producer.js";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use("/leaderboard", leaderboardRoutes);

if (process.env.KAFKA_BROKER) {
    try {
        await initProducer();
    } catch (err) {
        console.error("Failed to connect to Kafka. Analytics will be disabled.", err);
    }
}

const PORT = process.env.PORT || 3000;
app.get("/health",(_, res) => {
    res.json({status: "ok"});
})


const server = http.createServer(app);
initWebSocket(server);

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
})