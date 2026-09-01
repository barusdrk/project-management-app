import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Plus, FolderKanban, ListTodo, CheckCircle2, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { createProject, getProjects, getTasks } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Project, Task } from "../types";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");
    try {
      const [projectData, taskData] = await Promise.all([getProjects(), getTasks({ limit: 100 })]);
      setProjects(projectData);
      setTasks(taskData.tasks);
    } catch {
      setError("Unable to load your dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleCreateProject(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    try {
      await createProject({ name: name.trim(), description: description.trim() });
      setName("");
      setDescription("");
      setShowProjectForm(false);
      await loadDashboard();
    } catch {
      setError("Unable to create project.");
    }
  }

  const completed = tasks.filter((task) => task.status === "completed").length;
  const inProgress = tasks.filter((task) => task.status === "in-progress").length;
  const todo = tasks.filter((task) => task.status === "todo").length;

  return (
    <div className="flex min-h-screen bg-(--bg) text-(--text)">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 flex-1">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-7xl p-4 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-(--accent)">Workspace</p>
              <h1 className="mt-1 text-2xl font-bold text-(--text) sm:text-3xl">Welcome back, {user?.name}</h1>
              <p className="mt-1 text-(--text-secondary)">Here's what's happening with your projects.</p>
            </div>
            <button type="button" onClick={() => setShowProjectForm(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-(--accent) px-5 py-3 font-medium text-white hover:bg-(--accent-hover)">
              <Plus size={18} /> New project
            </button>
          </div>

          {error && <div className="mt-6 rounded-lg bg-(--danger-soft) p-4 text-sm text-(--danger-text)">{error}</div>}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={<FolderKanban />} label="Projects" value={projects.length} />
            <StatCard icon={<ListTodo />} label="Total tasks" value={tasks.length} />
            <StatCard icon={<Clock3 />} label="In progress" value={inProgress} />
            <StatCard icon={<CheckCircle2 />} label="Completed" value={completed} />
          </div>

          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-(--text)">Projects</h2>
              <span className="text-sm text-(--text-muted)">{todo} tasks to do</span>
            </div>

            {loading ? (
              <div className="mt-4 rounded-xl border border-(--border) bg-(--surface) p-10 text-center text-(--text-secondary)">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-(--border) bg-(--surface) p-12 text-center">
                <FolderKanban className="mx-auto text-(--text-muted)" size={40} />
                <h3 className="mt-4 font-semibold text-(--text)">No projects yet</h3>
                <p className="mt-1 text-sm text-(--text-secondary)">Create your first project to get started.</p>
                <button type="button" onClick={() => setShowProjectForm(true)} className="mt-5 rounded-lg bg-(--accent) px-4 py-2 text-sm font-medium text-white hover:bg-(--accent-hover)">
                  Create project
                </button>
              </div>
            ) : (
              <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => {
                  const projectTasks = tasks.filter((task) => typeof task.project === "string" ? task.project === project._id : task.project._id === project._id);
                  return (
                    <Link key={project._id} to={`/projects/${project._id}`} className="group rounded-xl border border-(--border) bg-(--surface) p-6 shadow-sm transition hover:border-(--accent-border) hover:bg-(--surface-hover) hover:shadow-md">
                      <div className="flex items-start justify-between">
                        <div className="rounded-lg bg-(--accent-soft) p-2 text-(--accent)">
                          <FolderKanban size={20} />
                        </div>
                        <span className="text-xs text-(--text-muted)">{projectTasks.length} tasks</span>
                      </div>
                      <h3 className="mt-5 font-semibold text-(--text) group-hover:text-(--accent)">{project.name}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-(--text-secondary)">{project.description || "No description"}</p>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>

      {showProjectForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleCreateProject} className="w-full max-w-lg rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-(--text)">Create project</h2>
            <div className="mt-5 space-y-4">
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Project name" required className="w-full rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none placeholder:text-(--text-muted) focus:border-(--accent)" />
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" className="min-h-28 w-full rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none placeholder:text-(--text-muted) focus:border-(--accent)" />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowProjectForm(false)} className="rounded-lg border border-(--border) px-4 py-2 text-sm font-medium text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text)">
                Cancel
              </button>
              <button type="submit" className="rounded-lg bg-(--accent) px-4 py-2 text-sm font-medium text-white hover:bg-(--accent-hover)">
                Create project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-(--border) bg-(--surface) p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-(--text-muted)">{icon}</span>
        <span className="text-2xl font-bold text-(--text)">{value}</span>
      </div>
      <p className="mt-4 text-sm font-medium text-(--text-secondary)">{label}</p>
    </div>
  );
}
