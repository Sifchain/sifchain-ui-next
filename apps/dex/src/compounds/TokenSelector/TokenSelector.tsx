import {
  TokenEntry,
  TokenSelector as BaseTokenSelector,
  TokenSelectorProps as BaseTokenSelectorProps,
} from "@sifchain/ui";
import { useCallback, useMemo } from "react";
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
  balance: "",
  hasDarkIcon: Boolean(x.hasDarkIcon),
});

const TokenSelector = (props: TokenSelectorProps) => {
  const { data: registry, indexedByDenom } = useTokenRegistryQuery();

  const token = props.value ? indexedByDenom[props.value] : undefined;

  return (
    <BaseTokenSelector
      {...props}
      value={token ? toTokenEntry(token) : undefined}
      tokens={useMemo(() => registry.map(toTokenEntry), [registry])}
      onChange={useCallback(
        (token: TokenEntry) => props.onChange(indexedByDenom[token.id ?? ""]),
        [indexedByDenom, props],
      )}
    />
  );
};

export default TokenSelector;
