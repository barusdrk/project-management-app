import axios from "axios";
import type { Project, Task, TaskStatus, User } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
    }
    const message = error.response?.data?.message || error.message || "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

// Authentication
export async function register(data: { name: string; email: string; password: string }) {
  const response = await api.post<{ user: User; token: string }>("/auth/register", data);
  return response.data;
}

export async function login(data: { email: string; password: string }) {
  const response = await api.post<{ user: User; token: string }>("/auth/login", data);
  return response.data;
}

export async function getMe() {
  const response = await api.get<{ user: User }>("/auth/me");
  return response.data.user;
}

export async function logout() {
  await api.post("/auth/logout");
}

// User profile
export async function updateProfile(data: { name?: string; email?: string }) {
  const response = await api.put<{ user: User }>("/users/me", data);
  return response.data.user;
}

export async function deleteAccount() {
  await api.delete("/users/me");
}

// Projects
export async function getProjects() {
  const response = await api.get<{ projects: Project[] }>("/projects");
  return response.data.projects;
}

export async function createProject(data: { name: string; description: string }) {
  const response = await api.post<{ project: Project }>("/projects", data);
  return response.data.project;
}

export async function getProject(id: string) {
  const response = await api.get<{ project: Project }>(`/projects/${id}`);
  return response.data.project;
}

export async function deleteProject(id: string) {
  await api.delete(`/projects/${id}`);
}

// Tasks
export async function getTasks(params: {
  projectId?: string;
  search?: string;
  status?: TaskStatus | "";
  page?: number;
  limit?: number;
}) {
  const response = await api.get("/tasks", { params });
  return response.data as {
    tasks: Task[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  };
}

export async function getTask(id: string) {
  const response = await api.get<{ task: Task }>(`/tasks/${id}`);
  return response.data.task;
}

export async function createTask(data: {
  projectId: string;
  title: string;
  description: string;
  status?: TaskStatus;
  dueDate?: string;
}) {
  const response = await api.post<{ task: Task }>("/tasks", data);
  return response.data.task;
}

export async function updateTask(
  id: string,
  data: { title?: string; description?: string; status?: TaskStatus; dueDate?: string | null }
) {
  const response = await api.put<{ task: Task }>(`/tasks/${id}`, data);
  return response.data.task;
}

export async function deleteTask(id: string) {
  await api.delete(`/tasks/${id}`);
}
