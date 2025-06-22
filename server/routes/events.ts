import { Router } from "express";
import { db } from "@db";
import { events } from "@db/schema";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/events", async (_req, res) => {
  try {
    const eventsList = await db.query.events.findMany({
      orderBy: desc(events.date)
    });
    res.json(eventsList);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

export default router;
