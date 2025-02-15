import express from "express";
import { addPortfolio, getPortfolio, getPortfolioByName,updateEachHold,deleteHolding } from "../controllers/HoldingController.js";

const router = express.Router();

router.post("/portfolio", addPortfolio);
router.get("/portfolio/:username", getPortfolio);
router.get("/portfolio/:username/:name", getPortfolioByName); // New route to fetch by name
router.put("/update/:username/:id",updateEachHold);
router.delete("/delete/:username/:id", deleteHolding);

export default router;