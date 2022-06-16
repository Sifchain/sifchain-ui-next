import clsx from "clsx";
import { type FC, useState } from "react";

export type Option<T> = {
  label: string;
  value: T;
};

export type ButtonGroupProps<T> = {
  options: Option<T>[];
  selectedIndex: number;
  onChange: (index: number) => void;
  className?: string;
  itemClassName?: string | ((index: number) => string);
  size?: "sm" | "md";
  gap?: number;
};

type IndicatorProps = {
  selectedIndex: number;
  itemWidth: number;
  padding: number;
  gap: number;
  className?: string;
};

const Indicator: FC<IndicatorProps> = (props) => {
  const leftOffset = (props.itemWidth - props.padding) * props.selectedIndex;

  return (
    <span
      className={clsx(
        "absolute bg-gray-600 transition-all rounded translate-x-0 duration-200 scale-x-75 origin-center",
        {
          "opacity-0": props.selectedIndex === -1,
        },
        props.className,
      )}
      style={{
        width: props.itemWidth - 2 * props.gap,
        left: props.padding + props.gap,
        top: props.padding,
        bottom: props.padding,
        transform: `translateX(${leftOffset}px)`,
      }}
    />
  );
};

export function ButtonGroup<T = any>(props: ButtonGroupProps<T>) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(-1);

  const itemWidth = containerWidth / props.options.length;

  return (
    <label
      ref={(x) => {
        if (x && x.clientWidth !== containerWidth) {
          setContainerWidth(x.clientWidth);
        }
      }}
      className={clsx(
        "relative p-2 rounded-md bg-gray-900 flex overflow-hidden",
        props.className,
      )}
    >
      <Indicator
        selectedIndex={hoverIndex}
        itemWidth={itemWidth}
        className={clsx({
          "opacity-40": hoverIndex >= 0,
        })}
        padding={6}
        gap={props.gap ?? 0}
      />
      <Indicator
        selectedIndex={props.selectedIndex}
        itemWidth={itemWidth}
        padding={6}
        gap={props.gap ?? 0}
      />
      <div className="flex flex-1 gap-2">
        {props.options.map((item, index) => (
          <button
            key={index}
            className={clsx(
              "flex-1 py-2.5 rounded-md z-10 font-semibold",
              index === props.selectedIndex ? "text-gray-50" : "text-gray-300",
              typeof props.itemClassName === "function"
                ? props.itemClassName(index)
                : props.itemClassName,
              {
                "text-sm": props.size === "md",
                "text-xs": props.size === "sm",
              },
            )}
            onClick={props.onChange.bind(null, index)}
            onMouseOver={setHoverIndex.bind(null, index)}
            onMouseLeave={setHoverIndex.bind(null, -1)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </label>
  );
}

ButtonGroup.defaultProps = {
  size: "md",
  gap: 10,
};
