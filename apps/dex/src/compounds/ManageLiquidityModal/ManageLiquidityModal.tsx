import { ButtonGroup, ButtonGroupOption, Maybe, Modal } from "@sifchain/ui";
import { useCallback, useMemo } from "react";
import { useLiquidityProviderQuery, usePoolStatsQuery } from "~/domains/clp";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import AddLiquidityForm from "./AddLiquidityForm";
import UnlockLiquidityForm from "./RemoveLiquidityForm";
import type { ManageLiquidityAction, ManageLiquidityModalProps } from "./types";

const percentageFormat = Intl.NumberFormat(undefined, {
  style: "percent",
  maximumFractionDigits: 2,
});

const ManageLiquidityModal = (props: ManageLiquidityModalProps) => {
  const liquidityProviderQuery = useLiquidityProviderQuery(props.denom);
  const liquidityProvider = liquidityProviderQuery.data?.liquidityProvider;

  const tabOptions = useMemo<ButtonGroupOption<ManageLiquidityAction>[]>(
    () => [
      { label: "Add liquidity", value: "add" },
      {
        label: "Remove liquidity",
        value: "unlock",
        disabled: liquidityProvider === undefined || (liquidityProvider?.unlocks.length ?? 0) > 0,
      },
    ],
    [liquidityProvider],
  );

  const selectedTabIndex = useMemo(
    () => Object.values(tabOptions).findIndex((x) => x.value === props.action),
    [props.action, tabOptions],
  );

  const { indexedByDenom } = useTokenRegistryQuery();
  const token = indexedByDenom[props.denom];
  const poolStatsQuery = usePoolStatsQuery();

  const poolStats = useMemo(
    () => poolStatsQuery.data?.pools?.find((x) => x.symbol?.toLowerCase() === token?.displaySymbol.toLowerCase()),
    [poolStatsQuery.data?.pools, token?.displaySymbol],
  );

  const [nativeRatio, externalRatio] = useMemo(() => {
    const poolTvl = poolStats?.poolTVL ?? 0;
    const externalTvl = poolStats?.poolDepth ?? 0;
    const nativeTvl = poolTvl - externalTvl;

    return [nativeTvl / poolTvl || undefined, externalTvl / poolTvl || undefined] as const;
  }, [poolStats]);

  const form = useMemo(() => {
    switch (selectedTabIndex) {
      default:
      case 0:
        return <AddLiquidityForm {...props} />;
      case 1:
        return <UnlockLiquidityForm {...props} />;
    }
  }, [props, selectedTabIndex]);

  return (
    <Modal {...props} title="Pool">
      <div className="flex items-center justify-between gap-4 pb-4">
        <ButtonGroup
          className="flex-1 bg-black"
          options={tabOptions}
          selectedIndex={selectedTabIndex}
          onChange={useCallback(
            (index) => {
              const option = Object.values(tabOptions)[index];
              if (option !== undefined) {
                props.onChangeAction(option.value);
              }
            },
            [props, tabOptions],
          )}
        />
        <dl className="flex flex-col gap-1 uppercase [&>div]:flex [&>div]:justify-between [&>div]:gap-4">
          <div>
            <dt className="uppercase">{token?.displaySymbol}</dt>
            <dd>{Maybe.of(externalRatio).mapOr("...", percentageFormat.format)}</dd>
          </div>
          <div>
            <dt>ROWAN</dt>
            <dd>{Maybe.of(nativeRatio).mapOr("...", percentageFormat.format)}</dd>
          </div>
        </dl>
      </div>
      {form}
    </Modal>
  );
};

export default ManageLiquidityModal;
