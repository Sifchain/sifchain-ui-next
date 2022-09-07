import { Decimal } from "@cosmjs/math";
import { useConnectionUpdatedAt, useSigner } from "@sifchain/cosmos-connect";
import { useDexEnvironment } from "~/domains/core/envs";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import { useBlockTimeQuery } from "~/hooks/useBlockTime";
import useCurrentBlockHeight from "~/hooks/useCurrentBlockHeight";
import useQueryClient from "~/hooks/useQueryClient";
import { useQueryWithNonQueryKeyDeps } from "~/hooks/useQueryWithNonSerializableDeps";
import useSifnodeQuery from "~/hooks/useSifnodeQuery";
import { getLiquidityUnlockStatus } from "../utils/liquidityUnlock";

export const LIQUIDITY_PROVIDER_QUERY_KEY = "liquidity-provider";
export const LIQUIDITY_PROVIDERS_QUERY_KEY = "liquidity-providers";

export const useLiquidityProviderQuery = (denom: string) => {
  const { data: env } = useDexEnvironment();
  const { signer } = useSigner(env?.sifChainId ?? "", {
    enabled: env !== undefined,
  });
  const connectionUpdatedAt = useConnectionUpdatedAt();
  const { isSuccess: isTokenRegistrySuccess, indexedByDenom } = useTokenRegistryQuery();
  const { data: sifQueryClient } = useQueryClient();
  const { data: rewardParamsRes } = useSifnodeQuery("clp.getRewardParams", [{}]);
  const { data: blockTime } = useBlockTimeQuery();
  const { data: blockHeight } = useCurrentBlockHeight();

  return useQueryWithNonQueryKeyDeps(
    [LIQUIDITY_PROVIDER_QUERY_KEY],
    async () => {
      const account = await signer?.getAccounts();
      const lpRes = await sifQueryClient?.clp.getLiquidityProvider({
        lpAddress: account?.[0]?.address ?? "",
        symbol: denom,
      });

      return lpRes === undefined
        ? undefined
        : {
            ...lpRes,
            externalAssetBalance: Decimal.fromAtomics(lpRes.externalAssetBalance, indexedByDenom[denom]?.decimals ?? 0),
            nativeAssetBalance: Decimal.fromAtomics(lpRes.nativeAssetBalance, env?.nativeAsset.decimals ?? 0),
            liquidityProvider:
              lpRes.liquidityProvider === undefined
                ? undefined
                : {
                    ...lpRes.liquidityProvider,
                    unlocks: lpRes.liquidityProvider.unlocks
                      .filter((unlock) => unlock.units !== "0")
                      .map((unlock) => ({
                        ...unlock,
                        ...getLiquidityUnlockStatus(
                          unlock.requestHeight.toNumber(),
                          rewardParamsRes?.params?.liquidityRemovalLockPeriod.toNumber() ?? 0,
                          rewardParamsRes?.params?.liquidityRemovalCancelPeriod.toNumber() ?? 0,
                          blockHeight ?? 0,
                          blockTime ?? 0,
                        ),
                      })),
                  },
          };
    },
    {
      enabled:
        isTokenRegistrySuccess &&
        env !== undefined &&
        signer !== undefined &&
        sifQueryClient != undefined &&
        rewardParamsRes !== undefined &&
        blockTime !== undefined &&
        blockHeight !== undefined,
    },
    [connectionUpdatedAt],
  );
};

export const useLiquidityProvidersQuery = () => {
  const { data: env } = useDexEnvironment();
  const { signer } = useSigner(env?.sifChainId ?? "", {
    enabled: env !== undefined,
  });
  const connectionUpdatedAt = useConnectionUpdatedAt();
  const { isSuccess: isTokenRegistrySuccess, indexedByDenom } = useTokenRegistryQuery();
  const { data: sifQueryClient } = useQueryClient();
  const { data: rewardParamsRes } = useSifnodeQuery("clp.getRewardParams", [{}]);
  const { data: blockTime } = useBlockTimeQuery();
  const { data: blockHeight } = useCurrentBlockHeight();

  return useQueryWithNonQueryKeyDeps(
    [LIQUIDITY_PROVIDERS_QUERY_KEY],
    async () => {
      const account = await signer?.getAccounts();
      const lpRes = await sifQueryClient?.clp.getLiquidityProviderData({
        lpAddress: account?.[0]?.address ?? "",
      });

      return lpRes === undefined
        ? undefined
        : {
            ...lpRes,
            liquidityProviderData: lpRes?.liquidityProviderData.map((x) => ({
              ...x,
              externalAssetBalance: Decimal.fromAtomics(
                x.externalAssetBalance,
                indexedByDenom[x.liquidityProvider?.asset?.symbol ?? ""]?.decimals ?? 0,
              ),
              nativeAssetBalance: Decimal.fromAtomics(x.nativeAssetBalance, env?.nativeAsset.decimals ?? 0),
              liquidityProvider:
                x.liquidityProvider === undefined
                  ? undefined
                  : {
                      ...x.liquidityProvider,
                      unlocks: x.liquidityProvider.unlocks
                        .filter((unlock) => unlock.units !== "0")
                        .map((unlock) => ({
                          ...unlock,
                          ...getLiquidityUnlockStatus(
                            unlock.requestHeight.toNumber(),
                            rewardParamsRes?.params?.liquidityRemovalLockPeriod.toNumber() ?? 0,
                            rewardParamsRes?.params?.liquidityRemovalCancelPeriod.toNumber() ?? 0,
                            blockHeight ?? 0,
                            blockTime ?? 0,
                          ),
                        })),
                    },
            })),
          };
    },
    {
      enabled:
        isTokenRegistrySuccess &&
        env !== undefined &&
        signer !== undefined &&
        sifQueryClient != undefined &&
        rewardParamsRes !== undefined &&
        blockTime !== undefined &&
        blockHeight !== undefined,
    },
    [connectionUpdatedAt],
  );
};
