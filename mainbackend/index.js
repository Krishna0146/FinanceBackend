import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import investmentRoutes from "./src/routes/investmentRoutes.js";
import stocksRoutes from "./src/routes/stocksRoutes.js";
import holdingRoutes from "./src/routes/holdingRoutes.js"
import sellingRoutes from "./src/routes/sellingRoutes.js"

dotenv.config();
connectDB(); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/stocks",stocksRoutes);
app.use("/api/holdings",holdingRoutes);
app.use("/api/sellings",sellingRoutes);

app.get("/", (req, res) => {
    res.send("GenAI Financial Assistant Backend is running!");
}); 

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});