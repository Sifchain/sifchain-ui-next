import clsx from "clsx";
import { forwardRef, useEffect, ReactNode, useId } from "react";
import tw from "tailwind-styled-components";

import { useSyncedRef } from "../../hooks";

const SIZE_CLASSES = {
  md: "h-12",
  sm: "h-10",
  xs: "h-9",
};

type InputSize = keyof typeof SIZE_CLASSES;

export const StyledInputContainer = tw.div`
  border-gray-600 bg-gray-700 rounded-md opacity-90 outline-none p-2 px-4
  focus-within:outline-none focus-within:ring focus-within:ring-gray-400/80
  hover:opacity-100 flex-1
  flex items-center gap-1
`;

export const StyledInput = tw.input`
  flex-1 p-0
  bg-transparent outline-none border-none focus:ring-transparent
  [&::-webkit-inner-spin-button]:appearance-none
  [&::-webkit-outer-spin-button]:appearance-none
  text-gray-50 text-base md:text-lg
  placeholder:text-gray-300
  disabled:placeholder:text-gray-600
`;

export const HotKey = tw.span`
  absolute text-xs right-3 px-1.5 py-0.5 font-normal rounded-sm bg-gray-700 text-gray-300
`;

export type InputProps = Omit<JSX.IntrinsicElements["input"], "ref" | "children" | "className"> & {
  label?: ReactNode | string;
  secondaryLabel?: ReactNode | string;
  hideLabel?: boolean;
  leadingIcon?: ReactNode | string;
  trailingIcon?: ReactNode | string;
  hotkey?: string;
  containerClassName?: string;
  inputClassName?: string;
  fullWidth?: boolean;
  size?: InputSize;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      secondaryLabel,
      leadingIcon,
      trailingIcon,
      hotkey,
      hideLabel,
      containerClassName,
      inputClassName,
      size,
      fullWidth,
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
          "w-full": fullWidth,
        })}
      >
        {(label || secondaryLabel) && (
          <label htmlFor={id} className="flex items-center justify-between">
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
        <StyledInputContainer className={clsx(containerClassName, SIZE_CLASSES[size ?? "md"])}>
          {leadingIcon}
          <StyledInput
            aria-label={typeof label === "string" ? label : ""}
            {...props}
            className={clsx("disabled:bg-gray-800", inputClassName)}
            style={{ appearance: "textfield", ...props.style }}
            id={id}
            ref={inputRef}
          />
          {trailingIcon}
          {Boolean(hotkey) && <HotKey>{hotkey}</HotKey>}
        </StyledInputContainer>
      </div>
    );
  },
);
