import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import type { FC } from "react";
import tw from "tailwind-styled-components";

import { useTheme } from "../../hooks/useTheme";

const Button = tw.button`
  flex items-center p-1 rounded-full w-14 h-8
  bg-white/10 text-slate-400/60
`;

const Dot = tw.div`
  transition-all duration-600 group-hover:bg-indigo-500/80 
  rounded-full h-5 w-5 bg-slate-400/40
`;

const Slider = tw.div`
  absolute h-6 w-6 
  transition-transform duration-600
`;

export const ThemeSwitcher: FC = () => {
  const { theme, toggleTheme } = useTheme();

  const Icon = theme.mode === "dark" ? MoonIcon : SunIcon;

  return (
    <Button onClick={toggleTheme} className="group">
      <Slider
        className={clsx("tanslate-x-8 flex items-center", {
          "translate-x-6": theme.mode !== "dark",
        })}
      >
        <Icon className="animate-appear h-5 w-5" />
      </Slider>
      <Slider
        className={clsx("tanslate-x-0 grid place-items-center", {
          "translate-x-6": theme.mode === "dark",
        })}
      >
        <Dot />
      </Slider>
    </Button>
  );
};
