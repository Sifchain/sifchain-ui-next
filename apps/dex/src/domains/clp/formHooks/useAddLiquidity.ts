import { Decimal } from "@cosmjs/math";
import { runCatching } from "@sifchain/common";
import { calculatePoolUnits } from "@sifchain/math";
import BigNumber from "bignumber.js";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { usePoolQuery } from "../hooks/usePool";

const useAddLiquidity = (denom: string, symmetric = true) => {
  const poolQuery = usePoolQuery(denom);
  const pool = poolQuery.data?.pool;

  const [activeInput, setActiveInput] = useState<"native" | "external" | undefined>(undefined);

  const [nativeAmount, _setNativeAmount] = useState("");
  const [externalAmount, _setExternalAmount] = useState("");

  const nativeAmountDecimal = useMemo(
    () =>
      runCatching(() =>
        pool === undefined ? undefined : Decimal.fromUserInput(nativeAmount, pool.nativeAssetBalance.fractionalDigits),
      )[1],
    [nativeAmount, pool],
  );
  const externalAmountDecimal = useMemo(
    () =>
      runCatching(() =>
        pool === undefined
          ? undefined
          : Decimal.fromUserInput(externalAmount, pool.externalAssetBalance.fractionalDigits),
      )[1],
    [externalAmount, pool],
  );

  const [poolUnits, poolShare] = useMemo(() => {
    if (pool === undefined) return [undefined, undefined];

    const expectedPoolUnits = calculatePoolUnits(
      new BigNumber(nativeAmount).shiftedBy(pool.nativeAssetBalance.fractionalDigits),
      new BigNumber(externalAmount).shiftedBy(pool.externalAssetBalance.fractionalDigits),
      pool.nativeAssetBalance.atomics,
      pool.externalAssetBalance.atomics,
      pool.poolUnits,
    );

    return [
      expectedPoolUnits.toNumber(),
      expectedPoolUnits.div(expectedPoolUnits.plus(pool.poolUnits)).toNumber(),
    ] as const;
  }, [externalAmount, nativeAmount, pool]);

  const setNativeAmount = useCallback<Dispatch<SetStateAction<string>>>((value) => {
    setActiveInput("native");
    _setNativeAmount(value);
  }, []);

  const setExternalAmount = useCallback<Dispatch<SetStateAction<string>>>((value) => {
    setActiveInput("external");
    _setExternalAmount(value);
  }, []);

  useEffect(() => {
    if (pool === undefined || !symmetric) return;

    switch (activeInput) {
      case "native":
        _setExternalAmount(
          new BigNumber(nativeAmount)
            .times(pool.externalAssetBalance.toString())
            .div(pool.nativeAssetBalance.toString())
            .decimalPlaces(5)
            .toString(),
        );
        break;

      case "external":
        _setNativeAmount(
          new BigNumber(externalAmount)
            .times(pool.nativeAssetBalance.toString())
            .div(pool.externalAssetBalance.toString())
            .decimalPlaces(5)
            .toString(),
        );
    }
  }, [activeInput, externalAmount, nativeAmount, pool, setExternalAmount, setNativeAmount, symmetric]);

  return {
    nativeAmountState: [nativeAmount, setNativeAmount] as const,
    externalAmountState: [externalAmount, setExternalAmount] as const,
    nativeAmountDecimal,
    externalAmountDecimal,
    poolUnits,
    poolShare,
  };
};

export default useAddLiquidity;
