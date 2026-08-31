import { Types } from "mongoose";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";

export async function createProject(
  userId: string,
  input: {
    name: string;
    description?: string;
  }
) {
  const name = input.name?.trim();
  const description = input.description?.trim() ?? "";

  if (!name) {
    throw new Error("Project name is required");
  }

  return Project.create({
    name,
    description,
    owner: new Types.ObjectId(userId),
  });
}

export async function getProjects(userId: string) {
  return Project.find({
    owner: new Types.ObjectId(userId),
  }).sort({ createdAt: -1 });
}

export async function getProjectById(
  userId: string,
  projectId: string
) {
  if (!Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }

  const project = await Project.findOne({
    _id: projectId,
    owner: new Types.ObjectId(userId),
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}

export async function deleteProject(
  userId: string,
  projectId: string
) {
  if (!Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }

  const project = await Project.findOneAndDelete({
    _id: projectId,
    owner: new Types.ObjectId(userId),
  });

  if (!project) {
    throw new Error("Project not found");
  }

  await Task.deleteMany({
    project: project._id,
    owner: new Types.ObjectId(userId),
  });

  return project;
}
