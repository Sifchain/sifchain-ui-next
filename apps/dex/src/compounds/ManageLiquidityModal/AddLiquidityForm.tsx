import { Button, PlusIcon, RacetrackSpinnerIcon } from "@sifchain/ui";
import { FormEventHandler, useCallback, useMemo } from "react";
import { useBalanceQuery } from "~/domains/bank/hooks/balances";
import useAddLiquidity from "~/domains/clp/hooks/useAddLiquidity";
import useAddLiquidityMutation from "~/domains/clp/hooks/useAddLiquidityMutation";
import { useDexEnvironment } from "~/domains/core/envs";
import TokenAmountFieldset from "../TokenAmountFieldset";
import type { ManageLiquidityModalProps } from "./types";

const AddLiquidityForm = (props: ManageLiquidityModalProps) => {
  const { data: env } = useDexEnvironment();
  const {
    nativeAmountState: [nativeAmount, setNativeAmount],
    externalAmountState: [externalAmount, setExternalAmount],
    nativeAmountDecimal,
    externalAmountDecimal,
    poolShare,
  } = useAddLiquidity(props.denom);
  const addLiquidityMutation = useAddLiquidityMutation();

  const { data: nativeBalance } = useBalanceQuery(
    env?.sifChainId ?? "",
    env?.nativeAsset.symbol.toLowerCase() ?? "",
    { enabled: env !== undefined },
  );
  const { data: externalBalance } = useBalanceQuery(
    env?.sifChainId ?? "",
    props.denom,
    {
      enabled: env !== undefined,
    },
  );

  const validationError = useMemo(() => {
    if (!addLiquidityMutation.isReady) {
      return new Error("Please connect Sifchain wallet");
    }

    if (
      (nativeBalance !== undefined &&
        nativeAmountDecimal?.isGreaterThan(nativeBalance.amount)) ||
      (externalBalance &&
        externalAmountDecimal?.isGreaterThan(externalBalance.amount))
    ) {
      return new Error("Insufficient balance");
    }

    return;
  }, [
    addLiquidityMutation.isReady,
    externalAmountDecimal,
    externalBalance,
    nativeAmountDecimal,
    nativeBalance,
  ]);

  const buttonMessage = useMemo(() => {
    if (validationError !== undefined) {
      return validationError.message;
    }

    if (addLiquidityMutation.isError || addLiquidityMutation.isSuccess) {
      return "Close";
    }

    return (
      <>
        {addLiquidityMutation.isLoading && <RacetrackSpinnerIcon />}Add
        liquidity
      </>
    );
  }, [
    addLiquidityMutation.isError,
    addLiquidityMutation.isLoading,
    addLiquidityMutation.isSuccess,
    validationError,
  ]);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();

      if (addLiquidityMutation.isError || addLiquidityMutation.isSuccess) {
        return props.onClose(false);
      }

      if (
        nativeAmountDecimal !== undefined &&
        externalAmountDecimal !== undefined
      ) {
        addLiquidityMutation.mutate({
          denom: props.denom,
          nativeAmount: nativeAmountDecimal.atomics,
          externalAmount: externalAmountDecimal.atomics,
        });
      }
    },
    [addLiquidityMutation, externalAmountDecimal, nativeAmountDecimal, props],
  );

  const inputsDisabled =
    addLiquidityMutation.isLoading ||
    addLiquidityMutation.isSuccess ||
    addLiquidityMutation.isError;

  return (
    <form onSubmit={onSubmit}>
      <TokenAmountFieldset
        label="Token 1"
        denom={props.denom}
        amount={externalAmount}
        balance={externalBalance?.amount}
        onChangeDenom={() => {}}
        onChangeAmount={setExternalAmount}
        responsive={false}
        tokenSelectionDisabled={inputsDisabled}
        disabled={inputsDisabled}
      />
      <div className="flex justify-center items-center my-[-1em]">
        <div className="bg-black rounded-full p-3 border-2 border-gray-800">
          <PlusIcon />
        </div>
      </div>
      <TokenAmountFieldset
        label="Token 2"
        denom={env?.nativeAsset.symbol.toLowerCase() ?? "rowan"}
        amount={nativeAmount}
        balance={nativeBalance?.amount}
        onChangeDenom={() => {}}
        onChangeAmount={setNativeAmount}
        responsive={false}
        tokenSelectionDisabled
        disabled={inputsDisabled}
      />
      <dl className="flex flex-col gap-2 p-4 [&>div]:flex [&>div]:justify-between">
        <div>
          <dt>Est pool share</dt>
          <dd>
            {poolShare?.toLocaleString(undefined, {
              style: "percent",
              maximumFractionDigits: 2,
            })}
          </dd>
        </div>
      </dl>
      <Button
        className="w-full"
        disabled={
          addLiquidityMutation.isLoading || validationError !== undefined
        }
      >
        {buttonMessage}
      </Button>
    </form>
  );
};

export default AddLiquidityForm;
