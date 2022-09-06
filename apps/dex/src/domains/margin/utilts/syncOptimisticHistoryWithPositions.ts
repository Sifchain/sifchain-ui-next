import type { Pagination } from "../hooks";

export type SyncOptimisticHistoryWithPositionsInput = {
  pagination: Pagination;
  results: { id: string; _optimistic: boolean }[];
};
export function syncOptimisticHistoryWithPositions<
  T extends SyncOptimisticHistoryWithPositionsInput,
  J extends SyncOptimisticHistoryWithPositionsInput,
>(optimisticHistory: { results: T["results"] }, positions: J) {
  const draft = { results: [...positions.results], pagination: { ...positions.pagination } };
  const newDataIds = positions.results.map((x) => x.id);
  const optimisticClosedMatch = optimisticHistory.results.filter((x) => newDataIds.includes(x.id));

  if (optimisticClosedMatch.length) {
    const idsToRemove = optimisticClosedMatch.map((x) => x.id);
    const mergedDiff = draft.results.filter((x) => !idsToRemove.includes(x.id));
    draft.results = mergedDiff;
    draft.pagination.total = String(mergedDiff.length);
    draft.pagination.limit = String(Number(positions.pagination.limit) - optimisticClosedMatch.length);
    return draft;
  }

  return draft;
}
