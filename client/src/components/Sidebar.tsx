import { BarChart3, FolderKanban, UserCircle, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 z-30 bg-black/40 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-(--border) bg-(--surface) transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between border-b border-(--border) px-5">
          <span className="text-xl font-bold text-(--text)">ProjectFlow</span>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text) lg:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className="space-y-1 p-4">
          <NavItem to="/dashboard" icon={<BarChart3 size={18} />} label="Dashboard" onClick={onClose} />
          <NavItem to="/projects" icon={<FolderKanban size={18} />} label="Projects" onClick={onClose} />
          <NavItem to="/profile" icon={<UserCircle size={18} />} label="Profile" onClick={onClose} />
        </nav>
      </aside>
    </>
  );
}

function NavItem({ to, icon, label, onClick }: { to: string; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <NavLink to={to} onClick={onClick} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? "bg-(--accent-soft) text-(--accent-text)" : "text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text)"}`}>
      {icon}
      {label}
    </NavLink>
  );
}
