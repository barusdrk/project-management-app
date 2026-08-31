import { Types } from "mongoose";
import { Project } from "../models/Project.js";
import { Task, TaskStatus } from "../models/Task.js";

interface TaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  projectId: string;
  dueDate?: string;
}

interface TaskUpdateInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string | null;
}

function validateDueDate(dueDate?: string | null) {
  if (!dueDate) return;

  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid due date");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date < today) throw new Error("Due date cannot be before today");
}

export async function createTask(userId: string, input: TaskInput) {
  const title = input.title?.trim();
  if (!title) throw new Error("Task title is required");
  if (!Types.ObjectId.isValid(input.projectId)) throw new Error("Invalid project ID");

  const project = await Project.findOne({
    _id: input.projectId,
    owner: new Types.ObjectId(userId),
  });

  if (!project) throw new Error("Project not found");

  if (input.status && !["todo", "in-progress", "completed"].includes(input.status)) {
    throw new Error("Invalid task status");
  }

  validateDueDate(input.dueDate);

  return Task.create({
    title,
    description: input.description?.trim() ?? "",
    status: input.status ?? "todo",
    project: project._id,
    owner: new Types.ObjectId(userId),
    dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
  });
}

export async function getTasks(userId: string, options: {
  projectId?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, Math.max(1, options.limit ?? 10));
  const filter: Record<string, unknown> = { owner: new Types.ObjectId(userId) };

  if (options.projectId) {
    if (!Types.ObjectId.isValid(options.projectId)) throw new Error("Invalid project ID");
    filter.project = new Types.ObjectId(options.projectId);
  }

  if (options.status) {
    if (!["todo", "in-progress", "completed"].includes(options.status)) {
      throw new Error("Invalid task status");
    }
    filter.status = options.status;
  }

  if (options.search?.trim()) {
    const search = options.search.trim();
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    Task.find(filter).populate("project", "name").sort({ createdAt: -1 }).skip(skip).limit(limit),
    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getTaskById(userId: string, taskId: string) {
  if (!Types.ObjectId.isValid(taskId)) throw new Error("Invalid task ID");

  const task = await Task.findOne({
    _id: taskId,
    owner: new Types.ObjectId(userId),
  }).populate("project", "name");

  if (!task) throw new Error("Task not found");
  return task;
}

export async function updateTask(userId: string, taskId: string, input: TaskUpdateInput) {
  if (!Types.ObjectId.isValid(taskId)) throw new Error("Invalid task ID");

  const update: Record<string, unknown> = {};

  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) throw new Error("Task title is required");
    update.title = title;
  }

  if (input.description !== undefined) update.description = input.description.trim();

  if (input.status !== undefined) {
    if (!["todo", "in-progress", "completed"].includes(input.status)) {
      throw new Error("Invalid task status");
    }
    update.status = input.status;
  }

  if (input.dueDate !== undefined) {
    validateDueDate(input.dueDate);
    update.dueDate = input.dueDate ? new Date(input.dueDate) : null;
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId, owner: new Types.ObjectId(userId) },
    update,
    { new: true, runValidators: true }
  ).populate("project", "name");

  if (!task) throw new Error("Task not found");
  return task;
}

export async function deleteTask(userId: string, taskId: string) {
  if (!Types.ObjectId.isValid(taskId)) throw new Error("Invalid task ID");

  const task = await Task.findOneAndDelete({
    _id: taskId,
    owner: new Types.ObjectId(userId),
  });

  if (!task) throw new Error("Task not found");
  return task;
}
