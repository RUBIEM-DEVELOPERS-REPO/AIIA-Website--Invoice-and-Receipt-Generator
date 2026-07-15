import { Router } from "express";

const router = Router();

router.get("/api/diag-env", (req, res) => {
  res.json({
    SENDPULSE_API_KEY: process.env.SENDPULSE_API_KEY ? "Configured (length: " + process.env.SENDPULSE_API_KEY.length + ")" : "Not set",
    SENDPULSE_CLIENT_ID: process.env.SENDPULSE_CLIENT_ID ? "Configured" : "Not set",
    SENDPULSE_CLIENT_SECRET: process.env.SENDPULSE_CLIENT_SECRET ? "Configured" : "Not set",
    SMTP_HOST: process.env.SMTP_HOST || "Not set",
    SMTP_PORT: process.env.SMTP_PORT || "Not set",
    SMTP_SECURE: process.env.SMTP_SECURE || "Not set",
    SMTP_USER: process.env.SMTP_USER || "Not set",
    SMTP_FROM: process.env.SMTP_FROM || "Not set",
    SMTP_PASS: process.env.SMTP_PASS ? "Configured" : "Not set",
    NODE_ENV: process.env.NODE_ENV || "Not set",
  });
});

export default router;
