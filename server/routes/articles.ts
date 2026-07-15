import { Router } from "express";
import { db } from "@db";
import { articles, localArticles } from "@db/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/api/articles", async (req, res) => {
  try {
    const allArticles = await db.select().from(articles)
      .orderBy(desc(articles.createdAt));
    res.json(allArticles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Failed to fetch articles" });
  }
});

router.get("/api/local-articles", async (req, res) => {
  try {
    const allLocalArticles = await db.select().from(localArticles)
      .orderBy(desc(localArticles.createdAt));
    res.json(allLocalArticles);
  } catch (error) {
    console.error("Error fetching local articles:", error);
    res.status(500).json({ message: "Failed to fetch local articles" });
  }
});

router.get("/api/local-articles/:id", async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const article = await db.select().from(localArticles).where(eq(localArticles.id, articleId)).limit(1);
    
    if (article.length === 0) {
      return res.status(404).json({ message: "Local article not found" });
    }
    
    res.json(article[0]);
  } catch (error) {
    console.error("Error fetching local article:", error);
    res.status(500).json({ message: "Failed to fetch local article" });
  }
});

export default router;
