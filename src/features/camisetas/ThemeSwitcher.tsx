import { useEffect, useState } from "react";

type ThemeOption = {
  value: string | null;
  label: string;
};

const THEME_OPTIONS: ThemeOption[] = [
  { value: null, label: "☀️ Claro (actual)" },
  { value: "dark-1", label: "⚫ Negro puro" },
  { value: "dark-2", label: "🌌 Azul noche" },
  { value: "dark-3", label: "◾ Grafito" }
];

const STORAGE_KEY = "pdh-theme";

function applyTheme(theme: string | null) {
  if (theme) {
    document.documentElement.setAttribute("data-theme", theme);
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

export function ThemeSwitcher() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedIndex = THEME_OPTIONS.findIndex((option) => option.value === saved);
    const initialIndex = savedIndex >= 0 ? savedIndex : 0;
    setIndex(initialIndex);
    applyTheme(THEME_OPTIONS[initialIndex].value);
  }, []);

  function handleClick() {
    const nextIndex = (index + 1) % THEME_OPTIONS.length;
    setIndex(nextIndex);
    const nextTheme = THEME_OPTIONS[nextIndex].value;
    applyTheme(nextTheme);
    if (nextTheme) {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return (
    <button type="button" className="pdh-theme-switcher" onClick={handleClick}>
      🎨 Fondo: {THEME_OPTIONS[index].label}
    </button>
  );
}
