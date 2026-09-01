import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

useEffect(() => {
document.documentElement.classList.toggle("dark", dark);
localStorage.setItem("theme", dark ? "dark" : "light");
}, [dark]);

return (
<button type="button" onClick={() => setDark((value) => !value)} className="rounded-lg p-2 text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text)" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "Light mode" : "Dark mode"}>
{dark ? <Sun size={19} /> : <Moon size={19} />} </button>
);
}
