import type { Request, Response, NextFunction } from "express";

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  console.log("Checking admin auth:", req.isAuthenticated(), req.user);
  
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = req.user as { level?: string; id: number };
  if (user.level !== 'admin') {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }

  next();
}
