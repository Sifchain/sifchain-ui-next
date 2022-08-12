/**
 * ********************************************************************************************
 *
 * Utilities for Open Positions and History Tables Compounds
 *
 * ********************************************************************************************
 */

/**
 * Transform a column name "Unrealized P&L" into a slug/key "unrealizedPL"
 */
export function fromColNameToItemKey(name: string) {
  const slug = name.replace(/\W/g, "");
  return slug.charAt(0).toLowerCase() + slug.slice(1);
}

/**
 * Pagination constants and helpers
 */
export const SORT_BY = {
  ASC: "asc",
  DESC: "desc",
};
export const QS_DEFAULTS = {
  limit: "30",
  offset: "0",
  sortBy: SORT_BY.DESC,
};
export const MARGIN_POSITION = {
  UNSPECIFIED: "UNSPECIFIED",
  LONG: "LONG",
  SHORT: "SHORT",
};

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
