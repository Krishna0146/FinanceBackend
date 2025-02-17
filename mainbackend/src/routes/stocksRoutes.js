import express, { Router } from "express";

import { getAllStocks,getStockById,getAllMutualFunds } from "../controllers/StockController.js";

const router = express.Router();

router.get("/getallstocks", getAllStocks);
router.get('/getstock/:stock_id', getStockById); 
router.get("/getallmfs",getAllMutualFunds);

export default router;