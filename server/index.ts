import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./vite";
import session from "express-session";
import pg from "pg";
import connectPgSimple from "connect-pg-simple";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const { Pool } = pg;

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

// Initialize database pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 10,
});

// Add startup timing logs
const startTime = Date.now();
console.log("Starting server initialization...");

// Configure session store
const PostgresStore = connectPgSimple(session);
const sessionStore = new PostgresStore({
  pool,
  createTableIfMissing: true,
  pruneSessionInterval: 60
});

// Configure session middleware
app.use(
  session({
    store: sessionStore,
    secret: process.env.REPL_ID || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      // In deployment, we need to allow non-secure cookies since we might not have HTTPS
      secure: false, 
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      sameSite: 'lax'
    },
    name: 'aiia.sid' // Custom session cookie name
  })
);

// Debug middleware for content type
app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = function (...args) {
    console.log(`[${req.method}] ${req.path} - Content-Type:`, res.getHeader('content-type'));
    return oldSend.apply(res, args);
  };
  next();
});

// Add CORS headers for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      console.log(logLine);
    }
  });

  next();
});

// Serve static files from the articleimages directory
const articleImagesDir = path.join(process.cwd(), "client", "src", "lib", "articleimages");
if (!fs.existsSync(articleImagesDir)) {
  fs.mkdirSync(articleImagesDir, { recursive: true });
  console.log("Article images directory created:", articleImagesDir);
} else {
  console.log("Article images directory verified:", articleImagesDir);
}
app.use("/lib/articleimages", express.static(articleImagesDir));

// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

(async () => {
  try {
    // Test database connection before proceeding
    console.log("Testing database connection...");
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
    } finally {
      client.release();
    }
    console.log(`Database connection successful (${Date.now() - startTime}ms)`);

    // Run database migrations
    const { runMigrations } = await import('./migrationRunner');
    await runMigrations();

    const server = registerRoutes(app);

    // Error handling middleware with full stack traces
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error("Error in request handling:", err);
      console.error("Stack trace:", err.stack);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message, stack: err.stack });
    });

    // Configure static file serving with proper MIME types
    const staticConfig = {
      setHeaders: (res: Response, filePath: string) => {
        if (filePath.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
        } else if (filePath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
        }
      }
    };

    // Serve static files based on environment
    if (process.env.NODE_ENV === 'production') {
      const distPath = path.join(process.cwd(), 'dist', 'public');
      console.log('Serving static files from:', distPath);
      app.use(express.static(distPath, staticConfig));

      // SPA fallback - must be after API routes but before 404
      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) {
          next();
        } else {
          console.log('SPA fallback for:', req.path);
          res.sendFile(path.join(distPath, 'index.html'));
        }
      });
    } else {
      // In development, let Vite handle everything
      const { setupVite } = await import('./vite');
      await setupVite(app, server);
    }

    // Try to start the server with retries
    const HOST = "0.0.0.0";
    const PORT = 5000;
    const MAX_RETRIES = 3;
    let retryCount = 0;

    const killPortProcess = () => {
      try {
        console.log("Attempting to find processes on port 5000...");
        const result = execSync('lsof -i :5000 -t');
        const pids = result.toString().trim().split('\n');
        for (const pid of pids) {
          console.log(`Attempting to kill process ${pid}...`);
          execSync(`kill -9 ${pid}`);
          console.log(`Successfully killed process ${pid} on port ${PORT}`);
        }
        return true;
      } catch (error) {
        if (error instanceof Error) {
          console.log(`Error while killing port process: ${error.message}`);
          if (error.stack) {
            console.log(`Stack trace: ${error.stack}`);
          }
        }
        return false;
      }
    };

    const startServer = () => {
      if (retryCount > 0) {
        // Try to kill any existing process on the port
        killPortProcess();
        // Wait a bit for the port to be freed
        console.log(`Waiting for port ${PORT} to be available...`);
      }

      server.listen(PORT, HOST, () => {
        console.log(`Server running at http://${HOST}:${PORT} (${Date.now() - startTime}ms total startup time)`);
        console.log(`Application is ready for connections`);
      }).on('error', (error: any) => {
        console.error("Server error:", error);
        if (error.stack) {
          console.error("Stack trace:", error.stack);
        }

        if (error.code === 'EADDRINUSE' && retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(`Port ${PORT} in use, attempting retry ${retryCount} of ${MAX_RETRIES}...`);

          // Wait before retry
          setTimeout(startServer, 2000);
        } else {
          console.error(`Failed to start server after ${retryCount} retries:`, error);
          process.exit(1);
        }
      });
    };

    startServer();

  } catch (error) {
    console.error("Failed to start server:", error);
    if (error instanceof Error && error.stack) {
      console.error("Stack trace:", error.stack);
    }
    process.exit(1);
  }
})();