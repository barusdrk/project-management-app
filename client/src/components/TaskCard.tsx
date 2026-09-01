import { Pencil, Trash2 } from "lucide-react";
import type { Task, TaskStatus } from "../types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  return (
    <div className="rounded-xl border border-(--border) bg-(--surface) p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-semibold text-(--text)">{task.title}</h3>
          {task.description && <p className="mt-1 text-sm text-(--text-secondary)">{task.description}</p>}
          {task.dueDate && <p className="mt-3 text-xs text-(--text-muted)">Due {new Date(task.dueDate).toLocaleDateString()}</p>}
        </div>
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${statusClass(task.status)}`}>{statusLabel(task.status)}</span>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-(--border) pt-4">
        <select value={task.status} onChange={(event) => onStatusChange(task._id, event.target.value as TaskStatus)} className="rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-sm text-(--text-secondary) outline-none focus:border-(--accent)">
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button type="button" onClick={() => onEdit(task)} className="inline-flex items-center gap-2 rounded-lg border border-(--border) px-3 py-2 text-sm font-medium text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text)">
          <Pencil size={15} /> Edit
        </button>
        <button type="button" onClick={() => onDelete(task._id)} className="inline-flex items-center gap-2 rounded-lg bg-(--danger) px-3 py-2 text-sm font-medium text-white hover:bg-(--danger-hover)">
          <Trash2 size={15} /> Delete
        </button>
      </div>
    </div>
  );
}

function statusLabel(status: TaskStatus) {
  return status === "todo" ? "To Do" : status === "in-progress" ? "In Progress" : "Completed";
}

function statusClass(status: TaskStatus) {
  return status === "todo" ? "bg-(--bg-secondary) text-(--text-secondary)" : status === "in-progress" ? "bg-(--warning-soft) text-(--warning-text)" : "bg-(--success-soft) text-(--success-text)";
}
