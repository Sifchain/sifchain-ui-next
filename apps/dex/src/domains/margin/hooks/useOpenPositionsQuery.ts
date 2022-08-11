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
  return useQuery(
    ["margin.getMarginOpenPosition", { ...params }],
    async () => {
      if (!client) {
        throw new Error("[useSifApiQuery] No client available");
      }

      const res = await client.margin.getMarginOpenPosition(
        params.address,
        Number(params.offset),
        Number(params.limit),
        params.orderBy,
        params.sortBy,
      );

      if (res.error) {
        throw new Error("client.margin.getMarginOpenPosition");
      }

      return res;
    },
    {
      keepPreviousData: true,
      retry: false,
    },
  );
}
