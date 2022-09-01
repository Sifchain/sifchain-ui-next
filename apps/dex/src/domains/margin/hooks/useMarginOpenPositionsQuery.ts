import type { MarginOpenPositionsResponse } from "./types";
import type { UseQueryResult } from "@tanstack/react-query";

import { useRouter } from "next/router";

import useSifApiQuery from "~/hooks/useSifApiQuery";

import { QS_DEFAULTS } from "~/compounds/Margin/_tables";
import { useSifSignerAddressQuery } from "~/hooks/useSifSigner";

export function useOpenPositionsQuery() {
  const router = useRouter();
  const walletAddress = useSifSignerAddressQuery();
  const params = {
    walletAddress: walletAddress.data ?? "",
    limit: (router.query["limit"] as string) || QS_DEFAULTS.limit,
    offset: (router.query["offset"] as string) || QS_DEFAULTS.offset,
    orderBy: (router.query["orderBy"] as string) || "date_opened",
    sortBy: (router.query["sortBy"] as string) || QS_DEFAULTS.sortBy,
  };

  return useSifApiQuery(
    "margin.getMarginOpenPosition",
    [params.walletAddress, Number(params.offset), Number(params.limit), params.orderBy, params.sortBy],
    {
      enabled: Boolean(params.walletAddress),
      keepPreviousData: true,
      /**
       * We are using React Query Optimistic Updates in "useMarginMTPOpenMutation"
       * To avoid removing the optimistic item too soon from the UI, we need to
       * increasing the refresh time in "useMarginOpenPositions"
       * to allow Data Services to do their job
       *
       * If in the next fetch window (after 10 seconds), Data Services response
       * DOESN'T include the new item, the optimistic item will be REMOVED from the UI
       * we are not doing a diff in the Data Service response x local cache
       *
       * Data Services response is our source of truth
       */
      refetchInterval: 10 * 1000,
      retry: false,
      structuralSharing(
        oldData: MarginOpenPositionsResponse | undefined,
        newData: MarginOpenPositionsResponse | undefined,
      ) {
        if (oldData && newData) {
          const newDataIds = newData.results.map((x) => x.id);
          const oldDataDiff = oldData.results.filter((x) => !newDataIds.includes(x.id));
          newData.results = oldDataDiff.concat(newData.results);
          newData.pagination.total = String(newData.results.length);
          newData.pagination.limit = String(Number(newData.pagination.limit) + oldDataDiff.length);
          return newData;
        }
        return newData;
      },
    },
  ) as UseQueryResult<MarginOpenPositionsResponse>;
}
