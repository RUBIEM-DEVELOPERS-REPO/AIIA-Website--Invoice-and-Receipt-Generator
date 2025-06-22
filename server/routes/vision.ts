import { Router } from "express";
import express from "express";

const router = Router();

// Mount router at /api/vision
router.use('/api/vision', express.Router());

export default router;