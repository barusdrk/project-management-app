import { useEffect, useState } from "react";
import { FolderKanban, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { getProjects } from "../services/api";
import type { Project } from "../types";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Projects() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        setProjects(await getProjects());
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unable to load projects.");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  return (
    <div className="flex min-h-screen bg-(--bg)">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 flex-1">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-7xl p-4 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-(--accent)">Workspace</p>
              <h1 className="mt-1 text-2xl font-bold text-(--text) sm:text-3xl">Projects</h1>
              <p className="mt-1 text-(--text-secondary)">Manage your projects and tasks.</p>
            </div>
            <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-lg bg-(--accent) px-5 py-3 font-medium text-white hover:bg-(--accent-hover)">
              <Plus size={18} /> New project
            </Link>
          </div>

          {error && <div className="mt-6 rounded-lg bg-(--danger-soft) p-4 text-sm text-(--danger-text)">{error}</div>}

          {loading ? (
            <div className="mt-8 rounded-xl border border-(--border) bg-(--surface) p-10 text-center text-(--text-secondary)">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-(--border) bg-(--surface) p-12 text-center">
              <FolderKanban className="mx-auto text-(--text-muted)" size={40} />
              <h2 className="mt-4 font-semibold text-(--text)">No projects yet</h2>
              <p className="mt-1 text-sm text-(--text-secondary)">Create your first project from the dashboard.</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <Link key={project._id} to={`/projects/${project._id}`} className="rounded-xl border border-(--border) bg-(--surface) p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-(--accent) hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="rounded-lg bg-(--accent-soft) p-2 text-(--accent)">
                      <FolderKanban size={20} />
                    </div>
                  </div>
                  <h2 className="mt-5 font-semibold text-(--text)">{project.name}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-(--text-secondary)">{project.description || "No description"}</p>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
