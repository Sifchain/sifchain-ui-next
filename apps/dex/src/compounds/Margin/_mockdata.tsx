import { useQuery } from "react-query";

type TCache = {
  openPositions: undefined | ReturnType<typeof createOpenPositionsRow>[];
  history: undefined | ReturnType<typeof createHistoryRow>[];
};
const cache: TCache = {
  openPositions: undefined,
  history: undefined,
};

export function useQueryOpenPositions(queryParams: {
  limit: string;
  page: string;
  orderBy: string;
  sortBy: string;
}) {
  let maybeCacheResults = cache.openPositions;

  if (typeof maybeCacheResults === "undefined") {
    const data = createFakeOpenPositions({
      limit: Number(queryParams.limit),
    });
    maybeCacheResults = data;
    cache.openPositions = data;
  }

  const results = maybeCacheResults;

  const pages = Math.ceil(Number(results.length) / Number(queryParams.limit));
  const page =
    Number(queryParams.page) > pages ? pages : Number(queryParams.page);
  const paginatedResults = results.slice(
    (page - 1) * Number(queryParams.limit),
    Number(queryParams.limit) * page,
  );

  const query = () =>
    new Promise((res) => {
      setTimeout(() => {
        res({
          pagination: {
            total: `${results.length}`,
            limit: queryParams.limit,
            pages: `${pages}`,
            page: `${page}`,
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
        pages: string;
        page: string;
        orderBy: string;
        sortBy: string;
      };
      results: ReturnType<typeof createOpenPositionsRow>[];
    }>;
  return useQuery(["OpenPositions", queryParams], query, {
    keepPreviousData: true,
  });
}

export function useQueryHistory(queryParams: {
  limit: string;
  page: string;
  orderBy: string;
  sortBy: string;
}) {
  let maybeCacheResults = cache.history;

  if (typeof maybeCacheResults === "undefined") {
    const data = createFakeHistory({
      limit: Number(queryParams.limit),
    });
    maybeCacheResults = data;
    cache.history = data;
  }

  const results = maybeCacheResults;

  const pages = Math.ceil(Number(results.length) / Number(queryParams.limit));
  const page =
    Number(queryParams.page) > pages ? pages : Number(queryParams.page);
  const paginatedResults = results.slice(
    (page - 1) * Number(queryParams.limit),
    Number(queryParams.limit) * page,
  );

  const query = () =>
    new Promise((res) => {
      setTimeout(() => {
        res({
          pagination: {
            total: `${results.length}`,
            limit: queryParams.limit,
            pages: `${pages}`,
            page: `${page}`,
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
        pages: string;
        page: string;
        orderBy: string;
        sortBy: string;
      };
      results: ReturnType<typeof createHistoryRow>[];
    }>;
  return useQuery(["History", queryParams], query, {
    keepPreviousData: true,
  });
}

function createFakeOpenPositions({
  limit,
  multi = 3.725,
}: {
  limit: number;
  multi?: number;
}) {
  return Array.from({ length: Number(limit) * multi }, () =>
    createOpenPositionsRow(),
  );
}
function createFakeHistory({
  limit,
  multi = 3.725,
}: {
  limit: number;
  multi?: number;
}) {
  return Array.from({ length: Number(limit) * multi }, () =>
    createHistoryRow(),
  );
}

function rand(range: number) {
  return Math.floor(Math.random() * range);
}

function createOpenPositionsRow() {
  const sides = ["0", "1", "2"];
  const amounts = ["11.5432", "-32.9832", "8192331"];
  const unrealizedPLs = ["32.5432", "-2000.15"];
  return {
    id: Math.random().toString(16).slice(2),
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

function createHistoryRow() {
  const sides = ["0", "1", "2"];
  const amounts = ["11.5432", "-32.9832", "8192331"];
  const realizedPLs = ["32.5432", "-2000.15"];
  return {
    id: Math.random().toString(16).slice(2),
    dateClosed: new Date(),
    timeOpen: new Date(),
    pool: "ETH",
    side: sides[rand(3)] as string,
    asset: "ETH",
    amount: amounts[rand(3)] as string,
    realizedPL: realizedPLs[rand(2)] as string,
  };
}
