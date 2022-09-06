import type { ChangeEvent, SyntheticEvent } from "react";
import type { IAsset } from "@sifchain/common";
import type { NextPage } from "next";

import { Decimal } from "@cosmjs/math";
import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import Head from "next/head";

import { Maybe } from "@sifchain/utils";
import {
  ArrowDownIcon,
  FlashMessage5xxError,
  FlashMessageLoading,
  formatNumberAsCurrency,
  RacetrackSpinnerIcon,
  SwapIcon,
  TokenEntry,
} from "@sifchain/ui";

import { ROWAN } from "~/domains/assets";
import { useAllBalancesQuery } from "~/domains/bank/hooks/balances";
import { useMarginOpenPositionsBySymbolQuery, useMarginParamsQuery } from "~/domains/margin/hooks";
import {
  useEnhancedPoolsQuery,
  useEnhancedTokenQuery,
  useRowanPriceQuery,
  useSwapSimulationQuery,
} from "~/domains/clp/hooks";
import AssetIcon from "~/compounds/AssetIcon";
import OpenPositionsTable from "~/compounds/Margin/OpenPositionsTable";

import { ModalMTPOpen } from "./ModalMTPOpen";
import { TradeActions } from "./TradeActions";

/**
 * ********************************************************************************************
 *
 * `_trade`: Input validation for Trade page.
 * `_mockdata`: To mock React-Query and fake the Data Services reponses
 * `_intl`: Functions to format data used across Margin. They will be moved to a different place.
 *
 * ********************************************************************************************
 */
import { PoolOverview } from "./_components";
import { formatNumberAsDecimal } from "./_intl";
import {
  COLLATERAL_MAX_VALUE,
  COLLATERAL_MIN_VALUE,
  HtmlUnicode,
  inputValidatorCollateral,
  inputValidatorLeverage,
  inputValidatorPosition,
  LEVERAGE_MIN_VALUE,
  POSITION_MAX_VALUE,
  POSITION_MIN_VALUE,
  removeFirstCharsUC,
} from "./_trade";

const calculateBorrowAmount = (collateralTokenAmount: number, leverage: number) => {
  return collateralTokenAmount * leverage - collateralTokenAmount;
};

/**
 * ********************************************************************************************
 *
 * TradeCompound is responsible for:
 *   - Query list of Pools
 *   - Query list of Tokens
 *   - Query Rowan price
 *   - Query User Wallet details
 *
 * These values are required to bootstrap the Trade page
 *
 * ********************************************************************************************
 */
const TradeTab: NextPage = () => {
  const enhancedPoolsQuery = useEnhancedPoolsQuery();
  const enhancedRowanQuery = useEnhancedTokenQuery(ROWAN_DENOM);
  const rowanPriceQuery = useRowanPriceQuery();
  const govParamsQuery = useMarginParamsQuery();

  if ([enhancedPoolsQuery, enhancedRowanQuery, rowanPriceQuery, govParamsQuery].some((query) => query.isError)) {
    console.group("Trade Page Query Error");
    console.log({ enhancedPoolsQuery, enhancedRowanQuery, rowanPriceQuery, govParamsQuery });
    console.groupEnd();
    return <FlashMessage5xxError size="full-page" className="border-gold-800 mt-4 rounded border" />;
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

    return <Trade enhancedPools={filteredEnhancedPools} enhancedRowan={enhancedRowanQuery.data} govParams={params} />;
  }

  return <FlashMessageLoading size="full-page" className="border-gold-800 mt-4 rounded border" />;
};

