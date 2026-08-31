import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { getProfile, updateProfile, deleteAccount } from "../services/users.js";

const router = Router();

router.use(auth);

router.get("/me", async (req: any, res) => {
  try {
    const user = await getProfile(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to get profile";
    res.status(400).json({ success: false, message });
  }
});

router.put("/me", async (req: any, res) => {
  try {
    const { name, email } = req.body;
    const user = await updateProfile(req.user.id, { name, email });

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update profile";
    const status = message === "Email is already in use" ? 409 : 400;

    res.status(status).json({
      success: false,
      message,
    });
  }
});

router.delete("/me", async (req: any, res) => {
  try {
    const result = await deleteAccount(req.user.id);
    res.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete account";
    res.status(400).json({ success: false, message });
  }
});

export default router;
