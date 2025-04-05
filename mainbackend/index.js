import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import investmentRoutes from "./src/routes/investmentRoutes.js";
import stocksRoutes from "./src/routes/stocksRoutes.js";
import holdingRoutes from "./src/routes/holdingRoutes.js";
import sellingRoutes from "./src/routes/sellingRoutes.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import scenarioRoutes from "./src/routes/scenarioRoutes.js";
import bondsRoutes from "./src/routes/bondsRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/stocks", stocksRoutes);
app.use("/api/holdings", holdingRoutes);
app.use("/api/sellings", sellingRoutes);
app.use("/api/scenarios", scenarioRoutes);
app.use("/api/bonds", bondsRoutes);

//console.log("Google API Key:", process.env.GOOGLE_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Chat endpoint
app.post("/chat", async (req, res) => {
  const chatHistory = req.body.history || [];
  const msg = req.body.chat;

  try {
    const formattedHistory = chatHistory.map(entry => {
      const role = entry.role === "bot" ? "model" : entry.role;
      return {
        role: role,
        parts: [{ text: entry.text }]
      };
    });

    const chat = model.startChat({
      history: formattedHistory
    });

    const promptPrefix = "You are a financial assistant. Only answer finance-related queries. If the question is not related to finance, politely respond that you can only assist with finance topics.\n\n";
    const result = await chat.sendMessage(promptPrefix + msg);
    const response = await result.response;
    const text = response.text();

    res.send({ text });
  } catch (error) {
    console.error("Error during chat:", error);
    res.status(500).send({ error: "Error generating response" });
  }
});

// Stream endpoint
app.post("/stream", async (req, res) => {
  const chatHistory = req.body.history || [];
  const msg = req.body.chat;

  try {
    const formattedHistory = chatHistory.map(entry => {
      const role = entry.role === "bot" ? "model" : entry.role;
      return {
        role: role,
        parts: [{ text: entry.text }]
      };
    });

    const chat = model.startChat({
      history: formattedHistory
    });

    const promptPrefix = "You are a financial assistant. Only answer finance-related queries and If the question is not related to finance, politely respond that you can only assist with finance topics.\n\n";
    const result = await chat.sendMessageStream(promptPrefix + msg);

    for await (const chunk of result.stream) {
      res.write(chunk.text());
    }

    res.end();
  } catch (error) {
    console.error("Error during streaming:", error);
    res.status(500).send({ error: "Error streaming response" });
  }
});

app.get("/", (req, res) => {
  res.send("GenAI Financial Assistant Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
