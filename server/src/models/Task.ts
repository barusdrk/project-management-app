import mongoose, { Document, Schema, Types } from "mongoose";

export type TaskStatus = "todo" | "in-progress" | "completed";

export interface TaskDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  status: TaskStatus;
  project: Types.ObjectId;
  owner: Types.ObjectId;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<TaskDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ owner: 1, project: 1 });
taskSchema.index({ owner: 1, status: 1 });

export const Task = mongoose.model<TaskDocument>("Task", taskSchema);
