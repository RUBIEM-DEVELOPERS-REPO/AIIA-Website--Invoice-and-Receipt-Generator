import { db } from '../../db';
import { articles } from '../../db/schema';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ARTICLE_ITEMS } from '../../client/src/lib/constants';

// Get current file's directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample article content for each entry
const DEFAULT_CONTENT = `
# Article Content

This is a sample article content that has been migrated from the constants file.
The original article can be accessed via the URL specified in the constants.

## Content Structure

This is a placeholder for the full article content which will be imported from external sources.
Admins can edit this content through the admin interface to add the complete article text.

The article was originally published externally and is now part of the AI Institute's database.
`;

async function migrateArticles() {
  console.log('Starting migration of regular articles to database...');
  
  try {
    // Check if the articles table exists
    try {
      // Try to query the articles table to check if it exists
      const existingArticles = await db.select().from(articles);
      const count = existingArticles.length;
      console.log(`Found ${count} existing articles`);
      
      if (count > 0) {
        console.log('Articles already migrated. Skipping...');
        return;
      }
    } catch (error) {
      // If the table doesn't exist, create it using a direct SQL query
      console.log('Articles table does not exist. Creating it...');
      await db.execute(`
        CREATE TABLE IF NOT EXISTS "articles" (
          "id" SERIAL PRIMARY KEY,
          "title" TEXT NOT NULL,
          "author" TEXT NOT NULL,
          "content" TEXT NOT NULL,
          "image_url" TEXT,
          "requirement" TEXT DEFAULT 'Free' NOT NULL,
          "created_at" TIMESTAMP DEFAULT now() NOT NULL,
          "updated_at" TIMESTAMP DEFAULT now() NOT NULL
        );
      `);
      console.log('Articles table created successfully!');
    }
    
    // Import articles from constants
    console.log('Importing articles from constants...');
    for (const article of ARTICLE_ITEMS) {
      // Extract author from excerpt (which contains "Dr Dennis Magaya" or similar)
      const author = article.excerpt ? article.excerpt.trim() : 'Dr Dennis Magaya';
      
      await db.insert(articles).values({
        title: article.title,
        author: author,
        content: `${DEFAULT_CONTENT}\n\nOriginal URL: ${article.url || 'Not provided'}`,
        imageUrl: article.image,
        requirement: 'Free' // Default to free access
      });
      console.log(`Inserted article: ${article.title}`);
    }
    
    console.log('Articles migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateArticles();