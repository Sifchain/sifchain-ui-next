import type { PartialDeep } from "type-fest";

import { mergeDeepRight, pathOr } from "rambda";
import { expect, test, describe } from "vitest";

import {
  syncOptimisticHistoryWithPositions,
  type SyncOptimisticHistoryWithPositionsInput,
} from "./syncOptimisticHistoryWithPositions";

describe("syncOptimisticHistoryWithPositions", () => {
  test("immutable results", () => {
    const { optimisticHistory, positions } = setup();
    const test = syncOptimisticHistoryWithPositions(optimisticHistory, positions);
    expect(optimisticHistory === test).toBe(false);
    expect(positions === test).toBe(false);
  });

  test("remove single item from positions", () => {
    const { optimisticHistory, positions } = setup();

    const test = syncOptimisticHistoryWithPositions(optimisticHistory, positions);

    expect(positions.pagination.limit).toBe("16");
    expect(positions.pagination.total).toBe("3");
    expect(positions.results.length).toBe(3);

    expect(test.pagination.limit).toBe("15");
    expect(test.pagination.total).toBe("2");
    expect(test.results.length).toBe(2);
  });

  test("remove multiple items from positions", () => {
    const { optimisticHistory, positions } = setup({
      optimisticHistory: {
        results: [{ id: "1" }, { id: "2" }],
      },
    });

    const test = syncOptimisticHistoryWithPositions(optimisticHistory, positions);

    expect(positions.pagination.limit).toBe("16");
    expect(positions.pagination.total).toBe("3");
    expect(positions.results.length).toBe(3);

    expect(test.pagination.limit).toBe("14");
    expect(test.pagination.total).toBe("1");
    expect(test.results.length).toBe(1);
  });
});

type SetupOptions = {
  optimisticHistory?: PartialDeep<SyncOptimisticHistoryWithPositionsInput>;
  positions?: PartialDeep<SyncOptimisticHistoryWithPositionsInput>;
};
function setup(options?: SetupOptions) {
  const optimisticHistory = mergeDeepRight<SyncOptimisticHistoryWithPositionsInput>(
    {
      results: [{ id: "2" }],
    },
    pathOr({}, "optimisticHistory", options),
  );
  const positions = mergeDeepRight<SyncOptimisticHistoryWithPositionsInput>(
    {
      pagination: {
        limit: "16",
        total: "3",
      },
      results: [{ id: "1" }, { id: "2" }, { id: "3", _optimistic: true }],
    },
    pathOr({}, "positions", options),
  );
  return { optimisticHistory, positions };
}
