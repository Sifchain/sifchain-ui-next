import { Decimal } from "@cosmjs/math";
import type { NetworkKind } from "@sifchain/common";
import { useSigner, useSigningStargateClient } from "@sifchain/cosmos-connect";
import { formatNumberAsCurrency } from "@sifchain/ui";
import BigNumber from "bignumber.js";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBalance } from "wagmi";
import { usePoolStatsQuery } from "~/domains/clp";
import { useDexEnvironment } from "~/domains/core/envs";

type NativeBalanceResult = {
  amount?: Decimal;
  denom: string;
  dollarValue: string;
};

const DEFAULT_NATIVE_BALANCE: NativeBalanceResult = {
  denom: "",
  dollarValue: "$0",
};

export function useCosmosNativeBalance(
  context: {
    chainId: string;
    networkId: NetworkKind;
    address: string | undefined;
  },
  options: { enabled?: boolean } = { enabled: true },
) {
  const { chainId, networkId, address } = context;

  const { signer } = useSigner(chainId);

  const { client } = useSigningStargateClient(chainId);
  const { data: dexEnv } = useDexEnvironment();
  const { data: tokenStats } = usePoolStatsQuery();

  const query = useCallback(async () => {
    if (!client || !dexEnv) {
      return DEFAULT_NATIVE_BALANCE;
    }

    const chain = dexEnv.chainConfigsByNetwork[networkId];

    if (!chain || !tokenStats?.pools) {
      console.log("no chain or pools found", {
        chainId,
        networkId,
      });
      return DEFAULT_NATIVE_BALANCE;
    }

    const nativeSymbol = chain.nativeAssetSymbol.toLowerCase();

    const stat = tokenStats.pools.find(({ symbol }) => symbol === nativeSymbol || `u${symbol}` === nativeSymbol);

    const asset = dexEnv.assets.find(
      ({ symbol }) => symbol.toLowerCase() === nativeSymbol || `u${symbol.toLowerCase()}` === nativeSymbol,
    );

    const autoAddress = address ?? (await signer?.getAccounts().then((x) => x[0]?.address));

    if (autoAddress === undefined) {
      throw new Error("Could not get address from signer");
    }

    const result = await client.getBalance(autoAddress, chain.nativeAssetSymbol.toLowerCase());

    if (!result || !asset) {
      return DEFAULT_NATIVE_BALANCE;
    }

    const tokenPrice = Number(asset.symbol === "ROWAN" ? tokenStats.rowanUSD : stat?.priceToken ?? 0);

    const normalizedBalance = Decimal.fromAtomics(result.amount, asset.decimals);

    const dollarValue = normalizedBalance.toFloatApproximation() * tokenPrice;

    return {
      amount: normalizedBalance,
      denom: result.denom,
      dollarValue: formatNumberAsCurrency(dollarValue),
    };
  }, [address, networkId, chainId, client, dexEnv, signer, tokenStats]);

  return useQuery(["ibc-native-balance", chainId, address], query, {
    enabled: options.enabled && Boolean(dexEnv && client && tokenStats && signer),
    staleTime: 3600_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useEthNativeBalance(context: { chainId: string | number }, address: string) {
  const { data: dexEnv } = useDexEnvironment();
  const { data: tokenStats } = usePoolStatsQuery();

  const balanceQuery = useBalance({
    chainId: typeof context.chainId === "string" ? parseInt(context.chainId, 16) : context.chainId,
    addressOrName: address,
    staleTime: 3600_000,
  });

  const query = useCallback(async () => {
    if (!balanceQuery.data || !dexEnv) {
      return DEFAULT_NATIVE_BALANCE;
    }

    const chain = dexEnv.chainConfigsByNetwork[context.chainId as NetworkKind];

    if (!chain || !tokenStats?.pools) {
      return DEFAULT_NATIVE_BALANCE;
    }

    const nativeSymbol = chain.nativeAssetSymbol.toLowerCase();

    const stat = tokenStats.pools.find(({ symbol }) => symbol === nativeSymbol || `u${symbol}` === nativeSymbol);

    const asset = dexEnv.assets.find(
      ({ symbol }) => symbol.toLowerCase() === nativeSymbol || `u${symbol.toLowerCase()}` === nativeSymbol,
    );

    const result = balanceQuery.data;

    if (!result || !asset) {
      return DEFAULT_NATIVE_BALANCE;
    }

    const tokenPrice = Number(asset.symbol === "ROWAN" ? tokenStats.rowanUSD : stat?.priceToken ?? 0);

    const normalizedBalance = new BigNumber(result.value.toString()).shiftedBy(-result.decimals);

    const dollarValue = normalizedBalance.multipliedBy(tokenPrice);

    return {
      amount: normalizedBalance.toFixed(4),
      denom: result.symbol,
      dollarValue: formatNumberAsCurrency(dollarValue.toNumber()),
    };
  }, [balanceQuery.data, context.chainId, dexEnv, tokenStats?.pools, tokenStats?.rowanUSD]);

  return useQuery(["eth-native-balance", context.chainId, address], query, {
    enabled: Boolean(balanceQuery.isSuccess),
    staleTime: 3600_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
