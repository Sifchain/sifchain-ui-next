import clsx from "clsx";
import { FC, useState } from "react";

export type TabItem<T> = {
  label: string;
  value: T;
};

export type TabsProps<T> = {
  data: TabItem<T>[];
  selectedIndex: number;
  onChange: (index: number) => void;
  className?: string;
  itemClassName?: string | ((index: number) => string);
};

const PositionIndicator: FC<{
  selectedIndex: number;
  itemWidth: number;
  padding: number;
}> = (props) => {
  const leftOffset = (props.itemWidth - props.padding) * props.selectedIndex;

  return (
    <label
      className="absolute bg-sifgray-600 transition-all rounded translate-x-0 duration-200"
      style={{
        width: props.itemWidth,
        left: props.padding,
        top: props.padding,
        bottom: props.padding,
        transform: `translateX(${leftOffset}px)`,
      }}
    />
  );
};

export function Tabs<T = any>(props: TabsProps<T>) {
  const [containerWidth, setContainerWidth] = useState(0);

  return (
    <label
      ref={(x) => {
        if (x && x.clientWidth !== containerWidth) {
          setContainerWidth(x.clientWidth);
        }
      }}
      className={clsx(
        "relative border p-2 rounded-md bg-sifgray-900 flex",
        props.className,
      )}
    >
      <PositionIndicator
        selectedIndex={props.selectedIndex}
        itemWidth={containerWidth / props.data.length}
        padding={4}
      />
      {props.data.map((item, index) => (
        <button
          key={index}
          className={clsx(
            "flex-1 py-2.5 rounded z-10 font-semibold text-sm",
            index === props.selectedIndex
              ? "text-sifgray-50"
              : "text-sifgray-600",
            typeof props.itemClassName === "function"
              ? props.itemClassName(index)
              : props.itemClassName,
          )}
          onClick={() => props.onChange(index)}
        >
          {item.label}
        </button>
      ))}
    </label>
  );
}