export default TradeTab;

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
  const qsPool = router.query["pool"];

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
      const poolQueryString = String(qsPool).toLowerCase();
      const pool = pools.find(
        (pool) =>
          pool.asset.denom?.toLowerCase() === poolQueryString || pool.asset.symbol.toLowerCase() === poolQueryString,
      );
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
  const safetyFactor = Decimal.fromAtomics(props.govParams.safetyFactor, ROWAN.decimals).toFloatApproximation();

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
  const [openPositionFee, setOpenPositionFee] = useState("0");
  const computedBorrowAmount = useMemo(() => {
    return calculateBorrowAmount(Number(inputCollateral.value), Number(inputLeverage.value));
  }, [inputCollateral.value, inputLeverage.value]);

  const { recompute: calculateSwap } = useSwapSimulationQuery(
    selectedCollateral.denom ?? selectedCollateral.symbol,
    selectedPosition.denom ?? selectedPosition.symbol,
    inputCollateral.value,
  );

  const { recompute: calculateReverseSwap } = useSwapSimulationQuery(
    selectedPosition.denom ?? selectedPosition.symbol,
    selectedCollateral.denom ?? selectedCollateral.symbol,
    inputPosition.value,
  );

  const calculatePosition = useCallback(
    (inputAmount: string, leverage = inputLeverage.value) => {
      const swap = calculateSwap(String(Number(inputAmount) * Number(leverage)));
      const value = Decimal.fromAtomics(swap?.rawReceiving ?? "0", selectedPosition.decimals).toString();
      const fee = Decimal.fromAtomics(swap?.liquidityProviderFee ?? "0", selectedPosition.decimals).toString();
      return { value, fee };
    },
    [calculateSwap, inputLeverage.value, selectedPosition.decimals],
  );

  const calculateCollateral = useCallback(
    (inputAmount: string, leverage = inputLeverage.value) => {
      const swap = calculateReverseSwap(String(Number(inputAmount) * Number(leverage)));
      const value = Decimal.fromAtomics(swap?.rawReceiving ?? "0", selectedCollateral.decimals).toString();
      const fee = Decimal.fromAtomics(swap?.liquidityProviderFee ?? "0", selectedCollateral.decimals).toString();
      return { value, fee };
    },
    [calculateReverseSwap, inputLeverage.value, selectedCollateral.decimals],
  );

  /**
   * ********************************************************************************************
   *
   * "Collateral" input form handlers
   *
   * ********************************************************************************************
   */
  const onInputCollateral = useCallback(
    (event: SyntheticEvent<HTMLInputElement>) => {
      if (inputPosition.error || inputLeverage.error) {
        return;
      }

      const $target = event.target;
      if ($target instanceof HTMLInputElement) {
        const payload = inputValidatorCollateral($target, "change");
        setInputCollateral(payload);

        const positionSwap = calculatePosition(payload.value);
        setOpenPositionFee(positionSwap.fee);
        setInputPosition({
          value: positionSwap.value,
          error: "",
        });
      }
    },
    [calculatePosition, inputLeverage.error, inputPosition.error],
  );

  /**
   * ********************************************************************************************
   *
   * "Position" input form handlers
   *
   * ********************************************************************************************
   */
  const onInputPosition = useCallback(
    (event: SyntheticEvent<HTMLInputElement>) => {
      if (inputCollateral.error || inputLeverage.error) {
        return;
      }

      const $target = event.target;
      if ($target instanceof HTMLInputElement) {
        const payload = inputValidatorPosition($target, "change");
        setInputPosition(payload);

        const collateralSwap = calculateCollateral(payload.value);
        setOpenPositionFee(collateralSwap.fee);
        setInputCollateral({
          value: collateralSwap.value,
          error: "",
        });
      }
    },
    [calculateCollateral, inputCollateral.error, inputLeverage.error],
  );
  /**
   * ********************************************************************************************
   *
   * "Leverage" input form handlers
   *
   * ********************************************************************************************
   */
  const onInputLeverage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (inputCollateral.error || inputPosition.error) {
        return;
      }

      const $input = event.target;
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
    [calculatePosition, inputCollateral.value, maxLeverageDecimal, inputCollateral.error, inputPosition.error],
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
  const onModalClose = useCallback(() => {
    setModalConfirmOpenPosition({ isOpen: false });
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
        {poolActive && enhancedRowan.priceUsd ? (
          <PoolOverview
            pool={poolActive}
            assets={poolsAssets}
            rowanPriceUsd={enhancedRowan.priceUsd}
            onChangePoolSelector={onChangePoolSelector}
            safetyFactor={safetyFactor}
            interestRate={`${formatNumberAsDecimal(Number(poolActive.stats.interestRate), 8)}%`}
          />
        ) : (
          <div className="flex items-center justify-center rounded p-4 text-4xl">
            <RacetrackSpinnerIcon />
          </div>
        )}
      </section>

      <section className="mt-4 grid grid-cols-1 lg:grid-cols-7 lg:gap-x-5 ">
        <article className="border-gold-800 flex flex-col rounded border bg-gray-800 text-xs lg:col-span-2">
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
                  onInput={onInputCollateral}
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
                  onInput={onInputPosition}
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
            <li className="mt-4 grid grid-cols-6 gap-2">
              <p className="col-span-3 self-end rounded bg-gray-500 p-2 text-center text-sm font-semibold text-gray-200">
                Long
              </p>
              <div className="col-span-3 flex flex-col">
                <span className="mb-1 text-right text-xs text-gray-300">
                  <span className="mr-1">Leverage</span>
                  <span className="text-gray-400">
                    <span>Up to </span>
                    {formatNumberAsDecimal(maxLeverageDecimal.toFloatApproximation(), 2)}x
                  </span>
                </span>
                <input
                  type="number"
                  placeholder="0"
                  step="0.01"
                  min={LEVERAGE_MIN_VALUE}
                  max={maxLeverageDecimal.toString()}
                  value={inputLeverage.value}
                  onInput={onInputLeverage}
                  className={clsx("rounded border-0 bg-gray-700 text-right text-sm placeholder-white", {
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
                        <AssetIcon symbol={selectedCollateral.symbol} network="sifchain" size="sm" />
                        <span className="ml-1">{formatNumberAsDecimal(Number(inputCollateral.value), 4)}</span>
                      </div>
                    </div>
                  </li>
                  <li className="px-4">
                    <div className="flex flex-row items-center">
                      <span className="mr-auto min-w-fit text-gray-300">Borrow amount</span>
                      <div className="flex flex-row items-center">
                        <AssetIcon symbol={selectedCollateral.symbol} network="sifchain" size="sm" />
                        <span className="ml-1">{formatNumberAsDecimal(computedBorrowAmount, 4)}</span>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className="relative my-[-1em] flex items-center justify-center">
                  <div className="rounded-full border-2 border-gray-800 bg-gray-900 p-3">
                    <ArrowDownIcon className="text-lg" />
                  </div>
                </div>
                <ul className="flex flex-col gap-3">
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
                        <AssetIcon symbol={selectedPosition.symbol} network="sifchain" size="sm" />
                        <span className="ml-1">{formatNumberAsDecimal(Number(inputPosition.value), 4)}</span>
                      </div>
                    </div>
                  </li>
                  <li className="px-4">
                    <div className="flex flex-row items-center">
                      <span className="mr-auto min-w-fit text-gray-300">Fees</span>
                      <div className="flex flex-row items-center gap-1">
                        <AssetIcon symbol={selectedPosition.symbol} network="sifchain" size="sm" />
                        <span>{formatNumberAsDecimal(Number(openPositionFee), 4)}</span>
                      </div>
                    </div>
                  </li>
                  <li className="px-4">
                    <div className="flex flex-row items-center">
                      <span className="mr-auto min-w-fit text-gray-300">Opening position</span>
                      <div className="flex flex-row items-center">
                        <AssetIcon symbol={selectedPosition.symbol} network="sifchain" size="sm" />
                        <span className="ml-1">
                          {formatNumberAsDecimal(
                            Number(inputPosition.value) > 0 ? Number(inputPosition.value) - Number(openPositionFee) : 0,
                            4,
                          )}
                        </span>
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
        <article className="border-gold-800 mt-4 rounded border lg:col-span-5 lg:mt-0">
          <OpenPositionsTable
            openPositionsQuery={openPositionsBySymbolQuery}
            hideColumns={["Pool", "Paid Interest", "Interest Rate"]}
          />
        </article>
      </section>

      {selectedCollateral.denom && selectedPosition.denom && poolActive && poolActive.asset.denom ? (
        <ModalMTPOpen
          data={{
            collateralAmount: collateralAmount,
            fromDenom: selectedCollateral.denom,
            leverage: leverage,
            poolInterestRate: poolInterestRate,
            poolSymbol: poolActive.asset.denom,
            positionPriceUsd: selectedPosition.priceUsd,
            positionTokenAmount: String(
              Number(inputPosition.value) > 0 ? Number(inputPosition.value) - Number(openPositionFee) : 0,
            ),
            toDenom: selectedPosition.denom,
          }}
          isOpen={modalConfirmOpenPosition.isOpen}
          onClose={onModalClose}
          onMutationSuccess={onModalClose}
        />
      ) : null}
    </>
  );
};
