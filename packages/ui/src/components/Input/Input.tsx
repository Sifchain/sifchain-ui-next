import clsx from "clsx";
import { forwardRef, useEffect, ReactNode, useId } from "react";
import tw from "tailwind-styled-components";

import { useSyncedRef } from "../../hooks";

export const StyledInputContainer = tw.div`
  relative flex items-center h-12
`;

export const StyledInput = tw.input`
  appearance-none input absolute inset-0 border-none outline-none 
  focus:outline-none focus:ring ring-gray-400/80  h-12 w-full
`;

export type InputProps = Omit<
  JSX.IntrinsicElements["input"],
  "ref" | "children" | "className"
> & {
  label?: ReactNode | string;
  secondaryLabel?: ReactNode | string;
  hideLabel?: boolean;
  leadingIcon?: ReactNode | string;
  hotkey?: string;
  containerClassName?: string;
  inputClassName?: string;
  fullWidth?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      secondaryLabel,
      leadingIcon,
      hotkey,
      hideLabel,
      containerClassName,
      inputClassName,
      ...props
    },
    ref,
  ) => {
    const id = useId();
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
      <div
        className={clsx("relative grid gap-1", {
          "w-full": props.fullWidth,
        })}
      >
        {(label || secondaryLabel) && (
          <label htmlFor={id} className="flex justify-between items-center">
            {label && (
              <span
                className={clsx("input-label", {
                  "sr-only": hideLabel,
                })}
              >
                {label}
              </span>
            )}
            {secondaryLabel && (
              <span
                className={clsx("input-label text-gray-300", {
                  "sr-only": hideLabel,
                })}
              >
                {secondaryLabel}
              </span>
            )}
          </label>
        )}
        <StyledInputContainer className={containerClassName}>
          {leadingIcon && (
            <div className="translate-x-2 z-10">{leadingIcon}</div>
          )}
          <StyledInput
            aria-label={typeof label === "string" ? label : ""}
            {...props}
            className={clsx("disabled:bg-gray-800", inputClassName)}
            style={{ appearance: "textfield", ...props.style }}
            id={id}
            ref={inputRef}
          />
          {hotkey && (
            <span className="text-xs right-3 p-1 ring-1 rounded ring-gray-600 text-gray-300">
              {hotkey}
            </span>
          )}
        </StyledInputContainer>
      </div>
    );
  },
);
