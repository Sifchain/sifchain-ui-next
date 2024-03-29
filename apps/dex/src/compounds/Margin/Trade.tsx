import { Decimal } from "@cosmjs/math";
import type { IAsset } from "@sifchain/common";
import {
  ArrowDownIcon,
  FlashMessage,
  FlashMessage5xxError,
  FlashMessageLoading,
  formatNumberAsCurrency,
  PlusIcon,
  RacetrackSpinnerIcon,
  SwapIcon,
  TokenEntry,
} from "@sifchain/ui";
import BigNumber from "bignumber.js";
import clsx from "clsx";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, SyntheticEvent, useCallback, useEffect, useMemo, useState } from "react";

import OpenPositionsTable from "~/compounds/Margin/OpenPositionsTable";
import { ROWAN } from "~/domains/assets";
import { useAllBalancesQuery } from "~/domains/bank/hooks/balances";
import {
  useEnhancedPoolsQuery,
  useEnhancedTokenQuery,
  useMarginPositionSimulationQuery,
  useRowanPriceQuery,
} from "~/domains/clp/hooks";
import {
  useMarginMTPOpenMutation,
  useMarginOpenPositionsBySymbolQuery,
  useMarginParamsQuery,
} from "~/domains/margin/hooks";
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
import { AssetHeading, PoolOverview, TradeAssetField, TradeDetails, TradeReviewSeparator } from "./_components";
import { formatNumberAsDecimal, formatNumberAsPercent } from "./_intl";
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
  enhancedPools: NonNullable<ReturnType<typeof useEnhancedPoolsQuery>["data"]>;
  enhancedRowan: NonNullable<ReturnType<typeof useEnhancedTokenQuery>["data"]>;
  govParams: NonNullable<NonNullable<ReturnType<typeof useMarginParamsQuery>["data"]>["params"]>;
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

    // defaults to CUSDC with fallback to first pool in the list
    return pools.find((pool) => pool.asset.denom === "cusdc") ?? pools[0];
  }, [pools, qsPool]);

  const openPositionsBySymbolQuery = useMarginOpenPositionsBySymbolQuery({
    poolSymbol: poolActive?.asset.symbol.toLowerCase() ?? "",
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

  const positionBalance = useMemo(() => {
    const balance = findBalanceBySymbolOrDenom(selectedPosition.denom ?? selectedPosition.symbol);
    if (balance && balance.amount) {
      return balance.amount.toFloatApproximation();
    }
    return 0;
  }, [findBalanceBySymbolOrDenom, selectedPosition]);

  const positionDollarValue = useMemo(() => {
    if (!selectedPosition || !inputPosition.value || !poolActive) {
      return 0;
    }

    const tokenPrice = selectedPosition.denom === ROWAN_DENOM ? enhancedRowan.priceUsd : poolActive.stats.priceToken;

    return (tokenPrice ?? 0) * Number(inputPosition.value);
  }, [selectedPosition, inputPosition.value, poolActive, enhancedRowan.priceUsd]);

  const collateralBalance = useMemo(() => {
    const balance = findBalanceBySymbolOrDenom(selectedCollateral.denom ?? selectedCollateral.symbol);
    if (balance && balance.amount) {
      return balance.amount.toFloatApproximation();
    }
    return 0;
  }, [findBalanceBySymbolOrDenom, selectedCollateral]);

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

  const { recompute: calculateSwap, swapFeeRate } = useMarginPositionSimulationQuery(
    selectedCollateral.denom ?? selectedCollateral.symbol,
    selectedPosition.denom ?? selectedPosition.symbol,
    inputCollateral.value,
    Number(inputLeverage.value),
  );

  const { recompute: calculateReverseSwap } = useMarginPositionSimulationQuery(
    selectedPosition.denom ?? selectedPosition.symbol,
    selectedCollateral.denom ?? selectedCollateral.symbol,
    inputPosition.value,
    1 / Number(inputLeverage.value),
  );

  const [priceImpact, setPriceImpact] = useState(0);

  const calculatePosition = useCallback(
    (inputAmount: string, leverage = inputLeverage.value) => {
      const input = BigNumber(inputAmount);
      const swap = calculateSwap(input.toString(), Number(leverage));

      const fee = Decimal.fromAtomics(swap?.liquidityProviderFee ?? "0", selectedPosition.decimals);
      const value = Decimal.fromAtomics(swap?.rawReceiving ?? "0", selectedPosition.decimals);

      setPriceImpact(swap?.priceImpact ?? 0);

      return {
        value: value.toString(),
        fee: fee.toString(),
      };
    },
    [calculateSwap, inputLeverage.value, selectedPosition.decimals],
  );

  const calculateCollateral = useCallback(
    (inputAmount: string, leverage = inputLeverage.value) => {
      const input = BigNumber(inputAmount);
      const swap = calculateReverseSwap(input.toString(), 1 / Number(leverage));

      const fee = Decimal.fromAtomics(swap?.liquidityProviderFee ?? "0", selectedCollateral.decimals);
      const value = Decimal.fromAtomics(swap?.rawReceiving ?? "0", selectedCollateral.decimals);

      const valuePlusFee = value.plus(fee);
      const currentPercentage = 100 - Number(swapFeeRate) * 100;

      const extrapolatedValue = BigNumber(valuePlusFee.toString()).multipliedBy(100).dividedBy(currentPercentage);

      const { fee: positionFee } = calculatePosition(extrapolatedValue.toString(), leverage);

      return {
        value: extrapolatedValue.toString(),
        fee: positionFee.toString(),
      };
    },
    [calculatePosition, calculateReverseSwap, inputLeverage.value, selectedCollateral.decimals, swapFeeRate],
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
      const $target = event.target;
      if ($target instanceof HTMLInputElement) {
        const payload = inputValidatorCollateral($target, collateralBalance);

        const positionSwap = calculatePosition(payload.value);

        if (positionSwap.value === "0" && !payload.error) {
          // if the resulting position value is 0 and the collateral value passes the input validations,
          // then the collateral value is too small,
          // this is an edge case and shouldn't happen with real positions

          setInputCollateral({
            value: payload.value,
            error: "Collateral amount is still too small. Please enter a larger number.",
          });
        } else {
          setInputCollateral(payload);
        }

        setOpenPositionFee(positionSwap.fee);
        setInputPosition({
          value: positionSwap.value,
          error: "",
        });
      }
    },
    [calculatePosition, collateralBalance],
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
      const $target = event.target;
      if ($target instanceof HTMLInputElement) {
        const payload = inputValidatorPosition($target);
        setInputPosition(payload);

        const collateralSwap = calculateCollateral(payload.value);
        const validateCollateral = inputValidatorCollateral(
          { value: collateralSwap.value } as HTMLInputElement,
          collateralBalance,
        );
        setOpenPositionFee(collateralSwap.fee);
        setInputCollateral(validateCollateral);
      }
    },
    [calculateCollateral, collateralBalance],
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
      const $target = event.target;
      if ($target instanceof HTMLInputElement) {
        const payload = inputValidatorLeverage($target, maxLeverageDecimal.toString());
        setInputLeverage(payload);

        const positionSwap = calculatePosition(inputCollateral.value, payload.value);
        setOpenPositionFee(positionSwap.fee);
        setInputPosition({
          value: positionSwap.value,
          error: "",
        });
      }
    },
    [calculatePosition, inputCollateral.value, maxLeverageDecimal],
  );

  const minimumCollateral = useMemo(() => {
    const interestMinAsNumber = Decimal.fromAtomics(
      props.govParams.interestRateMin,
      ROWAN.decimals,
    ).toFloatApproximation();

    const collateralDecimalsFactor = 10 ** selectedCollateral.decimals;

    const minimumCollateral = 1 / ((Number(inputLeverage.value) - 1) * interestMinAsNumber) / collateralDecimalsFactor;

    return minimumCollateral;
  }, [props.govParams.interestRateMin, inputLeverage.value, selectedCollateral.decimals]);

  useEffect(() => {
    const isCollateralValid = !inputCollateral.value;

    if (!isCollateralValid && Number(inputCollateral.value) < minimumCollateral) {
      setInputCollateral({
        value: inputCollateral.value,
        error: `Minimum collateral is ${formatNumberAsDecimal(minimumCollateral, 12)}`,
      });
      return;
    }

    if (!isCollateralValid && priceImpact > 0.01) {
      setInputCollateral({
        value: inputCollateral.value,
        error: `Price impact is too high (${formatNumberAsPercent(priceImpact)}). Please reduce the collateral amount`,
      });
    }
  }, [inputCollateral.value, minimumCollateral, priceImpact]);

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
   * When using small numbers (eg. 0.0001), the "Decimal" throws an error when switching between tokens
   * Wrapping it in a try..catch to avoid breaking the UI
   */
  const mutationAmounts = useMemo(() => {
    let collateralAmount = "0";
    let leverage = "0";
    try {
      collateralAmount = Decimal.fromUserInput(inputCollateral.value, selectedCollateral.decimals).atomics;
      leverage = Decimal.fromUserInput(inputLeverage.value, ROWAN.decimals).atomics;
    } finally {
      return { collateralAmount, leverage };
    }
  }, [inputCollateral.value, inputLeverage.value, selectedCollateral.decimals]);

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
      const validateCollateral = inputValidatorCollateral(
        { value: inputPosition.value } as HTMLInputElement,
        collateralBalance,
      );
      setInputCollateral(validateCollateral);

      const validatePosition = inputValidatorPosition({ value: inputCollateral.value } as HTMLInputElement);
      setInputPosition(validatePosition);
      setSwitchCollateralAndPosition((prev) => !prev);
    },
    [collateralBalance, inputCollateral.value, inputPosition.value],
  );

  const confirmOpenPositionMutation = useMarginMTPOpenMutation({
    poolSymbol: poolActive?.asset.denom ?? "",
    _optimisticCustodyAmount: String(Number(inputPosition.value) > 0 ? Number(inputPosition.value) : 0),
  });

  const onClickConfirmOpenPosition = async (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await confirmOpenPositionMutation.mutateAsync({
        collateralAsset: selectedCollateral.denom ?? "",
        borrowAsset: selectedPosition.denom ?? "",
        position: 1, // LONG
        collateralAmount: mutationAmounts.collateralAmount,
        leverage: mutationAmounts.leverage,
      });
    } catch (err) {
      //
    }
  };

  const isRowanCollateralEnabled = props.govParams.rowanCollateralEnabled;

  return (
    <>
      <Head>
        <title>Sichain Dex - Margin - Trade</title>
      </Head>
      <section className="mt-4 rounded bg-gray-900 text-xs">
        {poolActive && enhancedRowan.priceUsd ? (
          <PoolOverview
            pool={poolActive}
            assets={poolsAssets}
            rowanPriceUsd={enhancedRowan.priceUsd}
            onChangePoolSelector={onChangePoolSelector}
            safetyFactor={safetyFactor}
            interestRate={`${formatNumberAsDecimal(Number(poolActive.stats.interestRate) * 100, 8)}%`}
          />
        ) : (
          <div className="flex items-center justify-center rounded p-4 text-4xl">
            <RacetrackSpinnerIcon />
          </div>
        )}
      </section>

      <section className="mt-4 grid grid-cols-1 lg:grid-cols-7 lg:gap-x-5 ">
        <article className="flex flex-col rounded bg-gray-900 text-xs lg:col-span-2">
          <ul className="flex flex-col p-4">
            <li className="flex flex-col">
              <TradeAssetField
                label="Collateral"
                balance={formatNumberAsDecimal(collateralBalance)}
                symbol={selectedCollateral.symbol}
                dollarValue={formatNumberAsCurrency(collateralDollarValue, 4)}
                min={COLLATERAL_MIN_VALUE}
                max={COLLATERAL_MAX_VALUE}
                value={inputCollateral.value}
                errorMessage={inputCollateral.error}
                onInput={onInputCollateral}
                onMax={() => {
                  setInputCollateral({
                    value: String(collateralBalance ?? 0),
                    error: "",
                  });
                }}
              />
            </li>
            <li className="relative flex items-center justify-center py-5">
              <div className="h-[2px] w-full bg-gray-800" />
              <button
                type="button"
                onClick={onClickSwitch}
                disabled={!isRowanCollateralEnabled}
                className={clsx(
                  "absolute rounded-full border-2 border-gray-800 bg-gray-900 p-3 text-lg transition-transform",
                  switchCollateralAndPosition ? "rotate-180" : "rotate-0",
                  {
                    "hover:scale-125": isRowanCollateralEnabled,
                  },
                )}
              >
                {!isRowanCollateralEnabled ? <ArrowDownIcon /> : <SwapIcon />}
              </button>
            </li>
            <li className="flex flex-col">
              <TradeAssetField
                label="Position"
                balance={formatNumberAsDecimal(positionBalance)}
                symbol={selectedPosition.symbol}
                dollarValue={formatNumberAsCurrency(positionDollarValue, 4)}
                min={POSITION_MIN_VALUE}
                max={POSITION_MAX_VALUE}
                value={inputPosition.value}
                errorMessage={inputPosition.error}
                onInput={onInputPosition}
              />
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
              <section className="p-4" aria-label="review trade">
                <header className="text-center text-base">Review trade</header>
                <section className="mt-4 grid gap-3" aria-label="review collateral">
                  <AssetHeading symbol={selectedCollateral.symbol} />
                  <TradeDetails
                    heading={[
                      "Position size",
                      <>
                        {formatNumberAsDecimal(Number(inputCollateral.value) * Number(inputLeverage.value), 4)}{" "}
                        {removeFirstCharsUC(selectedCollateral.symbol)}
                      </>,
                    ]}
                    details={[
                      [
                        "Collateral",
                        <>
                          {formatNumberAsDecimal(Number(inputCollateral.value), 4)}{" "}
                          {removeFirstCharsUC(selectedCollateral.symbol)}
                        </>,
                      ],
                      [
                        "Borrow amount",
                        <>
                          {formatNumberAsDecimal(computedBorrowAmount, 4)}{" "}
                          {removeFirstCharsUC(selectedCollateral.symbol)}
                        </>,
                      ],
                    ]}
                  />
                </section>
                <TradeReviewSeparator />
                <section className="grid gap-3" aria-label="review position">
                  <AssetHeading symbol={selectedPosition.symbol} />
                  <TradeDetails
                    heading={[
                      "Opening position",
                      <>
                        {formatNumberAsDecimal(Number(inputPosition.value), 4)}{" "}
                        {removeFirstCharsUC(selectedPosition.symbol)}
                      </>,
                    ]}
                    details={[
                      [
                        "Current swap rate",
                        <>
                          1 {removeFirstCharsUC(selectedCollateral.symbol)} <HtmlUnicode name="AlmostEqualTo" />{" "}
                          {formatNumberAsDecimal(
                            (selectedPosition.symbol.toLowerCase() === "rowan"
                              ? Decimal.fromAtomics(poolActive?.swapPriceExternal ?? "0", selectedPosition.decimals)
                              : Decimal.fromAtomics(poolActive?.swapPriceNative ?? "0", selectedCollateral.decimals)
                            ).toFloatApproximation(),
                            4,
                          )}{" "}
                          {removeFirstCharsUC(selectedPosition.symbol)}
                        </>,
                      ],
                      [
                        "Swap result",
                        <>
                          {formatNumberAsDecimal(Number(inputPosition.value) + Number(openPositionFee), 4)}{" "}
                          {removeFirstCharsUC(selectedPosition.symbol)}
                        </>,
                      ],
                      [
                        "Fees",
                        <>
                          <HtmlUnicode name="MinusSign" />
                          {formatNumberAsDecimal(Number(openPositionFee), 4)}{" "}
                          {removeFirstCharsUC(selectedPosition.symbol)}
                        </>,
                      ],
                      ["Price impact", <>{formatNumberAsPercent(priceImpact)}</>],
                    ]}
                  />
                </section>
              </section>
              {confirmOpenPositionMutation.isError && (
                <FlashMessage className="relative mx-4 bg-red-200 text-red-800">
                  <b className="mr-1">Failed to open position:</b>
                  <span>{(confirmOpenPositionMutation.error as Error).message}</span>
                  <button
                    className="absolute right-0 top-0 ml-auto pt-3 pr-3 hover:text-red-400"
                    type="button"
                    onClick={confirmOpenPositionMutation.reset}
                  >
                    <PlusIcon style={{ transform: "rotate(45deg)" }} />
                  </button>
                </FlashMessage>
              )}
              <TradeActions
                govParams={props.govParams}
                onClickReset={onClickReset}
                isDisabledOpenPosition={isDisabledOpenPosition}
                isLoadingOpenPosition={confirmOpenPositionMutation.isLoading}
                onClickOpenPosition={onClickConfirmOpenPosition}
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
    </>
  );
};
