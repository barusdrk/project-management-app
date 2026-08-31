import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/auth.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";

    res.status(400).json({
      message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await loginUser(req.body);

    res.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Login failed";

    res.status(401).json({
      message,
    });
  }
});

router.post("/logout", auth, (_req, res) => {
  res.json({
    message: "Logged out successfully",
  });
});

router.get("/me", auth, async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const user = await getCurrentUser(req.user.id);

    res.json({
      user,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "User not found";

    res.status(404).json({
      message,
    });
  }
});

export default router;
