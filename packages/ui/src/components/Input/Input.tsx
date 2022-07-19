import clsx from "clsx";
import { forwardRef, useEffect, ReactNode } from "react";
import tw from "tailwind-styled-components";

import { useSyncedRef } from "../../hooks";

export const StyledInputContainer = tw.div`
  border-gray-600 bg-gray-700 rounded-md opacity-90 outline-none p-2 px-4
  focus:ring focus:ring-blue-400/40
  hover:opacity-100 flex-1
  flex items-center gap-1
`;

export const StyledInput = tw.input`
  flex-1
  bg-transparent outline-none
  text-gray-50 text-base md:text-lg
  placeholder:text-gray-300
  disabled:placeholder:text-gray-600
`;

export type InputProps = Omit<
  JSX.IntrinsicElements["input"],
  "ref" | "children"
> & {
  label?: ReactNode | string;
  secondaryLabel?: ReactNode | string;
  hideLabel?: boolean;
  fullWidth?: boolean;
  leadingIcon?: ReactNode | string;
  hotkey?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      secondaryLabel,
      leadingIcon,
      hotkey,
      hideLabel,
      fullWidth,
      ...props
    },
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
          <StyledInputContainer
            className={clsx([
              {
                "bg-gray-800 border-gray-750": props.disabled,
              },
              props.className,
            ])}
          >
            {leadingIcon && <div className="-ml-2">{leadingIcon}</div>}
            <StyledInput
              aria-label={typeof label === "string" ? label : ""}
              {...props}
              ref={inputRef}
            />
            {hotkey && (
              <span className="text-xs right-3 p-1 ring-1 rounded ring-gray-600 text-gray-300">
                {hotkey}
              </span>
            )}
          </StyledInputContainer>
        </div>
      </label>
    );
  },
);
