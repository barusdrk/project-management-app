import { useState } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";

interface ProjectFormProps {
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
  onCancel?: () => void;
}

export default function ProjectForm({ onSubmit, onCancel }: ProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    setSaving(true);

    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
      setName("");
      setDescription("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to create project.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-(--border) bg-(--surface) p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-(--text)">Create project</h2>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-lg p-2 text-(--text-muted) hover:bg-(--surface-hover) hover:text-(--text)">
            <X size={18} />
          </button>
        )}
      </div>
      {error && <div className="mb-4 rounded-lg bg-(--danger-soft) p-3 text-sm text-(--danger-text)">{error}</div>}
      <div className="space-y-4">
        <div>
          <label htmlFor="project-name" className="mb-2 block text-sm font-medium text-(--text-secondary)">Project name</label>
          <input id="project-name" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Website redesign" required disabled={saving} className="w-full rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none placeholder:text-(--text-muted) focus:border-(--accent)" />
        </div>
        <div>
          <label htmlFor="project-description" className="mb-2 block text-sm font-medium text-(--text-secondary)">Description</label>
          <textarea id="project-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe your project..." rows={4} disabled={saving} className="w-full resize-y rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none placeholder:text-(--text-muted) focus:border-(--accent)" />
        </div>
        <button type="submit" disabled={saving} className="w-full rounded-lg bg-(--accent) px-5 py-3 font-medium text-white hover:bg-(--accent-hover) disabled:cursor-not-allowed disabled:opacity-50">
          {saving ? "Creating..." : "Create project"}
        </button>
      </div>
    </form>
  );
}
