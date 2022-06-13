import clsx from "clsx";
import { forwardRef, useEffect, ReactNode } from "react";
import tw from "tailwind-styled-components";

import { useSyncedRef } from "../../hooks";

export const StyledInput = tw.input`
  border-gray-700 bg-gray-750 rounded-xl opacity-90 outline-none p-2 px-4
  text-gray-50 text-base md:text-lg
  placeholder:text-gray-300
  focus:ring focus:ring-blue-400/40
  hover:opacity-100 flex-1
  disabled:bg-gray-800 disabled:border-gray-750 disabled:placeholder:text-gray-600
`;

export type InputProps = Omit<JSX.IntrinsicElements["input"], "ref"> & {
  label?: ReactNode | string;
  secondaryLabel?: ReactNode | string;
  hideLabel?: boolean;
  children?: ReactNode;
  fullWidth?: boolean;
  hotkey?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, secondaryLabel, hotkey, hideLabel, fullWidth, children, ...props },
    ref,
  ) => {
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
        className={clsx("relative grid items-center", {
          "max-w-min": !fullWidth,
          "w-full flex-1": fullWidth,
        })}
      >
        {(label || secondaryLabel) && (
          <div className="flex justify-between items-center px-1">
            {label && (
              <span
                className={clsx("text-xs md:text-sm text-gray-200", {
                  "sr-only": hideLabel,
                })}
              >
                {label}
              </span>
            )}
            {secondaryLabel && (
              <span
                className={clsx("text-xs md:text-sm text-gray-300", {
                  "sr-only": hideLabel,
                })}
              >
                {secondaryLabel}
              </span>
            )}
          </div>
        )}
        <div className="relative flex items-center">
          <StyledInput
            aria-label={typeof label === "string" ? label : ""}
            {...props}
            ref={inputRef}
          />
          {children}{" "}
          {hotkey && (
            <span className="absolute text-xs right-3 p-1 ring-1 rounded ring-gray-600 text-gray-300">
              {hotkey}
            </span>
          )}
        </div>
      </label>
    );
  },
);

export const InputButton = tw.button`
  transition-colors
  text-xs font-semibold text-white md:text-md
  bg-gray-600 px-2 py-1
  border-gray-500 rounded
  hover:bg-gray-500 hover:border-gray-300
  active:bg-gray-400 active:border-gray-300
`;
