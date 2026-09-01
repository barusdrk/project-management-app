import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { deleteAccount, updateProfile } from "../services/api";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const updatedUser = await updateProfile({ name: name.trim(), email: email.trim() });
      updateUser(updatedUser);
      setName(updatedUser.name);
      setEmail(updatedUser.email);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeleting(true);
    setMessage("");
    setError("");

    try {
      await deleteAccount();
      localStorage.removeItem("token");
      navigate("/register", { replace: true });
      window.location.reload();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to delete account.");
      setDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-(--bg) text-(--text)">
      <header className="border-b border-(--border) bg-(--surface)">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-(--text-secondary) hover:text-(--text)">
            <ArrowLeft size={17} />
            Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        <div className="rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-(--accent-soft) p-4 text-(--accent)">
              <UserCircle size={36} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-(--text)">Profile</h1>
              <p className="text-sm text-(--text-secondary)">Manage your account information</p>
            </div>
          </div>

          {message && <div className="mt-6 rounded-lg bg-(--success-soft) p-4 text-sm text-(--success-text)">{message}</div>}
          {error && <div className="mt-6 rounded-lg bg-(--danger-soft) p-4 text-sm text-(--danger-text)">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-(--text-secondary)">Name</label>
              <input id="name" type="text" value={name} onChange={(event) => setName(event.target.value)} required disabled={saving || deleting} className="w-full rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none placeholder:text-(--text-muted) focus:border-(--accent) disabled:opacity-50" />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-(--text-secondary)">Email</label>
              <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={saving || deleting} className="w-full rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none placeholder:text-(--text-muted) focus:border-(--accent) disabled:opacity-50" />
            </div>

            <button type="submit" disabled={saving || deleting} className="rounded-lg bg-(--accent) px-5 py-3 font-medium text-white transition hover:bg-(--accent-hover) disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>

          {user?.createdAt && (
            <div className="mt-8 border-t border-(--border) pt-6">
              <p className="text-sm text-(--text-secondary)">Member since</p>
              <p className="mt-1 font-medium text-(--text)">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          )}

          <div className="mt-8 border-t border-(--border) pt-6">
            <h2 className="text-lg font-semibold text-(--danger-text)">Danger Zone</h2>
            <p className="mt-2 text-sm text-(--text-secondary)">
              Permanently delete your account and all associated data.
            </p>
            <button type="button" onClick={handleDeleteAccount} disabled={saving || deleting} className="mt-4 rounded-lg bg-(--danger) px-5 py-3 text-sm font-medium text-(--danger-soft) transition hover:bg-(--danger-hover) disabled:cursor-not-allowed disabled:opacity-50">
              {deleting ? "Deleting account..." : "Delete account"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
