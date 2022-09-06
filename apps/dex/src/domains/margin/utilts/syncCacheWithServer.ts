import type { Pagination } from "../hooks";

export type SyncCacheWithServerInput = {
  pagination: Pagination;
  results: { id: string; _optimistic: boolean }[];
};
export function syncCacheWithServer<T extends SyncCacheWithServerInput>(
  oldData: { results: T["results"] },
  newData: T,
) {
  const draft = { results: [...newData.results], pagination: { ...newData.pagination } };
  const newDataIds = newData.results.map((x) => x.id);
  const oldDataDiff = oldData.results.filter((x) => !newDataIds.includes(x.id) && x._optimistic);

  if (oldDataDiff.length) {
    const mergedDiff = oldDataDiff.concat(newData.results);
    draft.results = mergedDiff;
    draft.pagination.total = String(mergedDiff.length);
    draft.pagination.limit = String(Number(newData.pagination.limit) + oldDataDiff.length);
    return draft;
  }

  return draft;
}
