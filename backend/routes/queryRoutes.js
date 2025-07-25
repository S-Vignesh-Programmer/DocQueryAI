import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { askQuestion } from "../controllers/queryController.js";

const router = express.Router();

router.post("/", authMiddleware, askQuestion);

export default router;

