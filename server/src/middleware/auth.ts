import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../config/jwt.js";

export interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

export function auth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  try {
    const payload = verifyToken(token);
    (req as AuthRequest).user = { id: payload.id };
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
