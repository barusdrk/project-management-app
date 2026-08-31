import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../services/tasks.js";

const router = Router();

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const result = await getTasks(req.user!.id, {
      projectId:
        typeof req.query.projectId === "string"
          ? req.query.projectId
          : undefined,
      search:
        typeof req.query.search === "string"
          ? req.query.search
          : undefined,
      status:
        typeof req.query.status === "string"
          ? req.query.status
          : undefined,
      page:
        typeof req.query.page === "string"
          ? Number(req.query.page)
          : 1,
      limit:
        typeof req.query.limit === "string"
          ? Number(req.query.limit)
          : 10,
    });

    res.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch tasks";

    res.status(400).json({
      message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const task = await createTask(
      req.user!.id,
      req.body
    );

    res.status(201).json({
      task,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create task";

    res.status(400).json({
      message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const task = await getTaskById(
      req.user!.id,
      req.params.id
    );

    res.json({
      task,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Task not found";

    res.status(404).json({
      message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const task = await updateTask(
      req.user!.id,
      req.params.id,
      req.body
    );

    res.json({
      task,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update task";

    res.status(400).json({
      message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await deleteTask(
      req.user!.id,
      req.params.id
    );

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Task not found";

    res.status(404).json({
      message,
    });
  }
});

export default router;
