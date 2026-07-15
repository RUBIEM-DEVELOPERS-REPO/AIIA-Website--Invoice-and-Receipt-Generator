import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import session from "express-session";
import pg from "pg";
import connectPgSimple from "connect-pg-simple";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

const { Pool } = pg;

// ─── App setup ────────────────────────────────────────────────────────────────

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

const startTime = Date.now();
console.log("Starting server initialization...");

// ─── Database pool ─────────────────────────────────────────────────────────────

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 8000,
  idleTimeoutMillis: 30000,
  max: 20,
  // Reconnect automatically on idle connection errors
  allowExitOnIdle: false,
});

pool.on("error", (err) => {
  console.error("[DB] Unexpected pool error:", err.message);
});

// ─── DB connection with retry loop ────────────────────────────────────────────

async function connectWithRetry(
  maxAttempts = 10,
  baseDelayMs = 2000
): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const client = await pool.connect();
      await client.query("SELECT 1");
      client.release();
      console.log(
        `[DB] Connected successfully (attempt ${attempt}, ${Date.now() - startTime}ms)`
      );
      return;
    } catch (err: any) {
      const delay = Math.min(baseDelayMs * 2 ** (attempt - 1), 30_000);
      console.warn(
        `[DB] Connection attempt ${attempt}/${maxAttempts} failed: ${err.message}. Retrying in ${delay / 1000}s...`
      );
      if (attempt === maxAttempts) {
        throw new Error(
          `[DB] Could not connect after ${maxAttempts} attempts: ${err.message}`
        );
      }
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

// ─── Session store ─────────────────────────────────────────────────────────────

const PostgresStore = connectPgSimple(session);
const sessionStore = new PostgresStore({
  pool,
  createTableIfMissing: true,
  pruneSessionInterval: 60,
});

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || process.env.REPL_ID || "aiia-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      sameSite: "lax",
    },
    name: "aiia.sid",
  })
);

// ─── Request logging middleware ────────────────────────────────────────────────

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

  const reqStart = Date.now();
  const reqPath = req.path;
  let capturedJson: Record<string, any> | undefined;

  const originalJson = res.json.bind(res);
  res.json = function (body: any, ...args: any[]) {
    capturedJson = body;
    return originalJson(body, ...args);
  };

  res.on("finish", () => {
    if (reqPath.startsWith("/api")) {
      const duration = Date.now() - reqStart;
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJson && res.statusCode >= 400) {
        logLine += ` :: ${JSON.stringify(capturedJson)}`;
      }
      console.log(logLine);
    }
  });

  next();
});

// ─── Health check (always available, even before DB connects) ──────────────────

app.get("/health", async (_req, res) => {
  let dbOk = false;
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    dbOk = true;
  } catch {
    dbOk = false;
  }
  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? "ok" : "degraded",
    db: dbOk ? "connected" : "unavailable",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
  });
});

// ─── Static asset directories ──────────────────────────────────────────────────

const articleImagesDir = path.join(process.cwd(), "client", "src", "lib", "articleimages");
if (!fs.existsSync(articleImagesDir)) {
  fs.mkdirSync(articleImagesDir, { recursive: true });
  console.log("Article images directory created:", articleImagesDir);
} else {
  console.log("Article images directory verified:", articleImagesDir);
}
app.use("/lib/articleimages", express.static(articleImagesDir));

// ─── Global error handler ──────────────────────────────────────────────────────

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[Error]", err.message);
  if (err.stack) console.error(err.stack);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// ─── Port cleanup (cross-platform) ────────────────────────────────────────────

function freePort(port: number): void {
  try {
    if (process.platform === "win32") {
      const result = execSync(
        `netstat -ano | findstr :${port}`,
        { encoding: "utf8" }
      );
      const pids = [...new Set(
        result.trim().split("\n")
          .map((line) => line.trim().split(/\s+/).pop())
          .filter(Boolean)
      )];
      for (const pid of pids) {
        try {
          execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
          console.log(`[Port] Freed PID ${pid} on port ${port}`);
        } catch { /* might already be gone */ }
      }
    } else {
      const result = execSync(`lsof -i :${port} -t`, { encoding: "utf8" });
      result.trim().split("\n").forEach((pid) => {
        try { execSync(`kill -9 ${pid}`); } catch { /* ignore */ }
      });
    }
  } catch {
    // No process found on port — that's fine
  }
}

// ─── HTTP server startup with retry ───────────────────────────────────────────

function startListening(
  server: ReturnType<typeof import("http").createServer>,
  port: number,
  host: string,
  attempt = 1,
  maxAttempts = 5
): void {
  server.listen(port, host, () => {
    console.log(
      `[Server] Listening at http://${host}:${port} (${Date.now() - startTime}ms startup)`
    );
    console.log("[Server] Ready for connections");
  }).on("error", (err: any) => {
    if (err.code === "EADDRINUSE" && attempt < maxAttempts) {
      console.warn(`[Server] Port ${port} in use — attempt ${attempt}/${maxAttempts}. Freeing...`);
      freePort(port);
      setTimeout(() => startListening(server, port, host, attempt + 1, maxAttempts), 2000);
    } else {
      console.error(`[Server] Fatal: could not bind port ${port} after ${attempt} attempts`, err);
      process.exit(1);
    }
  });
}

// ─── Main startup ──────────────────────────────────────────────────────────────

(async () => {
  try {
    // Connect to DB with retry — server HTTP listener comes up AFTER successful connection
    await connectWithRetry(10, 2000);

    // Run migrations only after DB is confirmed up
    const { runMigrations } = await import("./migrationRunner");
    await runMigrations();

    // Register all routes (mounts sub-routers, static dirs, auth)
    const server = registerRoutes(app);

    // Serve frontend assets
    if (process.env.NODE_ENV === "production") {
      const distPath = path.join(process.cwd(), "dist", "public");
      console.log("[Server] Serving static files from:", distPath);
      app.use(express.static(distPath));
      app.get("*", (req, res, next) => {
        if (req.path.startsWith("/api")) return next();
        res.sendFile(path.join(distPath, "index.html"));
      });
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(app, server);
    }

    // Bind to port (with retry on EADDRINUSE)
    startListening(server, 5000, "0.0.0.0");

  } catch (error: any) {
    console.error("[Server] Fatal startup error:", error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
})();