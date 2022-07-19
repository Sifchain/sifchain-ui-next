import { Decimal } from "@cosmjs/math";
import { useSigner } from "@sifchain/cosmos-connect";
import { useQuery } from "react-query";
import { useDexEnvironment } from "~/domains/core/envs";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import useQueryClient from "~/hooks/useQueryClient";

export const useLiquidityProvidersQuery = () => {
  const { data: env } = useDexEnvironment();
  const { signer } = useSigner(env?.sifChainId ?? "", {
    enabled: env !== undefined,
  });
  const { isSuccess: isTokenRegistrySuccess, indexedByDenom } =
    useTokenRegistryQuery();
  const { data: sifQueryClient } = useQueryClient();

  return useQuery(
    ["pools", signer],
    async () => {
      const account = await signer?.getAccounts();
      const lpRes = await sifQueryClient?.clp.getLiquidityProviderData({
        lpAddress: account?.[0]?.address ?? "",
      });

      return lpRes === undefined
        ? undefined
        : {
            ...lpRes,
            pools: lpRes?.liquidityProviderData.map((x) => ({
              ...x,
              externalAssetBalance: Decimal.fromAtomics(
                x.externalAssetBalance,
                indexedByDenom[x.liquidityProvider?.asset?.symbol ?? ""]
                  ?.decimals ?? 0,
              ),
              nativeAssetBalance: Decimal.fromAtomics(
                x.nativeAssetBalance,
                env?.nativeAsset.decimals ?? 0,
              ),
            })),
          };
    },
    {
      enabled:
        isTokenRegistrySuccess &&
        env !== undefined &&
        signer !== undefined &&
        sifQueryClient != undefined,
    },
  );
};
