import type { IAsset } from "@sifchain/common";
import {
  TokenEntry,
  TokenSelector as BaseTokenSelector,
  TokenSelectorProps as BaseTokenSelectorProps,
} from "@sifchain/ui";
import { useCallback, useMemo } from "react";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import type { EnhancedRegitryAsset } from "~/domains/tokenRegistry/hooks/useTokenRegistry";

export type TokenSelectorProps = Omit<
  BaseTokenSelectorProps,
  "tokens" | "value" | "onChange"
> & { value?: string; onChange: (token?: EnhancedRegitryAsset) => unknown };

const toTokenEntry = <T extends IAsset>(x: T) => ({
  id: x.ibcDenom,
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
  const { data: registry, indexedByIBCDenom } = useTokenRegistryQuery();

  const token =
    props.value === undefined ? undefined : indexedByIBCDenom[props.value];

  return (
    <BaseTokenSelector
      {...props}
      value={token === undefined ? undefined : toTokenEntry(token)}
      tokens={useMemo(() => registry.map(toTokenEntry), [registry])}
      onChange={useCallback(
        (token: TokenEntry) =>
          props.onChange(indexedByIBCDenom[token.id ?? ""]),
        [indexedByIBCDenom, props],
      )}
    />
  );
};

export default TokenSelector;
