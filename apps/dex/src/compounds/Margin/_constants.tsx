export const QS_DEFAULTS = {
  page: "1",
  limit: "30",
  orderBy: "",
  sortBy: "desc",
};

export const SORT_BY = {
  ASC: "asc",
  DESC: "desc",
};
export const MARGIN_POSITION: Record<string, string> = {
  "0": "Unspecified",
  "1": "Long",
  "2": "Short",
};

export function fromColNameToItemKey(name: string) {
  const slug = name.replace(/\W/g, "");
  return slug.charAt(0).toLowerCase() + slug.slice(1);
}

type FindNextOrderAndSortByProps = {
  itemActive: boolean;
  itemKey: string;
  currentSortBy: string;
};
export function findNextOrderAndSortBy({
  itemActive,
  itemKey,
  currentSortBy,
}: FindNextOrderAndSortByProps) {
  let nextSortBy = SORT_BY.DESC;
  let nextOrderBy = itemKey;

  if (itemActive) {
    nextSortBy = currentSortBy;
  }

  if (itemActive && nextSortBy === SORT_BY.ASC) {
    nextOrderBy = "";
    nextSortBy = "";
  }

  if (itemActive && nextSortBy === SORT_BY.DESC) {
    nextSortBy = SORT_BY.ASC;
  }

  return { nextOrderBy, nextSortBy };
}
