import MoonIcon from "@heroicons/react/outline/MoonIcon";
import SunIcon from "@heroicons/react/outline/SunIcon";
import clsx from "clsx";
import { FC } from "react";
import tw from "tailwind-styled-components";

import { useTheme } from "../../hooks/useTheme";

const Button = tw.button`
  flex items-center p-1 rounded-full w-14 h-8
  bg-slate-800/20 dark:bg-white/10 dark:text-slate-400/60
`;

const Dot = tw.div`
  transition-all duration-600 group-hover:bg-indigo-500/80 
  rounded-full h-5 w-5 dark:bg-slate-400/40 bg-slate-600/40
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
        className={clsx("tanslate-x-8", {
          "translate-x-6": theme.mode !== "dark",
        })}
      >
        <Icon className="animate-appear" />
      </Slider>
      <Slider
        className={clsx("grid place-items-center tanslate-x-0", {
          "translate-x-6": theme.mode === "dark",
        })}
      >
        <Dot />
      </Slider>
    </Button>
  );
};
