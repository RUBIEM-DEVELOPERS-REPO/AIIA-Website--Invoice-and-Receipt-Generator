
import { Router } from "express";
import { db } from "../../db";
import { membershipCount } from "../../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/count", async (req, res) => {
  try {
    let count = await db.select().from(membershipCount).limit(1);
    if (!count.length) {
      await db.insert(membershipCount).values({ count: 180 });
      count = [{ count: 180 }];
    }
    res.json({ availableSpots: count[0].count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get membership count" });
  }
});

router.post("/increment", async (req, res) => {
  try {
    const count = await db.select().from(membershipCount).limit(1);
    if (count.length && count[0].count > 0) {
      await db
        .update(membershipCount)
        .set({ count: count[0].count - 1, updatedAt: new Date() })
        .where(eq(membershipCount.id, count[0].id));
    }
    res.json({ success: true });
  } catch (error) {

router.delete("/count/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(membershipCount).where(eq(membershipCount.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete membership count" });
  }
});

    console.error(error);
    res.status(500).json({ error: "Failed to update membership count" });
  }
});

export default router;
