import express from "express";
import { addInvestment, getInvestments } from "../controllers/investmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addInvestment);
router.get("/", authMiddleware, getInvestments);

export default router;
