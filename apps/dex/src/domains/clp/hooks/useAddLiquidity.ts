import BigNumber from "bignumber.js";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import useSifnodeQuery from "~/hooks/useSifnodeQuery";
import { isNilOrWhitespace } from "~/utils/string";

const useAddLiquidity = (denom: string, symmetric = true) => {
  const poolQuery = useSifnodeQuery("clp.getPool", [{ symbol: denom }], {
    enabled: !isNilOrWhitespace(denom),
  });

  const [activeInput, setActiveInput] = useState<
    "native" | "external" | undefined
  >(undefined);

  const [nativeAmount, _setNativeAmount] = useState("");
  const [externalAmount, _setExternalAmount] = useState("");

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
            .times(pool.externalAssetBalance)
            .div(pool.nativeAssetBalance)
            .decimalPlaces(5)
            .toString(),
        );
        break;

      case "external":
        _setNativeAmount(
          new BigNumber(externalAmount)
            .times(pool.nativeAssetBalance)
            .div(pool.externalAssetBalance)
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
  };
};

export default useAddLiquidity;
