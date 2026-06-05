import { useLayoutEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const TOGGLE_LABEL = { light: "Dark", dark: "Light" };
const STORAGE_KEY = "wheel.theme";

function prefersDark() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

// Light/dark theme toggle. Persists to localStorage["wheel.theme"], and falls
// back to the OS prefers-color-scheme when nothing valid is stored.
export default function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage(STORAGE_KEY, (stored) =>
    stored === "light" || stored === "dark"
      ? stored
      : prefersDark()
        ? "dark"
        : "light"
  );

  // Apply data-theme to <html> before paint (no flash of the wrong theme).
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <button
      id="theme-toggle"
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {TOGGLE_LABEL[theme]}
    </button>
  );
}
