import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.response?.data?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--bg) p-6 text-(--text)">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-(--border) bg-(--surface) p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-(--text)">Create account</h1>
        <p className="mt-2 text-(--text-secondary)">Start managing your projects.</p>

        {error && (
          <div className="mt-5 rounded-lg border border-(--danger-border) bg-(--danger-bg) p-3 text-sm text-(--danger)">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none placeholder:text-(--text-secondary) focus:border-(--accent)"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none placeholder:text-(--text-secondary) focus:border-(--accent)"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none placeholder:text-(--text-secondary) focus:border-(--accent)"
            minLength={8}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-(--accent) px-4 py-3 font-medium text-(--accent-contrast) hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-(--text-secondary)">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-(--accent) hover:opacity-80">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
