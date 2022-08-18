import { runCatching } from "@sifchain/common";
import BigNumber from "bignumber.js";
import { useMemo, useState } from "react";
import { useLiquidityProviderQuery } from "../hooks/liquidityProvider";

const useUnlockLiquidity = (denom: string) => {
  const { data: liquidityProviderRes } = useLiquidityProviderQuery(denom);

  const [unlockPercentage, setUnlockPercentage] = useState("0");
  const [_, parsedUnlockPercentage] = runCatching(() => parseFloat(unlockPercentage));

  const units = useMemo(
    () =>
      new BigNumber(liquidityProviderRes?.liquidityProvider?.liquidityProviderUnits ?? 0).times(
        parsedUnlockPercentage ?? 0,
      ),
    [liquidityProviderRes?.liquidityProvider?.liquidityProviderUnits, parsedUnlockPercentage],
  );

  const nativeAssetAmount = useMemo(
    () => (liquidityProviderRes?.nativeAssetBalance.toFloatApproximation() ?? 0) * (parsedUnlockPercentage ?? 0),
    [liquidityProviderRes?.nativeAssetBalance, parsedUnlockPercentage],
  );

  const externalAssetAmount = useMemo(
    () => (liquidityProviderRes?.externalAssetBalance.toFloatApproximation() ?? 0) * (parsedUnlockPercentage ?? 0),
    [liquidityProviderRes?.externalAssetBalance, parsedUnlockPercentage],
  );

  return {
    isReady: liquidityProviderRes !== undefined,
    unlockPercentageState: [unlockPercentage, setUnlockPercentage] as const,
    units: units.toFixed(0),
    nativeAssetAmount,
    externalAssetAmount,
  };
};

export default useUnlockLiquidity;
