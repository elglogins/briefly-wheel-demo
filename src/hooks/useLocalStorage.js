import { useEffect, useState } from "react";

// Small persistence helper shared by the language and theme toggles.
//
// `init(stored)` receives the raw stored string (or null when nothing is
// stored / localStorage is unavailable) and returns the value to use. This
// mirrors the original IIFEs, which validated the stored value and fell back
// to a default when it was missing or invalid.
//
// The value is read lazily once on mount (so there is no flash of a default
// before the stored value is applied) and persisted back on every change —
// including the resolved initial value, matching the original behaviour where
// the first `apply()` call wrote the value to localStorage.
export function useLocalStorage(key, init) {
  const [value, setValue] = useState(() => {
    let stored = null;
    try {
      stored = localStorage.getItem(key);
    } catch (e) {
      // localStorage unavailable (private mode, blocked, etc.)
    }
    return init(stored);
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // ignore write failures, same as the original try/catch
    }
  }, [key, value]);

  return [value, setValue];
}
