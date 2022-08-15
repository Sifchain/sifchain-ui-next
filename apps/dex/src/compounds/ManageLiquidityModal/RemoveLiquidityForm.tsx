import { Button, Fieldset, Input, RacetrackSpinnerIcon } from "@sifchain/ui";
import BigNumber from "bignumber.js";
import { clamp } from "rambda";
import {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useMemo,
} from "react";
import useUnlockLiquidity from "~/domains/clp/formHooks/useUnlockLiquidity";
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
    [props, units, unlockLiquidityMutation]
  );

  const onChangePercentageInput = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    (event) => {
      const value = event.target.value.replace(".", "").trim();
      const parsedValue = clamp(0, 100, parseInt(value));

      setUnlockPercentage(new BigNumber(parsedValue).div(100).toString());
    },
    [setUnlockPercentage]
  );

  const inputDisabled =
    unlockLiquidityMutation.isLoading ||
    unlockLiquidityMutation.isSuccess ||
    unlockLiquidityMutation.isError;

  return (
    <form onSubmit={onSubmit}>
      <Fieldset className="flex gap-2" label="Unbond amount">
        <input
          className="w-full"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={unlockPercentage}
          onChange={useCallback<ChangeEventHandler<HTMLInputElement>>(
            (event) => setUnlockPercentage(event.target.value),
            [setUnlockPercentage]
          )}
          disabled={inputDisabled}
        />
        <Input
          type="number"
          containerClassName="w-20"
          inputClassName="w-0 text-lg text-end"
          trailingIcon={<span>%</span>}
          value={Number(unlockPercentage)
            .toLocaleString(undefined, {
              style: "percent",
            })
            .replace("%", "")}
          onChange={onChangePercentageInput}
        />
      </Fieldset>
      <section className="p-4">
        <header className="mb-2">Est. amount you will receive:</header>
        <dl className="flex flex-col gap-2 [&>div]:flex [&>div]:justify-between [&_dt]:font-semibold [&_dt]:uppercase">
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
