import { Decimal } from "@cosmjs/math";
import { useSigner } from "@sifchain/cosmos-connect";
import { indexBy, prop } from "rambda";
import { useQuery } from "react-query";
import { useDexEnvironment } from "~/domains/core/envs";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";

export const useAllBalances = () => {
  const { data: env } = useDexEnvironment();
  const { signer } = useSigner(env?.sifChainId ?? "", {
    enabled: env?.sifChainId !== undefined,
  });
  const { data: signingStargateClient } = useSifSigningStargateClient();
  const { indexedByIBCDenom, isSuccess: isTokenRegistryQuerySuccess } =
    useTokenRegistryQuery();

  const baseQuery = useQuery(
    "all-balances",
    async () => {
      const accounts = await signer?.getAccounts();
      const balances = await signingStargateClient?.getAllBalances(
        accounts?.[0]?.address ?? "",
      );

      return balances?.map((x) => ({
        ...x,
        amount: Decimal.fromAtomics(
          x.amount,
          indexedByIBCDenom[x.denom]?.decimals ?? 0,
        ),
      }));
    },
    {
      enabled:
        signer !== undefined &&
        signingStargateClient !== undefined &&
        isTokenRegistryQuerySuccess,
    },
  );

  return {
    ...baseQuery,
    indexedByDenom:
      baseQuery.data === undefined
        ? undefined
        : indexBy(prop("denom"), baseQuery.data),
  };
};
