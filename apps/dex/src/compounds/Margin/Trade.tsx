import type { ChangeEvent, SyntheticEvent } from "react";
import type { IAsset } from "@sifchain/common";
import type { NextPage } from "next";

import {
  formatNumberAsCurrency,
  Maybe,
  RacetrackSpinnerIcon,
  SwapIcon,
  TokenEntry,
  FlashMessage5xxError,
  FlashMessageLoading,
  FlashMessage,
} from "@sifchain/ui";
import { Decimal } from "@cosmjs/math";
import { pathOr } from "ramda";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import BigNumber from "bignumber.js";
import clsx from "clsx";
import Head from "next/head";

import { useAllBalancesQuery } from "~/domains/bank/hooks/balances";
import { useEnhancedPoolsQuery, useEnhancedTokenQuery, useRowanPriceQuery, useSwapSimulation } from "~/domains/clp";
import { useMarginParamsQuery, useMarginOpenPositionsBySymbolQuery } from "~/domains/margin/hooks";
import AssetIcon from "~/compounds/AssetIcon";
import OpenPositionsTable from "~/compounds/Margin/OpenPositionsTable";

/**
 * ********************************************************************************************
 *
 * `_trade`: Input validation for Trade page.
 * `_mockdata`: To mock React-Query and fake the Data Services reponses
 * `_intl`: Functions to format data used across Margin. They will be moved to a different place.
 *
 * ********************************************************************************************
 */
import { ROWAN } from "~/domains/assets";
import { TradeActions } from "./TradeActions";
import { PoolOverview } from "./_components";
import { formatNumberAsDecimal, formatNumberAsPercent } from "./_intl";
import {
  COLLATERAL_MAX_VALUE,
  COLLATERAL_MIN_VALUE,
  LEVERAGE_MIN_VALUE,
  POSITION_MAX_VALUE,
  POSITION_MIN_VALUE,
  HtmlUnicode,
  inputValidatorCollateral,
  inputValidatorLeverage,
  inputValidatorPosition,
  removeFirstCharsUC,
} from "./_trade";
import { ModalMTPOpen } from "./ModalMTPOpen";
import { useCallback } from "react";

const calculateBorrowAmount = (collateralTokenAmount: number, leverage: number) => {
  return collateralTokenAmount * leverage - collateralTokenAmount;
};
const withLeverage = (rawReceiving: string, decimals: number, leverage: string) =>
  BigNumber(Decimal.fromAtomics(rawReceiving, decimals).toString()).multipliedBy(leverage);

/**
 * ********************************************************************************************
 *
 * TradeCompound is responsible for:
 *   - Query list of Pools
 *   - Query list of Tokens
 *   - Query Rowan price
     @TODO Add query to load user wallter details
 *   - Query User Wallet details
 *
 * These values are required to bootstrap the Trade page
 *
 * ********************************************************************************************
 */
const TradeCompound: NextPage = () => {
  const enhancedPoolsQuery = useEnhancedPoolsQuery();
  const enhancedRowanQuery = useEnhancedTokenQuery(ROWAN_DENOM);
  const rowanPriceQuery = useRowanPriceQuery();
  const govParamsQuery = useMarginParamsQuery();

  if ([enhancedPoolsQuery, enhancedRowanQuery, rowanPriceQuery, govParamsQuery].some((query) => query.isError)) {
    console.group("Trade Page Query Error");
    console.log({ enhancedPoolsQuery, enhancedRowanQuery, rowanPriceQuery, govParamsQuery });
    console.groupEnd();
    return <FlashMessage5xxError size="full-page" />;
  }

  if (
    enhancedPoolsQuery.isSuccess &&
    enhancedRowanQuery.isSuccess &&
    rowanPriceQuery.isSuccess &&
    govParamsQuery.isSuccess &&
    enhancedPoolsQuery.data &&
    enhancedRowanQuery.data &&
    rowanPriceQuery.data &&
    govParamsQuery.data &&
    govParamsQuery.data.params
  ) {
    const { params } = govParamsQuery.data;
    const allowedPools = params.pools;
    const filteredEnhancedPools = enhancedPoolsQuery.data.filter((pool) =>
      allowedPools.includes(pool.asset.denom as string),
    );
    enhancedRowanQuery.data.priceUsd = rowanPriceQuery.data;
    return <Trade enhancedPools={filteredEnhancedPools} enhancedRowan={enhancedRowanQuery.data} govParams={params} />;
  }

  return <FlashMessageLoading size="full-page" />;
};

