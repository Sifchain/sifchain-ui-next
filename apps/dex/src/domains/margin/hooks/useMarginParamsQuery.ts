import useSifnodeQuery from "~/hooks/useSifnodeQuery";

export function useMarginParamsQuery() {
  // Force `enable`, to make sure the query returns an error, avoiding infinite "idle" state of `useSifnodeQuery`
  return useSifnodeQuery("margin.getParams", [{}], { retry: 1, enabled: true });
}
