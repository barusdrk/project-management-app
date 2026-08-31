import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="h-16 border-b border-(--border) bg-(--surface)">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <button type="button" onClick={onMenuClick} className="rounded-lg p-2 text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text) lg:hidden" aria-label="Open menu">
          <Menu size={21} />
        </button>
        <div className="ml-auto flex items-center gap-4">
          <Link to="/profile" className="hidden text-sm font-medium text-(--text-secondary) hover:text-(--text) sm:block">
            {user?.name}
          </Link>
          <button type="button" onClick={handleLogout} className="text-sm font-medium text-(--text-secondary) hover:text-(--danger)">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
