const cors = require('cors');
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log('Server Listening on PORT:', PORT);
});

// Check if API Key is loaded
console.log("Google API Key:", process.env.GOOGLE_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Chat endpoint
app.post("/chat", async (req, res) => {
  const chatHistory = req.body.history || [];
  const msg = req.body.chat;

  try {
    // Ensure chat history is properly formatted
    const formattedHistory = chatHistory.map(entry => {
      // If the role is "bot", change it to "model"
      const role = entry.role === "bot" ? "model" : entry.role;
      return {
        role: role, // Use "user" or "model"
        parts: [{ text: entry.text }] // Wrap text inside `parts`
      };
    });

    const chat = model.startChat({
      history: formattedHistory, // Pass formatted history
    });

    const result = await chat.sendMessage(msg);
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
    // Ensure chat history is properly formatted
    const formattedHistory = chatHistory.map(entry => {
      // If the role is "bot", change it to "model"
      const role = entry.role === "bot" ? "model" : entry.role;
      return {
        role: role, 
        parts: [{ text: entry.text }]
      };
    });

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessageStream(msg);

    for await (const chunk of result.stream) {
      res.write(chunk.text());
    }

    res.end();
  } catch (error) {
    console.error("Error during streaming:", error);
    res.status(500).send({ error: "Error streaming response" });
  }
});
