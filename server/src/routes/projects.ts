import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
} from "../services/projects.js";

const router = Router();

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const projects = await getProjects(req.user!.id);

    res.json({
      projects,
    });
  } catch {
    res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const project = await createProject(req.user!.id, req.body);

    res.status(201).json({
      project,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create project";

    res.status(400).json({
      message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const project = await getProjectById(
      req.user!.id,
      req.params.id
    );

    res.json({
      project,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Project not found";

    res.status(404).json({
      message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await deleteProject(
      req.user!.id,
      req.params.id
    );

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Project not found";

    res.status(404).json({
      message,
    });
  }
});

export default router;
