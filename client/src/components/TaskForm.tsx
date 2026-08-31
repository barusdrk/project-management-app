import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Task, TaskStatus } from "../types";

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: { title: string; description: string; status: TaskStatus; dueDate?: string }) => Promise<void>;
  onClose: () => void;
}

function getToday() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60 * 1000).toISOString().slice(0, 10);
}

export default function TaskForm({ task, onSubmit, onClose }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "todo");
  const [dueDate, setDueDate] = useState(task?.dueDate?.slice(0, 10) ?? "");
  const [saving, setSaving] = useState(false);
  const today = getToday();

  useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setStatus(task?.status ?? "todo");
    setDueDate(task?.dueDate?.slice(0, 10) ?? "");
  }, [task]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (dueDate && dueDate < today) return;
    setSaving(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), status, dueDate: dueDate || undefined });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-(--text)">{task ? "Edit task" : "Create task"}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-(--text-muted) hover:bg-(--surface-hover) hover:text-(--text)" aria-label="Close">×</button>
        </div>
        <div className="mt-6 space-y-4">
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task title" required disabled={saving} className="w-full rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none placeholder:text-(--text-muted) focus:border-(--accent)" />
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" disabled={saving} className="min-h-28 w-full rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none placeholder:text-(--text-muted) focus:border-(--accent)" />
          <div className="grid gap-4 sm:grid-cols-2">
            <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)} disabled={saving} className="rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none focus:border-(--accent)">
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <input type="date" value={dueDate} min={today} onChange={(event) => setDueDate(event.target.value)} disabled={saving} className="rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none focus:border-(--accent)" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-(--border) px-4 py-2 text-sm font-medium text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text)">Cancel</button>
          <button type="submit" disabled={saving} className="rounded-lg bg-(--accent) px-4 py-2 text-sm font-medium text-white hover:bg-(--accent-hover) disabled:cursor-not-allowed disabled:opacity-50">
            {saving ? "Saving..." : task ? "Save changes" : "Create task"}
          </button>
        </div>
      </form>
    </div>
  );
}
