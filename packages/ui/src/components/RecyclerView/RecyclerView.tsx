import React, { createElement, FC, ReactHTML, useCallback, useMemo, useState } from "react";
import _debounce from "lodash.debounce";
import { debounceRaf } from "../../utils";
import type { StringIndexable } from "../../utils";

export type RecyclerViewProps<
  T extends StringIndexable,
  U extends keyof ReactHTML = "div",
> = JSX.IntrinsicElements[U] & {
  data: T[];
  visibleRows: number;
  rowHeight: number;
  keyExtractor(item: T): string;
  renderItem: FC<JSX.IntrinsicElements[U] & { item: T; id: string }>;
  as?: U;
  debounce?: number | "raf";
};

export const RecyclerView = <T extends StringIndexable, U extends keyof ReactHTML = "div">(
  props: RecyclerViewProps<T, U>,
) => {
  const { data, visibleRows, rowHeight, keyExtractor, as, renderItem: RowItem, debounce, ...containerProps } = props;

  const [startIndex, setStartIndex] = useState(0);

  const lastIndex = data.length - 1;

  const endIndex = useMemo(() => {
    const targetIndex = startIndex + visibleRows;
    return targetIndex >= lastIndex ? lastIndex : targetIndex;
  }, [startIndex, lastIndex, visibleRows]);

  const entries = data as T[];

  const page = useMemo(
    () => entries.slice(startIndex, endIndex + 1).map((item) => ({ key: keyExtractor(item), value: item })),
    [startIndex, endIndex, entries, keyExtractor],
  );

  const handleScroll = useCallback(
    (e: React.UIEvent) => {
      const { scrollTop } = e.target as HTMLDivElement;

      const index = Math.floor((scrollTop ?? 0) / rowHeight);

      if (index !== startIndex) {
        setStartIndex(index);
      }
    },
    [startIndex, setStartIndex, rowHeight],
  );

  const debouncedHandleScroll = useMemo(() => {
    if (typeof debounce === "number") {
      return _debounce(handleScroll, debounce);
    }
    return debounceRaf(handleScroll);
  }, [debounce, handleScroll]);

  const Container = useCallback<FC<JSX.IntrinsicElements[U]>>(
    ({ children, ...props }) => {
      return createElement(as ?? "div", props as JSX.IntrinsicElements[U], [children]);
    },
    [as],
  );

  return (
    <Container
      onScroll={debouncedHandleScroll}
      style={{
        maxHeight: rowHeight * visibleRows,
        overflowY: "scroll",
      }}
      {...containerProps}
    >
      {startIndex > 0 && <div style={{ height: rowHeight * startIndex }} />}
      {page.map(({ key, value }) => {
        return React.cloneElement(<RowItem key={key} id={key} item={value} />, {
          style: { height: rowHeight },
        });
      })}
      {endIndex < lastIndex && <div style={{ height: rowHeight * (lastIndex - endIndex) }} />}
    </Container>
  );
};

RecyclerView.defaultProps = {
  debounce: "raf",
  as: "div",
};

export default RecyclerView;
