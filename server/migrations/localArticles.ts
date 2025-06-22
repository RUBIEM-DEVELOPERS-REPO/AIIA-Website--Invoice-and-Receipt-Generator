import { db } from '../../db';
import { localArticles } from '../../db/schema';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// These are the articles we'll migrate from constants.ts to the database
const LOCAL_ARTICLES = [
  {
    title: "AI in Banking Cybersecurity – a Solution or Threat",
    author: "Dr Dennis Magaya",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
    content: fs.readFileSync(path.join(__dirname, '../../client/src/lib/article_content/article1.txt'), 'utf8'),
    requirement: "Membership",
  },
  {
    title: "Does AI Cause Jobs Losses in Banking",
    author: "Dr Dennis Magaya",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f",
    content: fs.readFileSync(path.join(__dirname, '../../client/src/lib/article_content/article2.txt'), 'utf8'),
    requirement: "Free",
  },
  {
    title: "Can AI Rescue Disrupted Banking Business Models?",
    author: "Dr Dennis Magaya",
    image: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107",
    content: fs.readFileSync(path.join(__dirname, '../../client/src/lib/article_content/article3.txt'), 'utf8'),
    requirement: "Free",
  },
  {
    title: "Beyond Digital Transformation Frontiers: AI Call Centre",
    author: "Dr Dennis Magaya",
    image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2",
    content: fs.readFileSync(path.join(__dirname, '../../client/src/lib/article_content/article4.txt'), 'utf8'),
    requirement: "Membership",
  },
  {
    title: "The AI-Digital Bank Business Model",
    author: "Dr Dennis Magaya",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3",
    content: fs.readFileSync(path.join(__dirname, '../../client/src/lib/article_content/article5.txt'), 'utf8'),
    requirement: "Membership",
  },
  {
    title: "The AI Digital Bank– Reimaging the Future ",
    author: "Dr Dennis Magaya",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    content: fs.readFileSync(path.join(__dirname, '../../client/src/lib/article_content/article6.txt'), 'utf8'),
    requirement: "Membership",
  },
  {
    title: "The Future AI-Digital Bank Operating Model",
    author: "Dr Dennis Magaya",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    content: fs.readFileSync(path.join(__dirname, '../../client/src/lib/article_content/article7.txt'), 'utf8'),
    requirement: "Membership",
  },
];

async function migrateLocalArticles() {
  console.log('Starting migration of local articles to database...');
  
  try {
    // Get count of existing articles
    const existingArticles = await db.select().from(localArticles);
    const count = existingArticles.length;
    console.log(`Found ${count} existing local articles`);
    
    if (count > 0) {
      console.log('Articles already migrated. Skipping...');
      return;
    }
    
    // Insert each article
    for (const article of LOCAL_ARTICLES) {
      await db.insert(localArticles).values({
        title: article.title,
        author: article.author,
        content: article.content,
        imageUrl: article.image,
        requirement: article.requirement as "Free" | "Membership"
      });
      console.log(`Inserted article: ${article.title}`);
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateLocalArticles();