import express from "express";
import { addSellPortfolio } from "../controllers/SellingController.js";

const router = express.Router();

router.post("/sell", addSellPortfolio);

export default router;