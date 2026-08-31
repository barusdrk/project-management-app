import { Search, SlidersHorizontal } from "lucide-react";
import type { TaskStatus } from "../types";

interface TaskFiltersProps {
  search: string;
  status: TaskStatus | "";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskStatus | "") => void;
}

export default function TaskFilters({ search, status, onSearchChange, onStatusChange }: TaskFiltersProps) {
  return (
    <div className="rounded-xl border border-(--border) bg-(--surface) p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal size={18} className="text-(--text-secondary)" />
        <h2 className="font-medium text-(--text)">Tasks</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)" />
          <input type="search" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search tasks..." className="w-full rounded-lg border border-(--border) bg-(--surface) py-2.5 pl-10 pr-4 text-sm text-(--text) outline-none placeholder:text-(--text-muted) focus:border-(--accent)" />
        </div>
        <select value={status} onChange={(event) => onStatusChange(event.target.value as TaskStatus | "")} className="rounded-lg border border-(--border) bg-(--surface) px-4 py-2.5 text-sm text-(--text-secondary) outline-none focus:border-(--accent)">
          <option value="">All statuses</option>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
}
