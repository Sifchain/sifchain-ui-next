import useSifnodeQuery from "~/hooks/useSifnodeQuery";

export function useMarginAllowedAddressList() {
  return useSifnodeQuery("margin.getWhitelist", [{}], { retry: false });
}
