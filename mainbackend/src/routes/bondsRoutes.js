import express, { Router } from "express";
import { getBonds,addBondToPortfolio,getbonddata } from "../controllers/bondController.js";

const router = express.Router();

router.get("/", getBonds);
router.post("/bonddata", addBondToPortfolio);
router.get('/bonddata/:username',getbonddata);

export default router;