export default TradeCompound;

/**
 * ********************************************************************************************
 *
 * Trade is responsible for loading:
 *   - Query list of Open Positions based on pool active
 *   - Query list of History based on pool active
 *   - Perform trade entry calculations and trade summary
 *   - Mutate/Submit an open mtp position
 *
 * ********************************************************************************************
 */
type TradeProps = {
  enhancedPools: Exclude<ReturnType<typeof useEnhancedPoolsQuery>["data"], undefined>;
  enhancedRowan: Exclude<ReturnType<typeof useEnhancedTokenQuery>["data"], undefined>;
  govParams: Exclude<Exclude<ReturnType<typeof useMarginParamsQuery>["data"], undefined>["params"], undefined>;
};

const ROWAN_DENOM = "rowan";
const mutateDisplaySymbol = (displaySymbol: string) =>
  `${removeFirstCharsUC(displaySymbol.toUpperCase())} · ${ROWAN_DENOM.toUpperCase()}`;

const Trade = (props: TradeProps) => {
  const router = useRouter();
  const { enhancedPools, enhancedRowan } = props;

  /**
   * ********************************************************************************************
   *
   * If there's a "pool" in the URL, we use it to filter and sete the pool active based on it
   * Otherwise, return the first result of the pools list
   *
   * ********************************************************************************************
   */
  const qsPool = pathOr(undefined, ["pool"], router.query);

  const pools = useMemo(() => {
    if (enhancedPools) {
      return enhancedPools.map((pool) => {
        /**
         * We mutate `displaySymbol` used by TokenSelector to display the correct asset name
         * required by business requirements: "Display <external-asset-name> · ROWAN"
         *
         * This IS NOT a "TokenSelector item render" only problem, because the internal state
         * of TokenSelector uses the "tokens" array prop to change the value, creating a mismatch
         * we need to mutate the array passed to TokenSelector, hence this mutation here
         *
         */
        const modifiedPool = { ...pool };
        modifiedPool.asset = {
          ...pool.asset,
          displaySymbol: mutateDisplaySymbol(pool.asset.symbol),
          priceUsd: pool.stats.priceToken,
        } as IAsset & { priceUsd: number };
        return modifiedPool;
      });
    }
    return [];
  }, [enhancedPools]);
  const poolsAssets = useMemo(() => pools.map((pool) => pool.asset), [pools]);

  const poolActive = useMemo(() => {
    if (qsPool) {
      const pool = pools.find((pool) => pool.asset.denom === qsPool);
      if (pool) {
        return pool;
      }
    }

    return pools.find((pool) => pool.asset.denom === "cusdc");
  }, [pools, qsPool]);

  const openPositionsBySymbolQuery = useMarginOpenPositionsBySymbolQuery({
    poolSymbol: poolActive?.asset.denom ?? "",
  });

  /**
   * ********************************************************************************************
   *
   * Collateral default is to set the "non-rowan"/"external" asset
   *   - If doesn't exist, return ROWAN
   *
   * ********************************************************************************************
   */
  const [switchCollateralAndPosition, setSwitchCollateralAndPosition] = useState(false);

  const selectedCollateral = useMemo(() => {
    if (poolActive && switchCollateralAndPosition === false) {
      return poolActive.asset;
    }
    return enhancedRowan;
  }, [enhancedRowan, poolActive, switchCollateralAndPosition]) as IAsset & {
    priceUsd: number;
  };

  /**
   * ********************************************************************************************
   *
   * Position is derivate from Collateral + Active Pool
   *   - If Collateral equals to Active Pool, return ROWAN (native)
   *   - If Collateral is not equals to Active Pool, return Pool Asset (external)
   *
   * ********************************************************************************************
   */
  const selectedPosition = useMemo(() => {
    if (!poolActive || (poolActive && poolActive.asset.denom === selectedCollateral.denom)) {
      return enhancedRowan;
    }

    return poolActive.asset;
  }, [selectedCollateral.denom, poolActive, enhancedRowan]) as IAsset & {
    priceUsd: number;
  };

  const maxLeverageDecimal = Decimal.fromAtomics(props.govParams.leverageMax, ROWAN.decimals);

  /**
   * ********************************************************************************************
   *
   * Input validation and "Open position" disabling derivate
   *
   * ********************************************************************************************
   */
  const [inputCollateral, setInputCollateral] = useState({
    value: "",
    error: "",
  });

  const [inputPosition, setInputPosition] = useState({
    value: "",
    error: "",
  });

  const [inputLeverage, setInputLeverage] = useState({
    value: maxLeverageDecimal.toString(),
    error: "",
  });

  const { findBySymbolOrDenom: findBalanceBySymbolOrDenom } = useAllBalancesQuery();

  const positionBalance = useMemo(
    () =>
      selectedPosition ? findBalanceBySymbolOrDenom(selectedPosition.denom ?? selectedPosition.symbol) : undefined,
    [findBalanceBySymbolOrDenom, selectedPosition],
  );

  const positionDollarValue = useMemo(() => {
    if (!selectedPosition || !inputPosition.value || !poolActive) {
      return 0;
    }

    const tokenPrice = selectedPosition.denom === ROWAN_DENOM ? enhancedRowan.priceUsd : poolActive.stats.priceToken;

    return (tokenPrice ?? 0) * Number(inputPosition.value);
  }, [selectedPosition, inputPosition.value, poolActive, enhancedRowan.priceUsd]);

  const collateralBalance = useMemo(
    () =>
      selectedCollateral
        ? findBalanceBySymbolOrDenom(selectedCollateral.denom ?? selectedCollateral.symbol)
        : undefined,
    [findBalanceBySymbolOrDenom, selectedCollateral],
  );

  const collateralDollarValue = useMemo(() => {
    if (!selectedCollateral || !inputCollateral.value || !poolActive) {
      return 0;
    }

    const tokenPrice = selectedCollateral.denom === ROWAN_DENOM ? enhancedRowan.priceUsd : poolActive.stats.priceToken;

    if (typeof tokenPrice === "undefined") {
      return 0;
    }

    return tokenPrice * Number(inputCollateral.value);
  }, [selectedCollateral, inputCollateral.value, poolActive, enhancedRowan.priceUsd]);

  const isDisabledOpenPosition = useMemo(() => {
    return (
      Boolean(inputCollateral.error) ||
      Boolean(inputPosition.error) ||
      Boolean(inputLeverage.error) ||
      Boolean(inputCollateral.value) === false ||
      Boolean(inputPosition.value) === false ||
      inputCollateral.value === "0" ||
      inputPosition.value === "0"
    );
  }, [inputCollateral.error, inputPosition.error, inputLeverage.error, inputCollateral.value, inputPosition.value]);

  /**
   * ********************************************************************************************
   *
   * "Confirm open position" modal
   *
   * ********************************************************************************************
   */
  const computedBorrowAmount = useMemo(() => {
    return calculateBorrowAmount(Number(inputCollateral.value), Number(inputLeverage.value));
  }, [inputCollateral.value, inputLeverage.value]);

  const { recompute: calculateSwap, data: swapSimulation } = useSwapSimulation(
    selectedCollateral.denom ?? selectedCollateral.symbol,
    selectedPosition.denom ?? selectedPosition.symbol,
    inputCollateral.value,
  );

  const openPositionFee = useMemo(() => {
    try {
      return Maybe.of(swapSimulation?.liquidityProviderFee).mapOr(0, (x) =>
        Decimal.fromAtomics(x, selectedPosition.decimals).toFloatApproximation(),
      );
    } catch (error) {
      console.group("Open Position Fee Swap LP Fee");
      console.log({ error });
      console.groupEnd();
      return 0;
    }
  }, [swapSimulation, selectedPosition]);

  const { recompute: calculateReverseSwap } = useSwapSimulation(
    selectedPosition.denom ?? selectedPosition.symbol,
    selectedCollateral.denom ?? selectedCollateral.symbol,
    inputPosition.value,
  );

  const calculatePosition = useCallback(
    (inputAmount: string, leverage = inputLeverage.value) =>
      withLeverage(calculateSwap(inputAmount)?.rawReceiving || "0", selectedPosition.decimals, leverage),
    [calculateSwap, inputLeverage.value, selectedPosition.decimals],
  );

  const calculateCollateral = useCallback(
    (inputAmount: string, leverage = inputLeverage.value) =>
      withLeverage(calculateReverseSwap(inputAmount)?.rawReceiving || "0", selectedCollateral.decimals, leverage),
    [calculateReverseSwap, inputLeverage.value, selectedCollateral.decimals],
  );

  /**
   * ********************************************************************************************
   *
   * "Collateral" input form handlers
   *
   * ********************************************************************************************
   */
  const onChangeCollateral = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const $input = event.currentTarget;
      const payload = inputValidatorCollateral($input, "change");

      const positionInputAmount = calculatePosition(payload.value);

      setInputCollateral(payload);
      setInputPosition({
        value: String(positionInputAmount),
        error: "",
      });
    },
    [calculatePosition],
  );

  /**
   * ********************************************************************************************
   *
   * "Position" input form handlers
   *
   * ********************************************************************************************
   */
  const onChangePosition = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const $input = event.currentTarget;
      const payload = inputValidatorPosition($input, "change");

      const collateralInputAmount = calculateCollateral(payload.value);

      setInputPosition(payload);
      setInputCollateral({
        value: String(collateralInputAmount),
        error: "",
      });
    },
    [calculateCollateral],
  );

  /**
   * ********************************************************************************************
   *
   * "Leverage" input form handlers
   *
   * ********************************************************************************************
   */
  const onChangeLeverage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const $input = event.currentTarget;
      const payload = inputValidatorLeverage($input, "change", maxLeverageDecimal.toString());

      if (!payload.error) {
        const positionInputAmount = calculatePosition(inputCollateral.value, payload.value);

        setInputPosition({
          value: positionInputAmount.toString(),
          error: "",
        });
      }

      setInputLeverage(payload);
    },
    [calculatePosition, inputCollateral.value, maxLeverageDecimal],
  );

  /**
   * ********************************************************************************************
   *
   * "Review trade" form handlers
   *
   * ********************************************************************************************
   */
  const onClickReset = useCallback(
    (event: SyntheticEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setInputCollateral({
        value: "",
        error: "",
      });
      setInputPosition({
        value: "",
        error: "",
      });
      setInputLeverage({
        value: maxLeverageDecimal.toString(),
        error: "",
      });
    },
    [maxLeverageDecimal],
  );

  /**
   * We using small numbers (eg. 0.0001), the "Decimal" throws an error when switching between tokens
   * Wrapping it in a try..catch to avoid breaking the UI
   */
  const { collateralAmount, leverage } = useMemo(() => {
    let collateralAmount = "0";
    let leverage = "0";
    try {
      collateralAmount = Decimal.fromUserInput(inputCollateral.value, selectedCollateral.decimals).atomics;
      leverage = Decimal.fromUserInput(inputLeverage.value, ROWAN.decimals).atomics;
    } finally {
      return { collateralAmount, leverage };
    }
  }, [inputCollateral.value, inputLeverage.value, selectedCollateral.decimals]);

  const [modalConfirmOpenPosition, setModalConfirmOpenPosition] = useState({
    isOpen: false,
  });
  const onClickOpenPosition = useCallback((event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setModalConfirmOpenPosition({ isOpen: true });
  }, []);

  /**
   * ********************************************************************************************
   *
   * "Pool Selector" values and handlers
   *
   * ********************************************************************************************
   */
  const onChangePoolSelector = useCallback(
    (token: TokenEntry) => {
      router.push(
        {
          query: {
            ...router.query,
            pool: token.symbol.toLowerCase(),
          },
        },
        undefined,
        {
          scroll: false,
        },
      );
      setInputCollateral({
        value: "",
        error: "",
      });
      setInputPosition({
        value: "",
        error: "",
      });
      setInputLeverage({
        value: maxLeverageDecimal.toString(),
        error: "",
      });
    },
    [maxLeverageDecimal, router],
  );

  const onClickSwitch = useCallback(
    (event: SyntheticEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setInputCollateral((prev) => ({
        ...prev,
        value: inputPosition.value,
      }));
      setInputPosition((prev) => ({
        ...prev,
        value: inputCollateral.value,
      }));
      setSwitchCollateralAndPosition((prev) => !prev);
    },
    [inputCollateral.value, inputPosition.value],
  );

  const poolInterestRate = `${formatNumberAsDecimal(poolActive ? poolActive.stats.interestRate : 0, 8)}%`;

  return (
    <>
      <Head>
        <title>Sichain Dex - Margin - Trade</title>
      </Head>
      <section className="border-gold-800 mt-4 rounded border bg-gray-800 text-xs">
        {poolActive ? (
          <PoolOverview
            pool={poolActive}
            assets={poolsAssets}
            rowanPriceUsd={enhancedRowan.priceUsd}
            onChangePoolSelector={onChangePoolSelector}
          />
        ) : (
          <div className="flex items-center justify-center rounded p-4 text-4xl">
            <RacetrackSpinnerIcon />
          </div>
        )}
      </section>

      <section className="mt-4 grid grid-cols-7 gap-x-5">
        <article className="border-gold-800 col-span-2 flex flex-col rounded border bg-gray-800 text-xs">
          <ul className="border-gold-800 flex flex-col gap-0 border-b p-4">
            <li className="flex flex-col">
              <div className="mb-1 flex flex-row text-xs">
                <span className="mr-auto">Collateral</span>
                <span className="text-gray-300">
                  Balance:
                  <span className="ml-1">
                    {formatNumberAsDecimal(collateralBalance?.amount?.toFloatApproximation() ?? 0)}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-row items-center gap-2.5 rounded bg-gray-700 p-2 text-sm font-semibold text-white">
                  {selectedCollateral && selectedCollateral.symbol ? (
                    <>
                      <AssetIcon symbol={selectedCollateral.symbol} network="sifchain" size="sm" />
                      <span>{removeFirstCharsUC(selectedCollateral.symbol)}</span>
                    </>
                  ) : (
                    <RacetrackSpinnerIcon />
                  )}
                </div>
                <input
                  type="number"
                  placeholder="0"
                  step="0.01"
                  min={COLLATERAL_MIN_VALUE}
                  max={COLLATERAL_MAX_VALUE}
                  value={inputCollateral.value}
                  onChange={onChangeCollateral}
                  className={clsx("rounded border-0 bg-gray-700 text-right text-sm font-semibold placeholder-white", {
                    "ring ring-red-600 focus:ring focus:ring-red-600": inputCollateral.error,
                  })}
                />
              </div>
              {inputCollateral.error ? (
                <span className="radious col-span-6 my-2 rounded border border-red-700 bg-red-200 p-2 text-right text-red-700">
                  {inputCollateral.error}
                </span>
              ) : (
                <span className="mt-1 text-right text-gray-300">
                  <HtmlUnicode name="EqualsSign" />
                  <span className="ml-1">{formatNumberAsCurrency(collateralDollarValue, 4)}</span>
                </span>
              )}
            </li>
            <li className="relative flex items-center justify-center py-5">
              <div className="h-[2px] w-full bg-gray-900" />
              <button
                type="button"
                onClick={onClickSwitch}
                className={clsx(
                  "absolute rounded-full border-2 border-gray-800 bg-gray-900 p-3 text-lg transition-transform hover:scale-125",
                  switchCollateralAndPosition ? "rotate-180" : "rotate-0",
                )}
              >
                <SwapIcon />
              </button>
            </li>
            <li className="flex flex-col">
              <div className="mb-1 flex flex-row text-xs">
                <span className="mr-auto">Position</span>
                <span className="text-gray-300">
                  Balance:
                  <span className="ml-1">
                    {formatNumberAsDecimal(positionBalance?.amount?.toFloatApproximation() ?? 0)}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-row items-center gap-2.5 rounded bg-gray-700 p-2 text-sm font-semibold text-white">
                  {selectedPosition && selectedPosition.symbol ? (
                    <>
                      <AssetIcon symbol={selectedPosition.symbol} network="sifchain" size="sm" />
                      <span>{removeFirstCharsUC(selectedPosition.symbol)}</span>
                    </>
                  ) : null}
                </div>
                <input
                  type="number"
                  placeholder="0"
                  step="0.01"
                  min={POSITION_MIN_VALUE}
                  max={POSITION_MAX_VALUE}
                  value={inputPosition.value}
                  onChange={onChangePosition}
                  className={clsx("rounded border-0 bg-gray-700 text-right text-sm font-semibold placeholder-white", {
                    "ring ring-red-600 focus:ring focus:ring-red-600": inputPosition.error,
                  })}
                />
              </div>
              {inputPosition.error ? (
                <span className="radious col-span-6 mt-2 rounded border border-red-700 bg-red-200 p-2 text-right text-red-700">
                  {inputPosition.error}
                </span>
              ) : (
                <span className="mt-1 text-right text-gray-300">
                  <HtmlUnicode name="EqualsSign" />
                  <span className="ml-1">{formatNumberAsCurrency(positionDollarValue, 4)}</span>
                </span>
              )}
            </li>
            <li className="mt-2 grid grid-cols-6 gap-2">
              <p className="col-span-3 self-end rounded bg-gray-500 p-2 text-center text-sm font-semibold text-gray-200">
                Long
              </p>
              <div className="col-span-3 flex flex-col">
                <span className="mb-1 text-xs text-gray-300">
                  <span className="mr-1">Leverage</span>
                  <span className="text-gray-400">
                    <span>Up to </span>
                    {formatNumberAsDecimal(maxLeverageDecimal.toFloatApproximation(), 2)}x
                  </span>
                </span>
                <input
                  type="number"
                  placeholder="Leverage amount"
                  step="0.01"
                  min={LEVERAGE_MIN_VALUE}
                  max={maxLeverageDecimal.toString()}
                  value={inputLeverage.value}
                  onChange={onChangeLeverage}
                  className={clsx("rounded border-0 bg-gray-700 text-right text-sm", {
                    "ring ring-red-600 focus:ring focus:ring-red-600": inputLeverage.error,
                  })}
                />
              </div>
              {Boolean(inputLeverage.error) && (
                <span className="radious col-span-6 rounded border border-red-700 bg-red-200 p-2 text-right text-red-700">
                  {inputLeverage.error}
                </span>
              )}
            </li>
          </ul>
          {selectedCollateral &&
          selectedCollateral.symbol &&
          selectedPosition &&
          selectedPosition.symbol &&
          selectedPosition.priceUsd ? (
            <>
              <div className="p-4">
                <p className="text-center text-base">Review trade</p>
                <ul className="mt-4 flex flex-col gap-3">
                  <li className="bg-gray-850 flex flex-row items-center rounded-lg py-2 px-4 text-base font-semibold">
                    <AssetIcon symbol={selectedCollateral.symbol} network="sifchain" size="sm" />
                    <span className="ml-1">{removeFirstCharsUC(selectedCollateral.symbol)}</span>
                  </li>
                  <li className="px-4">
                    <div className="flex flex-row items-center">
                      <span className="mr-auto min-w-fit text-gray-300">Collateral</span>
                      <div className="flex flex-row items-center">
                        <span className="mr-1">{formatNumberAsDecimal(Number(inputCollateral.value), 4)}</span>
                        <AssetIcon symbol={selectedCollateral.symbol} network="sifchain" size="sm" />
                      </div>
                    </div>
                  </li>
                  <li className="px-4">
                    <div className="flex flex-row items-center">
                      <span className="mr-auto min-w-fit text-gray-300">Borrow amount</span>
                      <div className="flex flex-row items-center">
                        <span className="mr-1">{formatNumberAsDecimal(computedBorrowAmount, 4)}</span>
                        <AssetIcon symbol={selectedCollateral.symbol} network="sifchain" size="sm" />
                      </div>
                    </div>
                  </li>
                </ul>
                <ul className="mt-8 flex flex-col gap-3">
                  <li className="bg-gray-850 flex flex-row items-center rounded-lg py-2 px-4 text-base font-semibold">
                    <AssetIcon symbol={selectedPosition.symbol} network="sifchain" size="sm" />
                    <span className="ml-1">{removeFirstCharsUC(selectedPosition.symbol)}</span>
                  </li>
                  <li className="px-4">
                    <div className="flex flex-row items-center">
                      <span className="mr-auto min-w-fit text-gray-300">Entry price</span>
                      <span>{formatNumberAsCurrency(selectedPosition.priceUsd, 4)}</span>
                    </div>
                  </li>
                  <li className="px-4">
                    <div className="flex flex-row items-center">
                      <span className="mr-auto min-w-fit text-gray-300">Position size</span>
                      <div className="flex flex-row items-center">
                        <span className="mr-1">{formatNumberAsDecimal(Number(inputPosition.value), 4)}</span>
                        <AssetIcon symbol={selectedPosition.symbol} network="sifchain" size="sm" />
                      </div>
                    </div>
                  </li>
                  <li className="px-4">
                    <div className="flex flex-row items-center">
                      <span className="mr-auto min-w-fit text-gray-300">Fees</span>
                      <div className="flex flex-row items-center gap-1">
                        <span>{formatNumberAsDecimal(openPositionFee, 4)}</span>
                        <AssetIcon symbol={selectedPosition.symbol} network="sifchain" size="sm" />
                      </div>
                    </div>
                  </li>
                  <li className="px-4">
                    <div className="flex flex-row items-center">
                      <span className="mr-auto min-w-fit text-gray-300">Opening position</span>
                      <div className="flex flex-row items-center">
                        <span className="mr-1">
                          {formatNumberAsDecimal(
                            Number(inputPosition.value) > 0 ? Number(inputPosition.value) - openPositionFee : 0,
                            4,
                          )}
                        </span>
                        <AssetIcon symbol={selectedPosition.symbol} network="sifchain" size="sm" />
                      </div>
                    </div>
                  </li>
                  {poolActive ? (
                    <li className="px-4">
                      <div className="flex flex-row items-center">
                        <span className="mr-auto min-w-fit text-gray-300">Current interest rate</span>
                        <span>{poolInterestRate}</span>
                      </div>
                    </li>
                  ) : null}
                </ul>
              </div>
              <FlashMessage className="m-4">
                <b>Warning:</b> The field <b>Fees</b> have been disabled in all calculations until we implement the Flat
                Fee rate.
              </FlashMessage>
              <TradeActions
                govParams={props.govParams}
                onClickReset={onClickReset}
                isDisabledOpenPosition={isDisabledOpenPosition}
                onClickOpenPosition={onClickOpenPosition}
              />
            </>
          ) : (
            <div className="bg-gray-850 m-4 flex items-center justify-center rounded p-2 text-4xl">
              <RacetrackSpinnerIcon />
            </div>
          )}
        </article>
        <article className="border-gold-800 col-span-5 rounded border">
          <OpenPositionsTable openPositionsQuery={openPositionsBySymbolQuery} hideColumns={["Pool", "Interest Paid"]} />
        </article>
      </section>

      <ModalMTPOpen
        data={{
          collateralAmount: collateralAmount,
          fromDenom: selectedCollateral.symbol.toLowerCase(),
          leverage: leverage,
          poolInterestRate: poolInterestRate,
          positionPriceUsd: selectedPosition.priceUsd,
          positionTokenAmount: formatNumberAsDecimal(
            Number(inputPosition.value) > 0 ? Number(inputPosition.value) - openPositionFee : 0,
            4,
          ),
          toDenom: selectedPosition.symbol.toLowerCase(),
        }}
        isOpen={modalConfirmOpenPosition.isOpen}
        onClose={() => {
          setModalConfirmOpenPosition({ isOpen: false });
        }}
        onMutationSuccess={() => {
          setModalConfirmOpenPosition({ isOpen: false });
        }}
      />
    </>
  );
};
