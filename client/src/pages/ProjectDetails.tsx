import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { createTask, deleteProject, deleteTask, getProject, getTasks, updateTask } from "../services/api";
import type { Project, Task, TaskStatus } from "../types";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProject() {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const [projectData, taskData] = await Promise.all([
        getProject(id),
        getTasks({ projectId: id, search, status, page, limit: 10 }),
      ]);
      setProject(projectData);
      setTasks(taskData.tasks);
      setTotalPages(taskData.pagination.totalPages);
    } catch {
      setError("Unable to load this project.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProject();
  }, [id, search, status, page]);

  async function handleTaskSubmit(data: { title: string; description: string; status: TaskStatus; dueDate?: string }) {
    if (!id) return;
    if (editingTask) {
      await updateTask(editingTask._id, data);
    } else {
      await createTask({ projectId: id, ...data });
    }
    setShowForm(false);
    setEditingTask(null);
    await loadProject();
  }

  async function handleDeleteTask(taskId: string) {
    if (!window.confirm("Delete this task?")) return;
    await deleteTask(taskId);
    await loadProject();
  }

  async function handleStatusChange(taskId: string, newStatus: TaskStatus) {
    await updateTask(taskId, { status: newStatus });
    await loadProject();
  }

  async function handleDeleteProject() {
    if (!id || !window.confirm("Delete this project and all its tasks?")) return;
    await deleteProject(id);
    window.location.href = "/dashboard";
  }

  if (loading && !project) return <PageMessage message="Loading project..." />;
  if (error) return <PageMessage message={error} />;

  return (
    <main className="min-h-screen bg-(--bg) text-(--text)">
      <header className="border-b border-(--border) bg-(--surface)">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-(--text-secondary) hover:text-(--text)">
            <ArrowLeft size={17} /> Dashboard
          </Link>
          <button onClick={handleDeleteProject} className="inline-flex items-center gap-2 rounded-lg bg-(--danger) px-3 py-2 text-sm font-medium text-white hover:bg-(--danger-hover)">
            <Trash2 size={16} /> Delete project
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <section className="rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-sm">
          <p className="text-sm font-medium text-(--accent)">Project</p>
          <h1 className="mt-1 text-3xl font-bold text-(--text)">{project?.name}</h1>
          <p className="mt-2 max-w-2xl text-(--text-secondary)">
            {project?.description || "No description provided."}
          </p>
        </section>

        <section className="mt-6">
          <div className="flex flex-col gap-3 lg:flex-row">
            <input
              type="search"
              placeholder="Search tasks..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="flex-1 rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none placeholder:text-(--text-secondary) focus:border-(--accent)"
            />
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as TaskStatus | "");
                setPage(1);
              }}
              className="rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none focus:border-(--accent)"
            >
              <option value="">All statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button
              onClick={() => {
                setEditingTask(null);
                setShowForm(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-(--accent) px-5 py-3 font-medium text-white hover:opacity-90"
            >
              <Plus size={18} /> New task
            </button>
          </div>

          {loading ? (
            <div className="mt-6 rounded-xl border border-(--border) bg-(--surface) p-10 text-center text-(--text-secondary)">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-(--border) bg-(--surface) p-12 text-center">
              <h2 className="font-semibold text-(--text)">No tasks found</h2>
              <p className="mt-1 text-sm text-(--text-secondary)">
                Create a task or change your search filters.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={(selectedTask) => {
                    setEditingTask(selectedTask);
                    setShowForm(true);
                  }}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border border-(--border) bg-(--surface) px-4 py-2 text-sm text-(--text) disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-(--text-secondary)">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border border-(--border) bg-(--surface) px-4 py-2 text-sm text-(--text) disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>

      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleTaskSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </main>
  );
}

function PageMessage({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--bg) text-(--text-secondary)">
      {message}
    </div>
  );
}
