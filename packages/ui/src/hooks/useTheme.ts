import { useCallback, useEffect, useState } from "react";

export type Mode = "dark" | "light";

export type Theme = {
  mode: Mode;
};

const INITIAL_STATE: Theme = {
  mode: "dark",
};

export function useTheme(defaultTheme: Mode = "dark") {
  const [theme, setTheme] = useState(INITIAL_STATE);

  const toggleTheme = useCallback(() => {
    const nextMode: Mode = theme.mode === "dark" ? "light" : "dark";

    setTheme((previous) => ({ ...previous, mode: nextMode }));

    document.body.classList.toggle("dark");

    localStorage.setItem("theme", nextMode);
  }, [theme.mode, setTheme]);

  useEffect(() => {
    if (theme.mode === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme.mode]);

  useEffect(() => {
    const nextMode = (localStorage.getItem("theme") || defaultTheme) as Mode;

    setTheme({ mode: nextMode });
  }, []);

  return {
    theme,
    toggleTheme,
  };
}
