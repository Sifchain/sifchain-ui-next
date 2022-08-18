import { useQuery, useMutation } from "react-query";

type TCache = {
  openPositions: undefined | ReturnType<typeof createOpenPositionsRow>[];
  history: undefined | ReturnType<typeof createHistoryRow>[];
};
const cache: TCache = {
  openPositions: undefined,
  history: undefined,
};

export function useMutationConfirmOpenPosition() {
  return useMutation((position: { id: string }) => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        if (rand(30) > 10) {
          res(position);
        } else {
          rej(new Error("Something when wrong"));
        }
      }, 1000);
    });
  });
}
export function useMutationPositionToClose() {
  return useMutation((position: { id: string }) => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        if (rand(30) > 10) {
          res(position);
        } else {
          rej(new Error("Something when wrong"));
        }
      }, 1000);
    });
  });
}
export function useQueryPositionToClose(params: { id: string }) {
  return useQuery<{ id: string }, Error>(
    ["PositionToClose", params.id],
    () =>
      new Promise((res, rej) => {
        setTimeout(() => {
          if (rand(30) > 10) {
            res({ id: params.id });
          } else {
            rej(new Error("Something when wrong"));
          }
        }, 1000);
      }),
    { enabled: Boolean(params.id), retry: false },
  );
}

export function useQueryOpenPositions(queryParams: { limit: string; offset: string; orderBy: string; sortBy: string }) {
  let maybeCacheResults = cache.openPositions;

  if (typeof maybeCacheResults === "undefined") {
    const data = createFakeOpenPositions({
      limit: Number(queryParams.limit),
    });
    maybeCacheResults = data;
    cache.openPositions = data;
  }

  const results = maybeCacheResults;

  const paginatedResults = results.slice(
    Number(queryParams.offset),
    Number(queryParams.offset) + Number(queryParams.limit),
  );

  const query = () =>
    new Promise((res) => {
      setTimeout(() => {
        res({
          pagination: {
            total: `${results.length}`,
            limit: queryParams.limit,
            offset: queryParams.offset,
            orderBy: queryParams.orderBy,
            sortBy: queryParams.sortBy,
          },
          results: paginatedResults,
        });
      }, 2000);
    }) as Promise<{
      pagination: {
        total: string;
        limit: string;
        offset: string;
        orderBy: string;
        sortBy: string;
      };
      results: ReturnType<typeof createOpenPositionsRow>[];
    }>;
  return useQuery(["OpenPositions", queryParams], query, {
    keepPreviousData: true,
  });
}

export function useQueryHistory(queryParams: { limit: string; offset: string; orderBy: string; sortBy: string }) {
  let maybeCacheResults = cache.history;

  if (typeof maybeCacheResults === "undefined") {
    const data = createFakeHistory({
      limit: Number(queryParams.limit),
    });
    maybeCacheResults = data;
    cache.history = data;
  }

  const results = maybeCacheResults;

  const paginatedResults = results.slice(
    Number(queryParams.offset),
    Number(queryParams.offset) + Number(queryParams.limit),
  );

  const query = () =>
    new Promise((res) => {
      setTimeout(() => {
        res({
          pagination: {
            total: `${results.length}`,
            limit: queryParams.limit,
            offset: queryParams.offset,
            orderBy: queryParams.orderBy,
            sortBy: queryParams.sortBy,
          },
          results: paginatedResults,
        });
      }, 2000);
    }) as Promise<{
      pagination: {
        total: string;
        limit: string;
        offset: string;
        orderBy: string;
        sortBy: string;
      };
      results: ReturnType<typeof createHistoryRow>[];
    }>;
  return useQuery(["History", queryParams], query, {
    keepPreviousData: true,
  });
}

function createFakeOpenPositions({ limit, multi = 3.725 }: { limit: number; multi?: number }) {
  return Array.from({ length: Number(limit) * multi }, (_, index) => createOpenPositionsRow(index++));
}
function createFakeHistory({ limit, multi = 3.725 }: { limit: number; multi?: number }) {
  return Array.from({ length: Number(limit) * multi }, (_, index) => createHistoryRow(index++));
}

function rand(range: number) {
  return Math.floor(Math.random() * range);
}

function createOpenPositionsRow(index: number) {
  const sides = ["0", "1", "2"];
  const amounts = ["11.5432", "-32.9832", "8192331"];
  const unrealizedPLs = ["32.5432", "-2000.15"];
  return {
    id: `${Math.random().toString(16).slice(2)}.${index}`,
    pool: "ETH",
    side: sides[rand(3)] as string,
    asset: "ETH",
    amount: amounts[rand(3)] as string,
    baseLeverage: `${Math.random() * 2}`,
    unrealizedPL: unrealizedPLs[rand(2)] as string,
    interestRate: `${Math.random() * 0.1}`,
    unsettledInterest: "12893",
    nextPayment: new Date(),
    paidInterest: "81273",
    health: `${Math.random()}`,
    dateOpened: new Date(),
    timeOpen: new Date(),
  };
}

function createHistoryRow(index: number) {
  const sides = ["0", "1", "2"];
  const amounts = ["11.5432", "-32.9832", "8192331"];
  const realizedPLs = ["32.5432", "-2000.15"];
  return {
    id: `${Math.random().toString(16).slice(2)}.${index}`,
    dateClosed: new Date(),
    timeOpen: new Date(),
    pool: "ETH",
    side: sides[rand(3)] as string,
    asset: "ETH",
    amount: amounts[rand(3)] as string,
    realizedPL: realizedPLs[rand(2)] as string,
  };
}
