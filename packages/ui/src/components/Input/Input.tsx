import clsx from "clsx";
import { forwardRef, useEffect, ReactNode } from "react";
import tw from "tailwind-styled-components";

import { useSyncedRef } from "../../hooks";

export const StyledInput = tw.input`
  border-gray-700 bg-gray-750 text-gray-50 rounded-xl opacity-90 outline-none p-2 px-4
  placeholder:text-gray-300
  focus:ring focus:ring-blue-400/40
  hover:opacity-100
`;

export type InputProps = Omit<JSX.IntrinsicElements["input"], "ref"> & {
  label?: string;
  children?: ReactNode;
  fullWidth?: boolean;
  hotkey?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hotkey, fullWidth, children, ...props }, ref) => {
    const inputRef = useSyncedRef<HTMLInputElement>(ref);

    useEffect(() => {
      if (!hotkey) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === hotkey) {
          e.preventDefault();
          e.stopPropagation();
          inputRef.current?.click();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [hotkey, inputRef.current]);

    return (
      <label
        className={clsx("relative flex items-center", {
          "max-w-min": !fullWidth,
        })}
      >
        {label && <span className="sr-only">{label}</span>}
        <StyledInput aria-label={label} {...props} ref={inputRef} />
        {children}{" "}
        {hotkey && (
          <span className="absolute text-xs right-3 p-1 ring-1 rounded ring-gray-600 text-gray-300">
            {hotkey}
          </span>
        )}
      </label>
    );
  },
);
