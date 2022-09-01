import type { PartialDeep } from "type-fest";

import { mergeDeepRight, pathOr } from "rambda";
import { expect, test, describe } from "vitest";

import { syncCacheWithServer, type SyncCacheWithServerInput } from "./syncCacheWithServer";

describe("syncCacheWithServer", () => {
  test("immutable results", () => {
    const { oldData, newData } = setup();
    const test = syncCacheWithServer(oldData, newData);
    expect(oldData === test).toBe(false);
    expect(newData === test).toBe(false);
  });

  test("when server response does not include single optimistic item, default to cache", () => {
    const { oldData, newData } = setup();
    const test = syncCacheWithServer(oldData, newData);
    expect(test.pagination.limit).toBe("17");
    expect(test.pagination.total).toBe("3");
    expect(test.results.length).toBe(3);
  });

  test("when server response includes single optimistic item, default to server response", () => {
    const { oldData, newData } = setup({
      newData: {
        pagination: {
          limit: "16",
          total: "4",
        },
        results: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }],
      },
    });
    const test = syncCacheWithServer(oldData, newData);
    expect(test.pagination.limit).toBe("16");
    expect(test.pagination.total).toBe("4");
    expect(test.results.length).toBe(4);
  });

  test("when server response does not include mutiple optimistic item, default to cache", () => {
    const { oldData, newData } = setup({
      oldData: {
        pagination: {
          limit: "19",
          total: "5",
        },
        results: [
          { id: "1" },
          { id: "2" },
          { id: "3", _optimistic: true },
          { id: "4", _optimistic: true },
          { id: "5", _optimistic: true },
        ],
      },
    });
    const test = syncCacheWithServer(oldData, newData);
    expect(test.pagination.limit).toBe("19");
    expect(test.pagination.total).toBe("5");
    expect(test.results.length).toBe(5);
  });

  test("when server response includes mutiple optimistic item, default to server response", () => {
    const { oldData, newData } = setup({
      oldData: {
        pagination: {
          limit: "19",
          total: "5",
        },
        results: [
          { id: "1" },
          { id: "2" },
          { id: "3", _optimistic: true },
          { id: "4", _optimistic: true },
          { id: "5", _optimistic: true },
        ],
      },
      newData: {
        pagination: {
          limit: "16",
          total: "8",
        },
        results: [
          { id: "1" },
          { id: "2" },
          { id: "3" },
          { id: "4" },
          { id: "5" },
          { id: "6" },
          { id: "7" },
          { id: "8" },
        ],
      },
    });
    const test = syncCacheWithServer(oldData, newData);
    expect(test.pagination.limit).toBe("16");
    expect(test.pagination.total).toBe("8");
    expect(test.results.length).toBe(8);
  });
});

type SetupOptions = {
  oldData?: PartialDeep<SyncCacheWithServerInput>;
  newData?: PartialDeep<SyncCacheWithServerInput>;
};
function setup(options?: SetupOptions) {
  const oldData = mergeDeepRight<SyncCacheWithServerInput>(
    {
      pagination: {
        limit: "17",
        total: "3",
      },
      results: [{ id: "1" }, { id: "2" }, { id: "3", _optimistic: true }],
    },
    pathOr({}, "oldData", options),
  );
  const newData = mergeDeepRight<SyncCacheWithServerInput>(
    {
      pagination: {
        limit: "16",
        total: "2",
      },
      results: [{ id: "1" }, { id: "2" }],
    },
    pathOr({}, "newData", options),
  );
  return { oldData, newData };
}
