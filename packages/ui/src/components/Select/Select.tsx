import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import { indexBy, prop } from "rambda";
import { FC, Fragment, ReactNode, useMemo } from "react";
import tw from "tailwind-styled-components";
import { ChevronDownIcon } from "../icons";

const StyledListboxButton = tw.button`
  relative w-full cursor-default rounded-lg bg-gray-700 
  p-2 px-4 text-left shadow-md focus:outline-none 
  focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white 
  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 
  sm:text-sm text-gray-50
`;

const StyledOptionsContainer = tw.ul`
  absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 
  text-base text-gray-50 
  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm
`;

export type SelectOption = {
  id: string;
  label: string;
  body: ReactNode | string;
};

export type SelectProps = {
  value?: SelectOption | undefined;
  onChange: (value: SelectOption) => void;
  options: SelectOption[];
  label?: string;
  className?: string;
};

export const Select: FC<SelectProps> = (props) => {
  const indexedById = useMemo(
    () => indexBy(prop("id"), props.options),
    [props.options],
  );
  const selected = useMemo(
    () => indexedById[props.value?.id ?? ""],
    [props.value, indexedById],
  );
  return (
    <Listbox value={props.value} onChange={props.onChange}>
      <div className={["relative mt-1", props.className].join("")}>
        {props.label && (
          <Listbox.Label className="text-gray-200 text-sm pl-4">
            {props.label}
          </Listbox.Label>
        )}
        <Listbox.Button as={StyledListboxButton}>
          <span className="block truncate">{selected?.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <ChevronDownIcon
              className="h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options as={StyledOptionsContainer}>
            {props.options.map((option, optionIdx) => (
              <Listbox.Option
                key={optionIdx}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-amber-100 text-amber-900" : "text-gray-50"
                  }`
                }
                value={option}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option.body}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
