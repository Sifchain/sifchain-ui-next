import { useQuery } from "react-query";

import useSifApiClient from "~/hooks/useSifApiClient";

export function useOpenPositionsQuery(params: {
  address: string;
  offset: string;
  limit: string;
  orderBy: string;
  sortBy: string;
}) {
  const { data: client } = useSifApiClient();

  return useQuery(
    ["margin.getMarginOpenPosition", { ...params }],
    async () => {
      if (!client) {
        throw new Error("[useSifApiQuery] No client available");
      }

      const res = (await client.margin.getMarginOpenPosition(
        params.address,
        Number(params.offset),
        Number(params.limit),
        params.orderBy,
        params.sortBy,
      )) as any;

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
