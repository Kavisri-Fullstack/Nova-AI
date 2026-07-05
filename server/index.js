import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import connectDB from "./config/db.js";
import dns from "dns";
import authRoutes from "./routes/auth.js";
import Chat from "./models/Chat.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// 🧠 AI Chat Route
app.post("/chat", async (req, res) => {
  try {
    const { userId, message, newChat } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 1. AI call
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiReply = response.data.choices[0].message.content;

    // 2. SAVE to MongoDB
    // Find latest conversation
    
    let chat = null;
    if (!newChat) {
      chat = await Chat.findOne({
        userId
      }).sort({ updatedAt: -1 });
    }

    // If no conversation create one
    if (!chat) {

      chat = new Chat({
        userId,
        title:
          message.length > 30
            ? message.substring(0,30)
            : message,
        messages:[]
      });

    }

    // Push user message
    chat.messages.push({
      role:"user",
      content:message
    });

    // Push AI reply
    chat.messages.push({
      role:"assistant",
      content:aiReply
    });

    await chat.save();
    // 3. response send
    res.json({
      reply: aiReply
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ reply: "AI error occurred" });
  }
});

// 🚀 Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`AI Server running on port ${PORT}`);
});