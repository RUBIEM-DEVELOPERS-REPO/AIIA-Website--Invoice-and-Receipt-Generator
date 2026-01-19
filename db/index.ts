import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "./schema";

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure pool with better error handling
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  maxUses: 10000,
  idleTimeoutMillis: 30000,
  max: 10,
});

// Add error handler to the pool - handle Neon connection drops gracefully
pool.on('error', (err: Error & { code?: string }) => {
  // Neon serverless databases may terminate idle connections
  // Code 57P01 = admin_shutdown (normal for serverless)
  if (err.code === '57P01') {
    console.log('Database connection closed by server (normal for serverless). Will reconnect on next query.');
    return;
  }
  console.error('Unexpected error on idle database client:', err.message);
  // Don't exit on connection errors - let the pool handle reconnection
});

// Export configured drizzle instance
export const db = drizzle({ client: pool, schema });

// Test connection
pool.connect()
  .then(client => {
    console.log('Database connection test successful');
    client.release();
  })
  .catch(err => {
    console.error('Database connection test failed:', err.message);
    process.exit(-1);
  });