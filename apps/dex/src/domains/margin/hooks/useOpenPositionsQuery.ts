import { useQuery } from "react-query";

import useSifApiClient from "~/hooks/useSifApiClient";
// import useSifApiQuery from "~/hooks/useSifApiQuery";

export function useOpenPositionsQuery(params: {
  address: string;
  offset: string;
  limit: string;
  orderBy: string;
  sortBy: string;
}) {
  /** 
  [
      address: string, 
      offset?: number | undefined, 
      limit?: number | undefined, 
      orderBy?: string | undefined, 
      sortBy?: string | undefined, 
      options?: any]
  */
  const { data: client } = useSifApiClient();
  // const { data, ...query } = useSifApiQuery(
  //   "stats.getMarginOpenPosition",
  //   queryParams,
  // );
  return useQuery("margin.getMarginOpenPosition", async () => {
    if (!client) {
      throw new Error("[useSifApiQuery] No client available");
    }

    const { results, pagination } = await client.margin.getMarginOpenPosition(
      params.address,
      Number(params.offset),
      Number(params.limit),
      params.orderBy,
      params.sortBy,
    );

    results.length = 100;
    pagination.limit = 20;
    pagination.offset = 0;
    // 0 = page 1
    // 20 = page 2
    // 40 = page 3

    const pages = Math.ceil(Number(results.length) / Number(pagination.limit));
    const page = Number(pagination.limit) / Number(pagination.offset) + 1;

    pagination.pages = pages;
    pagination.page = page > pages ? pages : page;

    return { results, pagination };
  });
}
