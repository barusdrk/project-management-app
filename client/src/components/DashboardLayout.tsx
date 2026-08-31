import { Link, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Moon, Sun, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-(--bg) text-(--text)">
      <header className="border-b border-(--border) bg-(--surface)">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="text-xl font-bold text-(--text)">
            ProjectFlow
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <button type="button" onClick={toggleTheme} className="rounded-lg p-2 text-(--text-secondary) transition hover:bg-(--surface-hover) hover:text-(--text)" aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} title={theme === "dark" ? "Light mode" : "Dark mode"}>
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-(--text-secondary) hover:text-(--text)">
              <UserCircle size={18} />
              <span className="hidden sm:inline">{user?.name}</span>
            </Link>
            <button type="button" onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-(--text-secondary) hover:text-(--danger)">
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden w-56 border-r border-(--border) bg-(--surface) md:block">
          <nav className="space-y-1 p-4">
            <Link to="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text)">
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          </nav>
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
