import { Router } from "express";
import { db } from "@db";
import { events } from "@db/schema";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/api/events", async (req, res) => {
  try {
    const allEvents = await db.select().from(events)
      .where(eq(events.status, "Upcoming"))
      .orderBy(asc(events.date));
    res.json(allEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

export default router;
