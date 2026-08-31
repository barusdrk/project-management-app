import jwt from "jsonwebtoken";
import { env } from "./env.js";

export interface JwtPayload {
  id: string;
}

export function generateToken(userId: string): string {
  return jwt.sign({ id: userId }, env.JWT_SECRET);
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (typeof decoded === "string" || typeof decoded.id !== "string") {
    throw new Error("Invalid token");
  }

  return { id: decoded.id };
}
