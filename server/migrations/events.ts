import { db } from "@db";
import { events } from "@db/schema";
import path from "path";
import fs from "fs";

// Function to copy event images to articleimages directory
async function copyEventImages() {
  try {
    const sourceDir = path.join(process.cwd(), "client", "src", "lib", "event_images");
    const targetDir = path.join(process.cwd(), "client", "src", "lib", "articleimages");

    // Ensure target directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Check if source directory exists first
    if (fs.existsSync(sourceDir)) {
      const files = fs.readdirSync(sourceDir);
      
      for (const file of files) {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file);
        
        // Skip if file already exists in target dir
        if (!fs.existsSync(targetPath)) {
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`Copied ${file} to articleimages directory`);
        }
      }
    } else {
      console.log('Event images directory not found, skipping image copy');
    }
  } catch (error) {
    console.error('Error copying event images:', error);
  }
}

// Function to migrate events from constants.ts to database
async function migrateEvents() {
  try {
    console.log('Starting events migration...');
    
    // Copy event images first
    await copyEventImages();

    // Check if table exists by querying information_schema
    const tableExists = await db.execute(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'events'
      );
    `);
    
    if (tableExists.rows[0]?.exists === true) {
      // Check if we already have events
      const eventCount = await db.execute(`
        SELECT COUNT(*) FROM events;
      `);
      
      // Type-safe way to handle the count result
      const count = eventCount.rows[0]?.count;
      if (typeof count === 'string') {
        const countNum = parseInt(count);
        if (countNum > 0) {
          console.log(`Found ${countNum} existing events, skipping migration`);
          return;
        }
      } else if (typeof count === 'number' && count > 0) {
        console.log(`Found ${count} existing events, skipping migration`);
        return;
      }
    }

    // First create the table directly with SQL to ensure it exists before insertion
    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS "events" (
          "id" SERIAL PRIMARY KEY,
          "title" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "date" TIMESTAMP NOT NULL,
          "location" TEXT NOT NULL,
          "type" TEXT NOT NULL CHECK ("type" IN ('Conference', 'Workshop', 'Webinar', 'Meetup', 'Other')),
          "capacity" INTEGER,
          "registration_required" BOOLEAN DEFAULT false,
          "registration_url" TEXT,
          "image_url" TEXT,
          "organizer" TEXT NOT NULL,
          "status" TEXT NOT NULL CHECK ("status" IN ('Upcoming', 'Ongoing', 'Completed', 'Cancelled')) DEFAULT 'Upcoming',
          "created_at" TIMESTAMP DEFAULT now() NOT NULL,
          "updated_at" TIMESTAMP DEFAULT now() NOT NULL
        );
      `);
      console.log("Events table created successfully");
      
      // Now insert the event data
      const insertResult = await db.execute(`
        INSERT INTO "events" (
          "title", "description", "date", "location", "type", 
          "capacity", "registration_required", "registration_url", 
          "image_url", "organizer", "status", "created_at", "updated_at"
        ) VALUES (
          'AI Conference Africa 2025', 
          'The AI Conference Africa 2025, taking place from April 14–17, 2025, at Elephant Hills Hotel, Victoria Falls, will bring together government leaders, academia, organizations, and industry captains to explore advancements in artificial intelligence. The event will feature panel discussions, keynote speeches, and workshops on AI trends, ethics, and policy, alongside networking sessions for collaboration. Attendees can also engage in hands-on AI workshops, startup showcases, and innovation exhibitions, highlighting AI solutions tailored for Africa. Additionally, discussions on AI governance and regulation will shape the future of responsible AI adoption across the continent.',
          '2025-04-14T09:00:00',
          'Elephant Hills Victoria Falls',
          'Conference',
          500,
          true,
          'https://example.com/register',
          '/src/lib/articleimages/AI events.jpg',
          'AI Institute of Africa',
          'Upcoming',
          now(),
          now()
        ) RETURNING "id";
      `);
      
      console.log("Event inserted with ID:", insertResult.rows[0]?.id);
    } catch (error) {
      console.error("Error creating events table or inserting data:", error);
      throw error;
    }
    
    console.log("Migrated event to database");
    
  } catch (error) {
    console.error('Error migrating events:', error);
  }
}

export { migrateEvents };
export default migrateEvents;