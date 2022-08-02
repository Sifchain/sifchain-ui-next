import { Decimal } from "@cosmjs/math";
import { runCatching } from "@sifchain/common";
import { calculatePoolUnits } from "@sifchain/math";
import BigNumber from "bignumber.js";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePoolQuery } from "./usePool";

const useAddLiquidity = (denom: string, symmetric = true) => {
  const poolQuery = usePoolQuery(denom);

  const [activeInput, setActiveInput] = useState<
    "native" | "external" | undefined
  >(undefined);

  const [nativeAmount, _setNativeAmount] = useState("");
  const [externalAmount, _setExternalAmount] = useState("");

  const nativeAmountDecimal = useMemo(
    () =>
      runCatching(() =>
        poolQuery.data?.pool === undefined
          ? undefined
          : Decimal.fromUserInput(
              nativeAmount,
              poolQuery.data.pool.nativeAssetBalance.fractionalDigits,
            ),
      )[1],
    [nativeAmount, poolQuery.data?.pool],
  );
  const externalAmountDecimal = useMemo(
    () =>
      runCatching(() =>
        poolQuery.data?.pool === undefined
          ? undefined
          : Decimal.fromUserInput(
              externalAmount,
              poolQuery.data.pool.externalAssetBalance.fractionalDigits,
            ),
      )[1],
    [externalAmount, poolQuery.data?.pool],
  );

  const [poolUnits, poolShare] = useMemo(() => {
    if (poolQuery.data?.pool === undefined) return [undefined, undefined];

    const expectedPoolUnits = calculatePoolUnits(
      new BigNumber(nativeAmount).shiftedBy(
        poolQuery.data.pool.nativeAssetBalance.fractionalDigits,
      ),
      new BigNumber(externalAmount).shiftedBy(
        poolQuery.data.pool.externalAssetBalance.fractionalDigits,
      ),
      poolQuery.data.pool.nativeAssetBalance.atomics,
      poolQuery.data.pool.externalAssetBalance.atomics,
      poolQuery.data.pool.poolUnits,
    );

    return [
      expectedPoolUnits.toNumber(),
      expectedPoolUnits
        .div(expectedPoolUnits.plus(poolQuery.data.pool.poolUnits))
        .toNumber(),
    ] as const;
  }, [externalAmount, nativeAmount, poolQuery.data?.pool]);

  const setNativeAmount = useCallback<Dispatch<SetStateAction<string>>>(
    (value) => {
      setActiveInput("native");
      _setNativeAmount(value);
    },
    [],
  );

  const setExternalAmount = useCallback<Dispatch<SetStateAction<string>>>(
    (value) => {
      setActiveInput("external");
      _setExternalAmount(value);
    },
    [],
  );

  useEffect(() => {
    if (poolQuery.data?.pool === undefined || !symmetric) return;

    const pool = poolQuery.data.pool;
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
  }, [
    activeInput,
    externalAmount,
    nativeAmount,
    poolQuery.data?.pool,
    setExternalAmount,
    setNativeAmount,
    symmetric,
  ]);

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
