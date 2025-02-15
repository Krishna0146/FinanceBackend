import express from "express";

import { getAllStocks,getStockById } from "../controllers/StockController.js";

const router = express.Router();

router.get("/getallstocks", getAllStocks);
router.get('/getstock/:stock_id', getStockById); 

export default router;