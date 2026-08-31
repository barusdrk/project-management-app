import { Link } from "react-router-dom";
import { ArrowUpRight, CalendarDays, Trash2 } from "lucide-react";
import type { Project } from "../types";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <article className="rounded-xl border border-(--border) bg-(--surface) p-5 shadow-sm transition hover:bg-(--surface-hover) hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-(--text)">{project.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-(--text-secondary)">{project.description || "No description provided."}</p>
        </div>
        <button type="button" onClick={() => onDelete(project._id)} className="shrink-0 rounded-lg p-2 text-(--text-muted) hover:bg-(--danger-soft) hover:text-(--danger)" aria-label={`Delete ${project.name}`}>
          <Trash2 size={18} />
        </button>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-(--border) pt-4">
        <div className="flex items-center gap-2 text-xs text-(--text-secondary)">
          <CalendarDays size={15} />
          {new Date(project.createdAt).toLocaleDateString()}
        </div>
        <Link to={`/projects/${project._id}`} className="inline-flex items-center gap-1 text-(--accent) hover:text-(--accent-hover)">
          View project
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
