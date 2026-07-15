import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { pageVisits } from "@db/schema";
import { setupAuth } from "./auth";
import path from "path";
import fs from "fs";

// Import modular routers
import newsRouter from "./routes/news";
import contactRouter from "./routes/contact";
import chatRouter from "./routes/chat";
import membershipRouter from "./routes/membership";
import visionRouter from "./routes/vision";
import adminRouter from "./routes/admin";
import applicationsRouter from "./routes/applications";
import summitRouter from "./routes/summit";
import paymentsRouter from "./routes/payments";
import diagRouter from "./routes/diag";
import analyticsRouter from "./routes/analytics";

// Ensure uploads and assets folders exist at server start
const uploadsDir = path.join(process.cwd(), "client", "src", "lib", "uploads");
const applicationDocsDir = path.join(process.cwd(), "uploads", "applications");
const paymentProofsDir = path.join(process.cwd(), "uploads", "payment-proofs");

function ensureDirExists(dirPath: string) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true, mode: 0o755 });
    }
  } catch (error) {
    console.error(`Error setting up directory ${dirPath}:`, error);
  }
}

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Initialize upload directories
  ensureDirExists(uploadsDir);
  ensureDirExists(applicationDocsDir);
  ensureDirExists(paymentProofsDir);

  // Setup authentication for regular users
  setupAuth(app);

  // Traffic tracking middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const skip =
      req.path.startsWith("/api/") ||
      req.path.startsWith("/src/") ||
      req.path.startsWith("/@") ||
      req.path.startsWith("/node_modules/") ||
      req.path.startsWith("/uploads/") ||
      req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|map|webp|ts|tsx|json|mjs)$/i);
    if (!skip) {
      const ip =
        (req.headers["x-forwarded-for"] as string || "").split(",")[0].trim() ||
        req.socket.remoteAddress ||
        "unknown";
      const pathStr = req.path || "/";
      db.insert(pageVisits).values({
        path: pathStr,
        ip,
        userAgent: req.headers["user-agent"] || null,
        referer: req.headers["referer"] || null,
      }).catch(() => {});
    }
    next();
  });

  // Serve uploads and documents statically
  app.use("/uploads/applications", express.static(applicationDocsDir));
  app.use("/uploads/payment-proofs", express.static(paymentProofsDir));
  app.use("/docs", express.static(path.join(process.cwd(), "docs")));

  // Mount routers
  app.use(newsRouter);
  app.use(contactRouter);
  app.use(chatRouter);
  app.use(membershipRouter);
  app.use(visionRouter);
  app.use(adminRouter);
  app.use(applicationsRouter);
  app.use(summitRouter);
  app.use(paymentsRouter);
  app.use(diagRouter);
  app.use(analyticsRouter);

  return httpServer;
}
export { adminInvoiceTokenStore } from "./routes/summit";