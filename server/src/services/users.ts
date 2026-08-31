import { Types } from "mongoose";
import { User } from "../models/User.js";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";

export async function getProfile(userId: string) {
  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid user ID");
  const user = await User.findById(userId).select("-password");
  if (!user) throw new Error("User not found");
  return user;
}

export async function updateProfile(userId: string, data: { name?: string; email?: string }) {
  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid user ID");

  const updates: { name?: string; email?: string } = {};

  if (data.name !== undefined) {
    const name = data.name.trim();
    if (!name) throw new Error("Name cannot be empty");
    updates.name = name;
  }

  if (data.email !== undefined) {
    const email = data.email.trim().toLowerCase();
    if (!email) throw new Error("Email cannot be empty");
    updates.email = email;
  }

  if (Object.keys(updates).length === 0) throw new Error("No profile changes provided");

  if (updates.email) {
    const existingUser = await User.findOne({
      email: updates.email,
      _id: { $ne: userId },
    });
    if (existingUser) throw new Error("Email is already in use");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) throw new Error("User not found");
  return user;
}

export async function deleteAccount(userId: string) {
  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid user ID");

  const owner = new Types.ObjectId(userId);
  const user = await User.findById(owner);

  if (!user) throw new Error("User not found");

  await Task.deleteMany({ owner });
  await Project.deleteMany({ owner });
  await User.deleteOne({ _id: owner });

  return { message: "Account deleted successfully" };
}
