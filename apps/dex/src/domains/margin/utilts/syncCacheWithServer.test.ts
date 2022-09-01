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

  test.only("when server response does not include optimistic item, default to cache", () => {
    const { oldData, newData } = setup();
    const test = syncCacheWithServer(oldData, newData);
    expect(test.pagination.limit).toBe("17");
    expect(test.pagination.total).toBe("3");
    expect(test.results.length).toBe(3);
  });

  test("when server response includes optimistic item, default to server response", () => {
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
        offset: "",
        order_by: "",
        sort_by: "",
      },
      results: [{ id: "1" }, { id: "2" }, { id: "3" }],
    },
    pathOr({}, "oldData", options),
  );
  const newData = mergeDeepRight<SyncCacheWithServerInput>(
    {
      pagination: {
        limit: "16",
        total: "2",
        offset: "",
        order_by: "",
        sort_by: "",
      },
      results: [{ id: "1" }, { id: "2" }],
    },
    pathOr({}, "newData", options),
  );
  return { oldData, newData };
}
