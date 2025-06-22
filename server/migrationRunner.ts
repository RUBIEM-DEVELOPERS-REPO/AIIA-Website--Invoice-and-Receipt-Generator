import { db } from "@db";
import { sql } from "drizzle-orm";
import { migrateEvents } from "./migrations/events";

export async function runMigrations() {
  try {
    console.log("Running database migrations...");
    
    // Check database connection
    await db.execute(sql`SELECT 1`);
    
    // Run events migration
    await migrateEvents();
    
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Migration error:", error);
  }
}