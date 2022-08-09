import { SearchIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { forwardRef, useId } from "react";
import { Input, InputProps } from "../Input";

export type SearchInputProps = Omit<InputProps, "type"> & {
  label?: string;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ containerClassName, id, label, ...props }, ref) => {
    const uid = useId();
    const inputId = `${uid}-${id ?? "search-input"}`;

    return (
      <Input
        aria-label={label}
        type="search"
        ref={ref}
        id={inputId}
        containerClassName={clsx(
          "min-w-[180px] md:min-w-[255px] !h-10 bg-gray-750",
          containerClassName,
        )}
        inputClassName="rounded-md !h-10"
        leadingIcon={<SearchIcon className="h-4 w-4 text-gray-300" />}
        {...props}
      />
    );
  },
);
