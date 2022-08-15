import useSifnodeQuery from "~/hooks/useSifnodeQuery";

export function useMarginParamsQuery() {
  return useSifnodeQuery("margin.getParams", [{}], { retry: false });
}
