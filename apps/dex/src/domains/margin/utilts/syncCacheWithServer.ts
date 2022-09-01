import type { Pagination } from "../hooks";

import { mergeDeepRight } from "rambda";

export type SyncCacheWithServerInput = {
  pagination: Pagination;
  results: { id: string }[];
};
export function syncCacheWithServer<T extends SyncCacheWithServerInput>(oldData: T, newData: T) {
  const draft = mergeDeepRight<T>({}, newData);
  const newDataIds = newData.results.map((x) => x.id);
  const oldDataDiff = oldData.results.filter((x) => !newDataIds.includes(x.id));

  if (oldDataDiff.length) {
    const mergedDiff = oldDataDiff.concat(newData.results);
    draft.results = mergedDiff;
    draft.pagination.total = String(mergedDiff.length);
    draft.pagination.limit = String(Number(newData.pagination.limit) + oldDataDiff.length);
    return draft;
  }

  return draft;
}
