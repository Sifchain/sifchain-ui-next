import {
  Maybe,
  TokenEntry,
  TokenSelector as BaseTokenSelector,
  TokenSelectorProps as BaseTokenSelectorProps,
} from "@sifchain/ui";
import { pipe } from "ramda";
import { useCallback, useMemo } from "react";

import { useAllBalancesQuery } from "~/domains/bank/hooks/balances";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import type { EnhancedRegistryAsset } from "~/domains/tokenRegistry/hooks/useTokenRegistry";

export type TokenSelectorProps = Omit<
  BaseTokenSelectorProps,
  "tokens" | "value" | "onChange"
> & { value?: string; onChange: (token?: EnhancedRegistryAsset) => unknown };

export const toTokenEntry = <T extends EnhancedRegistryAsset>(x: T) => ({
  id: x.denom,
  name: x.name,
  symbol: x.symbol,
  displaySymbol: x.displaySymbol,
  decimals: x.decimals,
  network: x.network,
  homeNetwork: x.homeNetwork,
  homeNetworkUrl:
    x.network !== x.homeNetwork ? `/chains/${x.homeNetwork}.png` : undefined,
  imageUrl: x.imageUrl ?? "",
  hasDarkIcon: Boolean(x.hasDarkIcon),
});

export function useTokenEntriesWithBalance() {
  const { data: registry } = useTokenRegistryQuery();
  const { findBySymbolOrDenom } = useAllBalancesQuery();

  const toTokenEntryWithBalance = useCallback(
    (token: TokenEntry) => {
      const balance = findBySymbolOrDenom(token.id ?? token.symbol);

      return balance?.amount
        ? {
            ...token,
            balance: balance.amount.toFloatApproximation(),
          }
        : token;
    },
    [findBySymbolOrDenom],
  );

  return useMemo(
    () => registry?.map(pipe(toTokenEntry, toTokenEntryWithBalance)),
    [registry, toTokenEntryWithBalance],
  );
}

const TokenSelector = (props: TokenSelectorProps) => {
  const { indexedByDenom } = useTokenRegistryQuery();

  const handleChange = useCallback(
    (token: TokenEntry) => props.onChange(indexedByDenom[token.id ?? ""]),
    [indexedByDenom, props],
  );

  const tokens = useTokenEntriesWithBalance();

  const value = Maybe.of(props.value)
    .map((x) => indexedByDenom[x])
    .mapOr(undefined, toTokenEntry);

  return (
    <BaseTokenSelector
      {...props}
      value={value}
      tokens={tokens ?? []}
      onChange={handleChange}
    />
  );
};

export default TokenSelector;
