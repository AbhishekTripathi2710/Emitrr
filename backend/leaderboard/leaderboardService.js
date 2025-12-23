import express from "express";
import { getLeaderboard } from "../db/schema.js";

const router = express.Router();

router.get("/" , async (_, res) => {
    const leadboard = await getLeaderboard();
    res.json(leadboard);
})

export default router;