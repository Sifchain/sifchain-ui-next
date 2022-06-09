import { SearchIcon } from "@heroicons/react/outline";
import { forwardRef, useId } from "react";
import { Input, InputProps } from "../Input";

export type SearchInputProps = Omit<InputProps, "type"> & {
  label?: string;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, id, label, ...props }, ref) => {
    const uid = useId();
    const inputId = `${uid}-${id ?? "search-input"}`;

    return (
      <Input
        aria-label={label}
        type="search"
        ref={ref}
        id={inputId}
        className="pl-8"
        {...props}
      >
        <SearchIcon className="absolute top-0.5 left-3 h-4 w-4 text-gray-300" />
      </Input>
    );
  },
);
