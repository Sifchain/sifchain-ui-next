import { SearchIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { FC, forwardRef, useId } from "react";

export type SearchInputProps = Omit<JSX.IntrinsicElements["input"], "type"> & {
  label?: string;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, id, label, ...props }, ref) => {
    const uid = useId();
    const inputId = `${uid}-${id ?? "search-input"}`;

    return (
      <label className="relative flex items-center" htmlFor={inputId}>
        <input
          aria-label={label}
          type="search"
          ref={ref}
          id={inputId}
          className={clsx(
            "border-gray-700 bg-gray-750 text-gray-50 placeholder:text-gray-300 rounded-xl opacity-90 pl-8 outline-none",
            "hover:opacity-100 focus:ring focus:ring-blue-400/40",
          )}
          {...props}
        />
        <SearchIcon className="absolute top-3 left-3 h-4 w-4 text-gray-300" />
      </label>
    );
  },
);
