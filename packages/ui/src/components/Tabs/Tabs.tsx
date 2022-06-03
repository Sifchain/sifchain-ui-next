import clsx from "clsx";
import { type FC, useState } from "react";

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
  className?: string;
}> = (props) => {
  const leftOffset = (props.itemWidth - props.padding) * props.selectedIndex;

  return (
    <label
      className={clsx(
        "absolute bg-gray-600 transition-all rounded translate-x-0 duration-200",
        {
          "opacity-0": props.selectedIndex === -1,
        },
        props.className,
      )}
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
  const [hoverIndex, setHoverIndex] = useState(-1);

  return (
    <label
      ref={(x) => {
        if (x && x.clientWidth !== containerWidth) {
          setContainerWidth(x.clientWidth);
        }
      }}
      className={clsx(
        "relative border p-2 rounded-md bg-gray-900 flex overflow-hidden",
        props.className,
      )}
    >
      <PositionIndicator
        selectedIndex={hoverIndex}
        itemWidth={containerWidth / props.data.length}
        className={clsx({
          "opacity-40": hoverIndex >= 0,
        })}
        padding={6}
      />
      <PositionIndicator
        selectedIndex={props.selectedIndex}
        itemWidth={containerWidth / props.data.length}
        padding={6}
      />
      {props.data.map((item, index) => (
        <button
          key={index}
          className={clsx(
            "flex-1 py-2.5 rounded z-10 font-semibold text-sm",
            index === props.selectedIndex ? "text-gray-50" : "text-gray-600",
            typeof props.itemClassName === "function"
              ? props.itemClassName(index)
              : props.itemClassName,
          )}
          onClick={props.onChange.bind(null, index)}
          onMouseOver={setHoverIndex.bind(null, index)}
          onMouseLeave={setHoverIndex.bind(null, -1)}
        >
          {item.label}
        </button>
      ))}
    </label>
  );
}
