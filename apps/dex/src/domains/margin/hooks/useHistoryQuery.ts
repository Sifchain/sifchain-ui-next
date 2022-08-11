import { invariant } from "@sifchain/ui";
import { useQuery } from "react-query";

import useSifApiQuery from "~/hooks/useSifApiQuery";

export function useHistoryQuery(params: {
  address: string;
  offset: string;
  limit: string;
  orderBy: string;
  sortBy: string;
}) {
  const { data, ...query } = useSifApiQuery(
    "margin.getMarginHistory",
    [
      params.address,
      Number(params.offset),
      Number(params.limit),
      params.orderBy,
      params.sortBy,
    ],
    {
      keepPreviousData: true,
      retry: false,
    },
  );

  const dependentQuery = useQuery(
    ["margin.getMarginHistory", { ...params }],
    () => {
      invariant(data !== undefined, "Sif api client is not defined");
      console.log({ data });
      if ("error" in data) {
        throw new Error("client.margin.getMarginHistory");
      }

      return data;
    },
    {
      enabled: data !== undefined,
    },
  );

  return {
    ...query,
    data: dependentQuery.data as any, // TODO: fix query result type
    isSuccess: dependentQuery.isSuccess,
    isLoading: dependentQuery.isLoading || query.isLoading,
    isError: dependentQuery.isError || query.isError,
    error: dependentQuery.error || query.error,
  };
}
