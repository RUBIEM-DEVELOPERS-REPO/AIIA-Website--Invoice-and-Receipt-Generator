import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { verify_document } from "../service";

const router = Router();

const uploadsDir = path.join(process.cwd(), "client", "src", "lib", "uploads");

// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o755 });
    }
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `document-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 4032 * 4032, // Limit file size to 2MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/tiff"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only .png, .jpg and .tiff files are allowed") as any, false);
      return;
    }
    cb(null, true);
  },
}).single('file');

// Document verification endpoint
router.post("/api/verify-document", (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({
          error: err.message,
          isId: false,
          nameMatch: false,
          confidence: "none",
          type: "Free Membership",
        });
      } else if (err) {
        console.error('Upload error:', err);
        return res.status(500).json({
          error: err.message,
          isId: false,
          nameMatch: false,
          confidence: "none",
          type: "Free Membership",
        });
      }

      if (!req.file || !req.body.fullName) {
        console.log("Missing file or full name in request");
        return res.status(400).json({
          error: "Missing file or full name",
          isId: false,
          nameMatch: false,
          confidence: "none",
          type: "Free Membership",
        });
      }

      console.log(`Processing document for ${req.body.fullName}`);
      const result = await verify_document(req.file.path, req.body.fullName);

      console.log("Document Verification Results:", {
        isId: result.isId,
        nameMatch: result.nameMatch,
        confidence: result.confidence,
        membershipType: result.type,
      });

      res.json(result);
    } catch (error) {
      console.error("Document verification error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to verify document";
      res.status(500).json({
        error: errorMessage,
        isId: false,
        nameMatch: false,
        confidence: "none",
        type: "Free Membership",
      });
    } finally {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error deleting uploaded file:", err);
        });
      }
    }
  });
});

export default router;
