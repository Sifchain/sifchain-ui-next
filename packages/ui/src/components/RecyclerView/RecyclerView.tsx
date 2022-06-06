import React, {
  createElement,
  FC,
  ReactElement,
  ReactHTML,
  useCallback,
  useMemo,
  useState,
} from "react";
import _debounce from "lodash.debounce";
import { debounceRaf } from "../../utils/functions";

export type RecyclerViewProps<
  T extends {},
  U extends keyof ReactHTML = "div",
> = JSX.IntrinsicElements[U] & {
  data: T[];
  visibleRows: number;
  rowHeight: number;
  keyExtractor(item: T): string;
  renderItem(item: T, key: string): ReactElement;
  as?: U;
  debounce?: number | "raf";
};

export const RecyclerView = <T extends {}, U extends keyof ReactHTML = "div">(
  props: RecyclerViewProps<T, U>,
) => {
  const {
    data,
    visibleRows,
    rowHeight,
    keyExtractor,
    renderItem,
    as,
    debounce,
    ...containerProps
  } = props;

  const [startIndex, setStartIndex] = useState(0);

  const lastIndex = data.length - 1;

  const endIndex = useMemo(() => {
    const targetIndex = startIndex + visibleRows;
    return targetIndex >= lastIndex ? lastIndex : targetIndex;
  }, [startIndex, lastIndex, visibleRows]);

  const entries = data as T[];

  const page = useMemo(
    () =>
      entries
        .slice(startIndex, endIndex + 1)
        .map((item) => ({ key: keyExtractor(item), value: item })),
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
    if (typeof props.debounce === "number") {
      return _debounce(handleScroll, props.debounce);
    }
    return debounceRaf(handleScroll);
  }, [props.debounce, handleScroll]);

  const Container = useCallback<FC<JSX.IntrinsicElements[U]>>(
    ({ children, ...props }) => {
      return createElement(as ?? "div", props as JSX.IntrinsicElements[U], [
        children,
      ]);
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
      {page.map((item) =>
        React.cloneElement(renderItem(item.value, item.key), {
          key: item.key,
          style: {
            height: rowHeight,
          },
        }),
      )}
      {endIndex < lastIndex && (
        <div style={{ height: rowHeight * (lastIndex - endIndex) }} />
      )}
    </Container>
  );
};

RecyclerView.defaultProps = {
  debounce: "raf",
  as: "div",
};

export default RecyclerView;
