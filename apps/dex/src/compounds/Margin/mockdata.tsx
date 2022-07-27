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
  let results = cache.openPositions;

  if (typeof results === "undefined") {
    const data = Array.from({ length: Number(queryParams.limit) * 5 }, () =>
      createOpenPositionsRow(),
    );
    results = data;
    cache.openPositions = data;
  }

  const paginatedResults = results.slice(
    (Number(queryParams.page) - 1) * Number(queryParams.limit), // 0, 50, 100
    Number(queryParams.limit) * Number(queryParams.page), // 50, 100, 150
  );

  const query = () =>
    new Promise((res) => {
      setTimeout(() => {
        res({
          pagination: {
            total: `${results.length}`,
            limit: queryParams.limit,
            page: queryParams.page,
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
  let results = cache.history;

  if (typeof results === "undefined") {
    const data = Array.from({ length: Number(queryParams.limit) * 5 }, () =>
      createHistoryRow(),
    );
    results = data;
    cache.history = data;
  }

  const paginatedResults = results.slice(
    (Number(queryParams.page) - 1) * Number(queryParams.limit), // 0, 50, 100
    Number(queryParams.limit) * Number(queryParams.page), // 50, 100, 150
  );

  const query = () =>
    new Promise((res) => {
      setTimeout(() => {
        res({
          pagination: {
            total: `${results.length}`,
            limit: queryParams.limit,
            page: queryParams.page,
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
    health: `${rand(100)}`,
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
