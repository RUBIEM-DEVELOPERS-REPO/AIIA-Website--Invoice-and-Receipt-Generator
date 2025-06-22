import express from "express";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI();

// Fetch news from News API and enhance descriptions using OpenAI
router.get("/api/news", async (req, res) => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=artificial+intelligence+AND+(AI+OR+machine+learning+OR+neural+networks+OR+deep+learning)&sortBy=publishedAt&pageSize=12&language=en`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEWS_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }

    const data = await response.json();
    let articles = data.articles.filter((article: any) => {
      const text = `${article.title} ${article.description}`.toLowerCase();
      return text.includes('ai') || 
             text.includes('artificial intelligence') || 
             text.includes('machine learning') ||
             text.includes('deep learning');
    }).sort(() => Math.random() - 0.5);

    // Only attempt OpenAI enhancement if API key is available
    if (process.env.OPENAI_API_KEY) {
      try {
        articles = await Promise.all(
          articles.map(async (article: any) => {
            try {
              const completion = await openai.chat.completions.create({
                model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
                messages: [
                  {
                    role: "system",
                    content:
                      "You are an AI expert who analyzes news articles. Enhance the description to focus on AI implications, technological advancements, and potential impact. Keep the enhanced description under 200 characters while maintaining key AI-related insights.",
                  },
                  {
                    role: "user",
                    content: `Enhance this AI news article description: ${article.description}`,
                  },
                ],
              });

              return {
                ...article,
                description: completion.choices[0].message.content || article.description,
              };
            } catch (error) {
              console.error("OpenAI enhancement failed for article:", error);
              return article;
            }
          })
        );
      } catch (error) {
        console.error("OpenAI batch processing failed:", error);
        // Continue with unenhanced articles
      }
    }

    res.json(articles);
  } catch (error) {
    console.error("News API error:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

export default router;