import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--bg) p-6 text-(--text)">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-(--border) bg-(--surface) p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-(--text)">Welcome back</h1>
        <p className="mt-2 text-(--text-secondary)">Sign in to ProjectFlow.</p>
        {error && <div className="mt-5 rounded-lg bg-(--danger-soft) p-3 text-sm text-(--danger-text)">{error}</div>}
        <div className="mt-6 space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={loading} className="w-full rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none placeholder:text-(--text-muted) focus:border-(--accent)" required />
          <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={loading} className="w-full rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none placeholder:text-(--text-muted) focus:border-(--accent)" required />
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-(--accent) px-4 py-3 font-medium text-white hover:bg-(--accent-hover) disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-(--text-secondary)">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-(--accent) hover:text-(--accent-hover)">
            Create one
          </Link>
        </p>
      </form>
    </main>
  );
}
