import { Button, PlusIcon, RacetrackSpinnerIcon, LockIcon, SettingsIcon } from "@sifchain/ui";
import { FormEventHandler, useCallback, useMemo, useState } from "react";
import { useBalanceQuery } from "~/domains/bank/hooks/balances";
import useAddLiquidity from "~/domains/clp/formHooks/useAddLiquidity";
import useAddLiquidityMutation from "~/domains/clp/hooks/useAddLiquidityMutation";
import { useDexEnvironment } from "~/domains/core/envs";
import useSifnodeQuery from "~/hooks/useSifnodeQuery";
import TokenAmountFieldset from "../TokenAmountFieldset";
import type { ManageLiquidityModalProps } from "./types";

const AddLiquidityForm = (props: ManageLiquidityModalProps) => {
  const [symmetric, setSymmetric] = useState<boolean>(false);
  const { data } = useSifnodeQuery("margin.getParams", [{}]);
  const isPoolUsedForMargin = useMemo(
    () => data?.params?.pools.includes(props.denom),
    [data?.params?.pools, props.denom],
  );

  const { data: env } = useDexEnvironment();
  const {
    nativeAmountState: [nativeAmount, setNativeAmount],
    externalAmountState: [externalAmount, setExternalAmount],
    nativeAmountDecimal,
    externalAmountDecimal,
    poolShare,
  } = useAddLiquidity(props.denom, symmetric);
  const addLiquidityMutation = useAddLiquidityMutation();

  const { data: nativeBalance } = useBalanceQuery(env?.sifChainId ?? "", env?.nativeAsset.symbol.toLowerCase() ?? "", {
    enabled: env !== undefined,
  });
  const { data: externalBalance } = useBalanceQuery(env?.sifChainId ?? "", props.denom, {
    enabled: env !== undefined,
  });

  const validationError = useMemo(() => {
    if (!addLiquidityMutation.isReady) {
      return new Error("Please connect Sifchain wallet");
    }

    if (
      (nativeBalance !== undefined && nativeAmountDecimal?.isGreaterThan(nativeBalance.amount)) ||
      (externalBalance && externalAmountDecimal?.isGreaterThan(externalBalance.amount))
    ) {
      return new Error("Insufficient balance");
    }

    return;
  }, [addLiquidityMutation.isReady, externalAmountDecimal, externalBalance, nativeAmountDecimal, nativeBalance]);

  const buttonMessage = useMemo(() => {
    if (validationError !== undefined) {
      return validationError.message;
    }

    if (addLiquidityMutation.isError || addLiquidityMutation.isSuccess) {
      return "Close";
    }

    return <>{addLiquidityMutation.isLoading && <RacetrackSpinnerIcon />}Add liquidity</>;
  }, [addLiquidityMutation.isError, addLiquidityMutation.isLoading, addLiquidityMutation.isSuccess, validationError]);

  const toggleSymmetry = useCallback(() => {
    setSymmetric(!symmetric);
  }, [setSymmetric, symmetric]);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();

      if (addLiquidityMutation.isError || addLiquidityMutation.isSuccess) {
        return props.onClose(false);
      }

      if (nativeAmountDecimal !== undefined && externalAmountDecimal !== undefined) {
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
    addLiquidityMutation.isLoading || addLiquidityMutation.isSuccess || addLiquidityMutation.isError;

  return (
    <form onSubmit={onSubmit}>
      <TokenAmountFieldset
        label="Token 1"
        denom={props.denom}
        amount={externalAmount}
        balance={externalBalance?.amount}
        onChangeDenom={props.onChangeDenom}
        onChangeAmount={setExternalAmount}
        responsive={false}
        tokenSelectionDisabled={inputsDisabled}
        disabled={inputsDisabled}
      />
      <div className="my-[-1em] flex items-center justify-center">
        <div className="rounded-full border-2 border-gray-800 bg-black p-3">
          { (symmetric) ? <LockIcon onClick={toggleSymmetry}/>  : <SettingsIcon onClick={toggleSymmetry}/> }
        </div>
      </div>
      <TokenAmountFieldset
        label="Token 2"
        denom={env?.nativeAsset.symbol.toLowerCase() ?? "rowan"}
        amount={nativeAmount}
        balance={nativeBalance?.amount}
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
      {isPoolUsedForMargin && (
        <div className="bg-gray-750 mb-4 flex items-center gap-4 rounded-lg p-4">
          <p className="text-lg">ℹ️</p>
          <p className="text-xs text-gray-200">
            Deposits are used to underwrite margin trading. Utilized capital may be locked.
          </p>
        </div>
      )}
      <Button className="w-full" disabled={addLiquidityMutation.isLoading || validationError !== undefined}>
        {buttonMessage}
      </Button>
    </form>
  );
};

export default AddLiquidityForm;
