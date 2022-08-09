import { Button, RacetrackSpinnerIcon } from "@sifchain/ui";
import {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useMemo,
} from "react";
import useUnlockLiquidity from "~/domains/clp/hooks/useUnlockLiquidity";
import useUnlockLiquidityMutation from "~/domains/clp/hooks/useUnlockLiquidityMutation";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import type { ManageLiquidityModalProps } from "./types";

const UnlockLiquidityForm = (props: ManageLiquidityModalProps) => {
  const { indexedByDenom } = useTokenRegistryQuery();
  const externalToken = indexedByDenom[props.denom];

  const unlockLiquidityMutation = useUnlockLiquidityMutation();
  const {
    unlockPercentageState: [unlockPercentage, setUnlockPercentage],
    units,
    nativeAssetAmount,
    externalAssetAmount,
  } = useUnlockLiquidity(props.denom);

  const buttonMessage = useMemo(() => {
    if (!unlockLiquidityMutation.isReady) {
      return "Please connect Sifchain wallet";
    }
    if (unlockLiquidityMutation.isError || unlockLiquidityMutation.isSuccess) {
      return "Close";
    }

    return (
      <>
        {unlockLiquidityMutation.isLoading && <RacetrackSpinnerIcon />}Unbond
        liquidity
      </>
    );
  }, [
    unlockLiquidityMutation.isError,
    unlockLiquidityMutation.isLoading,
    unlockLiquidityMutation.isReady,
    unlockLiquidityMutation.isSuccess,
  ]);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();

      if (
        unlockLiquidityMutation.isSuccess ||
        unlockLiquidityMutation.isError
      ) {
        props.onClose(false);
      } else {
        unlockLiquidityMutation.mutate({ denom: props.denom, units });
      }
    },
    [props, units, unlockLiquidityMutation],
  );

  const inputDisabled =
    unlockLiquidityMutation.isLoading ||
    unlockLiquidityMutation.isSuccess ||
    unlockLiquidityMutation.isError;

  return (
    <form onSubmit={onSubmit}>
      <input
        className="w-full"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={unlockPercentage}
        onChange={useCallback<ChangeEventHandler<HTMLInputElement>>(
          (event) => setUnlockPercentage(event.target.value),
          [setUnlockPercentage],
        )}
        disabled={inputDisabled}
      />
      <section className="p-4">
        <header className="mb-2">Est. amount you will receive:</header>
        <dl className="flex flex-col gap-2 [&_dt]:font-semibold [&_dt]:uppercase [&>div]:flex [&>div]:justify-between">
          <div>
            <dt>{externalToken?.displaySymbol}</dt>
            <dd>
              {externalAssetAmount.toLocaleString(undefined, {
                maximumFractionDigits: 6,
              })}
            </dd>
          </div>
          <div>
            <dt>ROWAN</dt>
            <dd>
              {nativeAssetAmount.toLocaleString(undefined, {
                maximumFractionDigits: 6,
              })}
            </dd>
          </div>
        </dl>
      </section>
      <Button
        className="w-full"
        disabled={unlockLiquidityMutation.isLoading || unlockPercentage === "0"}
      >
        {buttonMessage}
      </Button>
    </form>
  );
};

export default UnlockLiquidityForm;
