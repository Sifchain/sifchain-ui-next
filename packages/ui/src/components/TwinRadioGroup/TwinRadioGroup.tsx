import type { FC } from "react";

import { useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";

export type TwinRadioGroup = {
  className?: string;
  name: string;
  onChange?: undefined | null | ((value: string) => void);
  options: { title: string; value: string }[];
  value?: string;
};

export const TwinRadioGroup: FC<TwinRadioGroup> = (props) => {
  let initialValue = props.value;

  if (typeof initialValue === "undefined") {
    const head = props.options[0] as TwinRadioGroup["options"][0];
    initialValue = head.value;
  }

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (initialValue && initialValue !== value) {
      setValue(initialValue);
    }
  }, [initialValue]);

  return (
    <RadioGroup
      className={clsx("grid grid-cols-2 w-full font-semibold", props.className)}
      value={value}
      onChange={(option: string) => {
        if (props.onChange) {
          props.onChange(option);
        } else {
          setValue(option);
        }
      }}
      name={props.name}
    >
      {props.options.map((item, index) => {
        const rounded =
          index === 0 ? "rounded-tl rounded-bl" : "rounded-tr rounded-br";
        return (
          <RadioGroup.Option
            key={item.value}
            value={item.value}
            className={({ checked, active }) =>
              clsx(
                "p-2 text-center cursor-pointer",
                rounded,
                checked
                  ? "bg-gray-500 text-gray-200 z-10"
                  : "bg-gray-850 text-gray-700",
                active ? "ring-1 ring-indigo-500" : "",
                "hover:ring-1 hover:ring-indigo-300 hover:z-20",
              )
            }
          >
            {item.title}
          </RadioGroup.Option>
        );
      })}
    </RadioGroup>
  );
};
