import clsx from "clsx";
import { type FC, useState } from "react";

export type ButtonGroupOption<T> = {
  label: string;
  value: T;
  disabled?: boolean;
};

export type ButtonGroupProps<T> = {
  options: ButtonGroupOption<T>[];
  selectedIndex?: number;
  onChange: (index: number) => void;
  className?: string;
  itemClassName?: string | ((index: number) => string);
  size?: "sm" | "md";
  gap?: number;
};

type IndicatorProps = {
  selectedIndex?: number;
  itemWidth: number;
  padding: number;
  gap: number;
  className?: string;
  optionsLength: number;
};

const Indicator: FC<IndicatorProps> = (props) => {
  if (props.selectedIndex === undefined) return null;

  const leftOffset = (props.itemWidth - props.padding) * props.selectedIndex;

  return (
    <span
      className={clsx(
        "absolute origin-center translate-x-0 scale-x-75 rounded-md bg-gray-600 ring-2 transition-all duration-200",
        {
          "opacity-0": props.selectedIndex === -1,
        },
        props.className,
      )}
      style={{
        width: props.itemWidth - props.gap,
        left: props.padding + props.selectedIndex * (props.gap / 2),
        top: props.padding,
        bottom: props.padding,
        transform: `translateX(${leftOffset}px)`,
      }}
    />
  );
};

export function ButtonGroup<T = unknown>(props: ButtonGroupProps<T>) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(-1);

  const itemWidth = containerWidth / props.options.length;

  return (
    <div
      ref={(x) => {
        if (x && x.clientWidth !== containerWidth) {
          setContainerWidth(x.clientWidth);
        }
      }}
      className={clsx("relative flex overflow-hidden rounded-lg bg-gray-800 p-1.5", props.className)}
    >
      <Indicator
        selectedIndex={hoverIndex}
        optionsLength={props.options.length}
        itemWidth={itemWidth}
        className={clsx({
          "opacity-40": hoverIndex >= 0,
        })}
        padding={6}
        gap={props.gap ?? 0}
      />
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore:next-line */}
      <Indicator
        selectedIndex={props.selectedIndex}
        optionsLength={props.options.length}
        itemWidth={itemWidth}
        padding={6}
        gap={props.gap ?? 0}
      />
      <div className="relative flex flex-1 gap-2">
        {props.options.map((item, index) => (
          <button
            key={index}
            type="button"
            className={clsx(
              "flex-1 rounded-xl py-2.5 font-semibold disabled:cursor-not-allowed",
              index === props.selectedIndex ? "text-gray-50" : item.disabled ? "text-gray-750" : "text-gray-300",
              typeof props.itemClassName === "function" ? props.itemClassName(index) : props.itemClassName,
              {
                "text-sm": props.size === "md",
                "text-xs": props.size === "sm",
              },
            )}
            onClick={props.onChange.bind(null, index)}
            onMouseOver={setHoverIndex.bind(null, index)}
            onMouseLeave={setHoverIndex.bind(null, -1)}
            disabled={item.disabled}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

ButtonGroup.defaultProps = {
  size: "md",
  gap: 10,
};
