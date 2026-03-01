import { Request, Response, NextFunction } from "express";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "quickhire-admin-key";

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const key =
    req.headers["x-admin-key"] ||
    req.headers["authorization"]?.replace(/^Bearer\s+/i, "");
  if (key !== ADMIN_API_KEY) {
    res.status(401).json({ error: "Unauthorized: admin key required" });
    return;
  }
  next();
}
