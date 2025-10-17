import { useTheme } from "../contexts/ThemeContext";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light", label: "Light", icon: "☀️" },
    { value: "dark", label: "Dark", icon: "🌙" },
    { value: "system", label: "System", icon: "💻" },
  ] as const;

  return (
    <div className="theme-switcher">
      <div className="theme-switcher-label">Theme</div>
      <div className="theme-switcher-buttons">
        {themes.map(({ value, label, icon }) => (
          <button
            key={value}
            className={`theme-button ${theme === value ? "active" : ""}`}
            onClick={() => setTheme(value)}
            title={`Switch to ${label} mode`}
            aria-label={`Switch to ${label} mode`}
          >
            <span className="theme-icon">{icon}</span>
            <span className="theme-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
