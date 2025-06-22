
import { Router } from "express";
import OpenAI from "openai";

const router = Router();
const openai = new OpenAI();

router.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OpenAI API key not configured" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for the AI Institute Africa website. Provide concise, accurate information about our programs, courses, and initiatives. Keep responses friendly and professional."
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

export default router;
