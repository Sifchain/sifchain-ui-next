import { useCallback, useMemo, useState } from "react";

export function useSortedArray<T>(tokens: T[], defaulSortKey: keyof T) {
  const [sortKey, setSortKey] = useState<keyof T>(defaulSortKey);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    const sorted = [...tokens].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue === bValue) {
        return 0;
      }
      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      return sortDirection === "asc" ? 1 : -1;
    });
    return sorted;
  }, [sortKey, sortDirection, tokens]);

  const handleSortClick = useCallback(
    (key: keyof T) => {
      if (sortKey === key) {
        setSortDirection((x) => (x === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDirection("asc");
      }
    },
    [sortKey],
  );

  return { sorted, sortKey, sortDirection, sort: handleSortClick };
}
