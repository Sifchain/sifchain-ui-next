import useSifnodeQuery from "~/hooks/useSifnodeQuery";

type UseMarginIsWhitelistedAccountParams = {
  walletAddress: string;
};
export function useMarginIsWhitelistedAccount(params: UseMarginIsWhitelistedAccountParams) {
  return useSifnodeQuery("margin.isWhitelisted", [{ address: params.walletAddress }], {
    retry: false,
    enabled: Boolean(params.walletAddress),
  });
}
