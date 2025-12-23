import express from "express";
import http from "http";
import cors from "cors";
import { initWebSocket } from "./websocket.js";
import leaderboardRoutes from "./leaderboard/leaderboardService.js"

const app = express();
app.use(cors());
app.use(express.json());
app.use("/leaderboard", leaderboardRoutes);

const PORT = 3000;
app.get("/health",(_, res) => {
    res.json({status: "ok"});
})


const server = http.createServer(app);
initWebSocket(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})