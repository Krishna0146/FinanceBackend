import express, { Router } from "express";
import { getScenarios } from "../controllers/scenarioController.js";

const router = express.Router();

router.get("/:name/question/:index", getScenarios);

export default router;