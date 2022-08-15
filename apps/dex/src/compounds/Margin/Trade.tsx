import type { ChangeEvent, SyntheticEvent } from "react";
import type { IAsset } from "@sifchain/common";
import type { NextPage } from "next";

import { Decimal } from "@cosmjs/math";
import { pathOr } from "ramda";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import Head from "next/head";

import {
  Button,
  formatNumberAsCurrency,
  Maybe,
  Modal,
  RacetrackSpinnerIcon,
  SwapIcon,
  TokenEntry,
} from "@sifchain/ui";
import BigNumber from "bignumber.js";

import AssetIcon from "~/compounds/AssetIcon";
import OpenPositionsTable from "~/compounds/Margin/OpenPositionsTable";
import { useAllBalancesQuery } from "~/domains/bank/hooks/balances";
import {
  useEnhancedPoolsQuery,
  useEnhancedTokenQuery,
  useRowanPriceQuery,
  useSwapSimulation,
} from "~/domains/clp";
import {
  useMarginParamsQuery,
  useOpenMTPMutation,
} from "~/domains/margin/hooks";
import { useSifSignerAddress } from "~/hooks/useSifSigner";

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
} from "./_trade";

const calculateOpenPosition = (
  positionTokenAmount: number,
  positionPriceUsd: number
) => {
  return positionTokenAmount / positionPriceUsd;
};
const calculateBorrowAmount = (
  collateralTokenAmount: number,
  leverage: number
) => {
  return collateralTokenAmount * leverage - collateralTokenAmount;
};
const withLeverage = (
  rawReceiving: string,
  decimals: number,
  leverage: string
) =>
  BigNumber(
    Decimal.fromAtomics(rawReceiving, decimals).toString()
  ).multipliedBy(leverage);

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
  const enhancedPools = useEnhancedPoolsQuery();
  const enhancedRowan = useEnhancedTokenQuery(ROWAN_DENOM);
  const rowanPrice = useRowanPriceQuery();
  const govParams = useMarginParamsQuery();
  // const addressList = useMarginAllowedAddressList();

  if (
    [
      enhancedPools,
      enhancedRowan,
      rowanPrice,
      govParams,
      // addressList
    ].some((query) => query.isError)
  ) {
    return (
      <div className="bg-gray-850 p-10 text-center text-gray-100">
        Try again later.
      </div>
    );
  }

  if (
    enhancedPools.isSuccess &&
    enhancedRowan.isSuccess &&
    rowanPrice.isSuccess &&
    govParams.isSuccess &&
    // addressList.isSuccess &&
    enhancedPools.data &&
    enhancedRowan.data &&
    rowanPrice.data &&
    govParams.data &&
    // addressList.data &&
    govParams.data.params
  ) {
    const { params } = govParams.data;
    const allowedPools = params.pools;
    const filteredEnhancedPools = enhancedPools.data.filter((pool) =>
      allowedPools.includes(pool.asset.symbol.toLowerCase())
    );
    enhancedRowan.data.priceUsd = rowanPrice.data;
    // console.log(addressList);
    return (
      <Trade
        enhancedPools={filteredEnhancedPools}
        enhancedRowan={enhancedRowan.data}
        govParams={{
          leverageMax: params.leverageMax,
        }}
      />
    );
  }

  return (
    <div className="bg-gray-850 p-10 text-center text-gray-100">Loading...</div>
  );
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
  enhancedPools: Exclude<
    ReturnType<typeof useEnhancedPoolsQuery>["data"],
    undefined
  >;
  enhancedRowan: Exclude<
    ReturnType<typeof useEnhancedTokenQuery>["data"],
    undefined
  >;
  govParams: {
    leverageMax: string;
  };
};

const ROWAN_DENOM = "rowan";
const mutateDisplaySymbol = (displaySymbol: string) =>
  `${displaySymbol.toUpperCase()} · ${ROWAN_DENOM.toUpperCase()}`;

const Trade = (props: TradeProps) => {
  const router = useRouter();
  const walletAddress = useSifSignerAddress({ enabled: true });
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
          displaySymbol: mutateDisplaySymbol(pool.asset.displaySymbol),
          priceUsd: pool.stats.priceToken,
        } as IAsset & { priceUsd: number };
        return modifiedPool;
      });
    }
    return [];
  }, [enhancedPools]);

  const poolActive = useMemo(() => {
    if (qsPool) {
      const pool = pools.find((pool) => pool.asset.denom === qsPool);
      if (pool) {
        return pool;
      }
    }
    return pools[0];
  }, [pools, qsPool]);

  /**
   * ********************************************************************************************
   *
   * Collateral default is to set the "non-rowan"/"external" asset
   *   - If doesn't exist, return ROWAN
   *
   * ********************************************************************************************
   */
  const [switchCollateralAndPosition, setSwitchCollateralAndPosition] =
    useState(false);

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
    if (
      !poolActive ||
      (poolActive && poolActive.asset.denom === selectedCollateral.denom)
    ) {
      return enhancedRowan;
    }

    return poolActive.asset;
  }, [selectedCollateral.denom, poolActive, enhancedRowan]) as IAsset & {
    priceUsd: number;
  };

  const maxLeverageDecimal = Decimal.fromAtomics(
    props.govParams.leverageMax,
    ROWAN.decimals
  );

  /**
   * ********************************************************************************************
   *
   * Input validation and "Open position" disabling derivate
   *
   * ********************************************************************************************
   */
  const [inputCollateral, setInputCollateral] = useState({
    value: String(COLLATERAL_MIN_VALUE),
    error: "",
  });

  const [inputPosition, setInputPosition] = useState({
    value: String(POSITION_MIN_VALUE),
    error: "",
  });

  const [inputLeverage, setInputLeverage] = useState({
    value: maxLeverageDecimal.toString(),
    error: "",
  });

  const { findBySymbolOrDenom: findBalanceBySymbolOrDenom } =
    useAllBalancesQuery();

  const positionBalance = useMemo(
    () =>
      selectedPosition
        ? findBalanceBySymbolOrDenom(
            selectedPosition.denom ?? selectedPosition.symbol
          )
        : undefined,
    [findBalanceBySymbolOrDenom, selectedPosition]
  );

  const positionDollarValue = useMemo(() => {
    if (!selectedPosition || !inputPosition.value || !poolActive) {
      return 0;
    }

    const tokenPrice =
      selectedPosition.denom === ROWAN_DENOM
        ? enhancedRowan.priceUsd
        : poolActive.stats.priceToken;

    return (tokenPrice ?? 0) * Number(inputPosition.value);
  }, [
    selectedPosition,
    inputPosition.value,
    poolActive,
    enhancedRowan.priceUsd,
  ]);

  const collateralBalance = useMemo(
    () =>
      selectedCollateral
        ? findBalanceBySymbolOrDenom(
            selectedCollateral.denom ?? selectedCollateral.symbol
          )
        : undefined,
    [findBalanceBySymbolOrDenom, selectedCollateral]
  );

  const collateralDollarValue = useMemo(() => {
    if (!selectedCollateral || !inputCollateral.value || !poolActive) {
      return 0;
    }

    const tokenPrice =
      selectedCollateral.denom === ROWAN_DENOM
        ? enhancedRowan.priceUsd
        : poolActive.stats.priceToken;

    if (typeof tokenPrice === "undefined") {
      return 0;
    }

    return tokenPrice * Number(inputCollateral.value);
  }, [
    selectedCollateral,
    inputCollateral.value,
    poolActive,
    enhancedRowan.priceUsd,
  ]);

  const isDisabledOpenPosition = useMemo(() => {
    return (
      Boolean(inputCollateral.error) ||
      Boolean(inputPosition.error) ||
      Boolean(inputLeverage.error) ||
      inputCollateral.value === "0" ||
      inputPosition.value === "0"
    );
  }, [
    inputCollateral.error,
    inputPosition.error,
    inputLeverage.error,
    inputCollateral.value,
    inputPosition.value,
  ]);

  /**
   * ********************************************************************************************
   *
   * "Confirm open position" modal
   *
   * ********************************************************************************************
   */
  const [checkbox01, setCheckbox01] = useState(false);
  const [checkbox02, setCheckbox02] = useState(false);
  const computedBorrowAmount = useMemo(() => {
    return calculateBorrowAmount(
      Number(inputCollateral.value),
      Number(inputLeverage.value)
    );
  }, [inputCollateral.value, inputLeverage.value]);

  const confirmOpenPositionMutation = useOpenMTPMutation();
  const [modalConfirmOpenPosition, setModalConfirmOpenPosition] = useState({
    isOpen: false,
  });

  const isDisabledConfirmOpenPosition = useMemo(() => {
    return checkbox01 === false || checkbox02 === false;
  }, [checkbox01, checkbox02]);

  const onClickConfirmOpenPosition = async (
    event: SyntheticEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    try {
      const { atomics: collateralAmount } = Decimal.fromUserInput(
        inputCollateral.value,
        selectedCollateral.decimals
      );
      const { atomics: leverage } = Decimal.fromUserInput(
        inputLeverage.value,
        ROWAN.decimals
      );

      await confirmOpenPositionMutation.mutateAsync({
        collateralAsset: selectedCollateral.symbol.toLowerCase(),
        borrowAsset: selectedPosition.symbol.toLowerCase(),
        position: 1, // LONG
        collateralAmount,
        leverage: leverage,
      });
      if (modalConfirmOpenPosition.isOpen) {
        setModalConfirmOpenPosition({ isOpen: false });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const { recompute: calculateSwap, data: swapSimulation } = useSwapSimulation(
    selectedCollateral.denom ?? selectedCollateral.symbol,
    selectedPosition.denom ?? selectedPosition.symbol,
    inputCollateral.value
  );

  const openPositionFee = useMemo(
    () =>
      Maybe.of(swapSimulation?.liquidityProviderFee).mapOr(0, (x) =>
        Decimal.fromAtomics(x, ROWAN.decimals).toFloatApproximation()
      ),
    [swapSimulation]
  );

  const { recompute: calculateReverseSwap } = useSwapSimulation(
    selectedPosition.denom ?? selectedPosition.symbol,
    selectedCollateral.denom ?? selectedCollateral.symbol,
    inputPosition.value
  );

  const calculatePosition = (
    inputAmount: string,
    leverage = inputLeverage.value
  ) =>
    withLeverage(
      calculateSwap(inputAmount)?.rawReceiving || "0",
      selectedPosition.decimals,
      leverage
    );

  const calculateCollateral = (
    inputAmount: string,
    leverage = inputLeverage.value
  ) =>
    withLeverage(
      calculateReverseSwap(inputAmount)?.rawReceiving || "0",
      selectedCollateral.decimals,
      leverage
    );

  /**
   * ********************************************************************************************
   *
   * "Collateral" input form handlers
   *
   * ********************************************************************************************
   */
  const onChangeCollateral = (event: ChangeEvent<HTMLInputElement>) => {
    const $input = event.currentTarget;
    const payload = inputValidatorCollateral($input, "change");

    const positionInputAmount = calculatePosition(payload.value);

    setInputCollateral(payload);
    setInputPosition({
      value: String(positionInputAmount),
      error: "",
    });
  };

  const onBlurCollateral = (event: ChangeEvent<HTMLInputElement>) => {
    const $input = event.currentTarget;
    const payload = inputValidatorCollateral($input, "blur");
    setInputCollateral(payload);
  };

  /**
   * ********************************************************************************************
   *
   * "Position" input form handlers
   *
   * ********************************************************************************************
   */
  const onChangePosition = (event: ChangeEvent<HTMLInputElement>) => {
    const $input = event.currentTarget;
    const payload = inputValidatorPosition($input, "change");

    const collateralInputAmount = calculateCollateral(payload.value);

    setInputPosition(payload);
    setInputCollateral({
      value: String(collateralInputAmount),
      error: "",
    });
  };

  const onBlurPosition = (event: ChangeEvent<HTMLInputElement>) => {
    const $input = event.currentTarget;
    const payload = inputValidatorPosition($input, "blur");
    setInputPosition(payload);
  };

  /**
   * ********************************************************************************************
   *
   * "Leverage" input form handlers
   *
   * ********************************************************************************************
   */
  const onChangeLeverage = (event: ChangeEvent<HTMLInputElement>) => {
    const $input = event.currentTarget;
    const payload = inputValidatorLeverage(
      $input,
      "change",
      maxLeverageDecimal.toString()
    );

    if (!payload.error) {
      const positionInputAmount = calculatePosition(
        inputCollateral.value,
        payload.value
      );

      setInputPosition({
        value: positionInputAmount.toString(),
        error: "",
      });
    }

    setInputLeverage(payload);
  };

  const onBlurLeverage = (event: ChangeEvent<HTMLInputElement>) => {
    const $input = event.currentTarget;
    const payload = inputValidatorLeverage(
      $input,
      "blur",
      maxLeverageDecimal.toString()
    );
    setInputLeverage(payload);
  };

  /**
   * ********************************************************************************************
   *
   * "Review trade" form handlers
   *
   * ********************************************************************************************
   */
  const onClickReset = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setInputCollateral({
      value: String(COLLATERAL_MIN_VALUE),
      error: "",
    });
    setInputPosition({
      value: String(POSITION_MIN_VALUE),
      error: "",
    });
    setInputLeverage({
      value: maxLeverageDecimal.toString(),
      error: "",
    });
  };

  const onClickOpenPosition = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setModalConfirmOpenPosition({ isOpen: true });
  };

  /**
   * ********************************************************************************************
   *
   * "Pool Selector" values and handlers
   *
   * ********************************************************************************************
   */
  const onChangePoolSelector = (token: TokenEntry) => {
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
      }
    );
  };

  const onClickSwitch = (event: SyntheticEvent<HTMLButtonElement>) => {
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
  };

  return (
    <>
      <Head>
        <title>Sichain Dex - Margin - Trade</title>
      </Head>
      <section className="mt-4 rounded border border-gold-800 bg-gray-800 text-xs">
        {poolActive ? (
          <PoolOverview
            pool={poolActive}
            assets={pools.map((pool) => pool.asset)}
            rowanPriceUsd={enhancedRowan.priceUsd}
            onChangePoolSelector={onChangePoolSelector}
          />
        ) : (
          <div className="flex items-center justify-center rounded p-4 text-4xl">
            <RacetrackSpinnerIcon />
          </div>
        )}
      </section>
      <section className="mt-4 grid grid-cols-7 gap-x-5 text-xs">
        <aside className="col-span-2 flex flex-col rounded border border-gold-800 bg-gray-800">
          <ul className="flex flex-col gap-0 border-b border-gold-800 p-4">
            <li className="flex flex-col">
              <div className="mb-1 flex flex-row text-xs">
                <span className="mr-auto">Collateral</span>
                <span className="text-gray-300">
                  Balance:
                  <span className="ml-1">
                    {formatNumberAsDecimal(
                      collateralBalance?.amount?.toFloatApproximation() ?? 0
                    )}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-row items-center gap-2.5 rounded bg-gray-700 p-2 text-sm font-semibold text-white">
                  {selectedCollateral && selectedCollateral.denom ? (
                    <>
                      <AssetIcon
                        symbol={selectedCollateral.denom}
                        network="sifchain"
                        size="sm"
                      />
                      <span>{selectedCollateral.name}</span>
                    </>
                  ) : (
                    <RacetrackSpinnerIcon />
                  )}
                </div>
                <input
                  type="number"
                  placeholder="Collateral amount"
                  step="0.01"
                  min={COLLATERAL_MIN_VALUE}
                  max={COLLATERAL_MAX_VALUE}
                  value={inputCollateral.value}
                  onBlur={onBlurCollateral}
                  onChange={onChangeCollateral}
                  className={clsx(
                    "rounded border-0 bg-gray-700 text-right text-sm font-semibold",
                    {
                      "ring ring-red-600 focus:ring focus:ring-red-600":
                        inputCollateral.error,
                    }
                  )}
                />
              </div>
              {inputCollateral.error ? (
                <span className="radious col-span-6 my-2 rounded border border-red-700 bg-red-200 p-2 text-right text-red-700">
                  {inputCollateral.error}
                </span>
              ) : (
                <span className="mt-1 text-right text-gray-300">
                  <HtmlUnicode name="EqualsSign" />
                  <span className="ml-1">
                    {formatNumberAsCurrency(collateralDollarValue, 4)}
                  </span>
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
                  switchCollateralAndPosition ? "rotate-180" : "rotate-0"
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
                    {formatNumberAsDecimal(
                      positionBalance?.amount?.toFloatApproximation() ?? 0
                    )}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-row items-center gap-2.5 rounded bg-gray-700 p-2 text-sm font-semibold text-white">
                  {selectedPosition && selectedPosition.denom ? (
                    <>
                      <AssetIcon
                        symbol={selectedPosition.denom}
                        network="sifchain"
                        size="sm"
                      />
                      <span>{selectedPosition.name}</span>
                    </>
                  ) : null}
                </div>
                <input
                  type="number"
                  placeholder="Position amount"
                  step="0.01"
                  min={POSITION_MIN_VALUE}
                  max={POSITION_MAX_VALUE}
                  value={inputPosition.value}
                  onBlur={onBlurPosition}
                  onChange={onChangePosition}
                  className={clsx(
                    "rounded border-0 bg-gray-700 text-right text-sm font-semibold",
                    {
                      "ring ring-red-600 focus:ring focus:ring-red-600":
                        inputPosition.error,
                    }
                  )}
                />
              </div>
              {inputPosition.error ? (
                <span className="radious col-span-6 mt-2 rounded border border-red-700 bg-red-200 p-2 text-right text-red-700">
                  {inputPosition.error}
                </span>
              ) : (
                <span className="mt-1 text-right text-gray-300">
                  <HtmlUnicode name="EqualsSign" />
                  <span className="ml-1">
                    {formatNumberAsCurrency(positionDollarValue, 4)}
                  </span>
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
                    {formatNumberAsDecimal(
                      maxLeverageDecimal.toFloatApproximation(),
                      2
                    )}
                    x
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
                  onBlur={onBlurLeverage}
                  className={clsx(
                    "rounded border-0 bg-gray-700 text-right text-sm",
                    {
                      "ring ring-red-600 focus:ring focus:ring-red-600":
                        inputLeverage.error,
                    }
                  )}
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
          selectedCollateral.denom &&
          selectedPosition &&
          selectedPosition.denom &&
          selectedPosition.priceUsd ? (
            <>
              <div className="p-4">
                <p className="text-center text-base">Review trade</p>
                <ul className="mt-4 flex flex-col gap-3">
                  <li className="flex flex-row items-center rounded-lg bg-gray-850 py-2 px-4 text-base font-semibold">
                    <AssetIcon
                      symbol={selectedCollateral.denom}
                      network="sifchain"
                      size="sm"
                    />
                    <span className="ml-1">
                      {selectedCollateral.name.toUpperCase()}
                    </span>
                  </li>
                  <li className="px-4">
                    <div className="flex flex-row items-center">
                      <span className="mr-auto min-w-fit text-gray-300">
                        Collateral
                      </span>
                      <div className="flex flex-row items-center">
                        <span className="mr-1">
                          {formatNumberAsDecimal(
                            Number(inputCollateral.value),
                            4
                          )}
                        </span>
                        <AssetIcon
                          symbol={selectedCollateral.denom}
                          network="sifchain"
                          size="sm"
                        />
                      </div>
                    </div>
                  </li>
                  <li className="px-4">
                    <div className="flex flex-row items-center">
                      <span className="mr-auto min-w-fit text-gray-300">
                        Borrow amount
                      </span>
                      <div className="flex flex-row items-center">
                        <span className="mr-1">
                          {formatNumberAsDecimal(computedBorrowAmount, 4)}
                        </span>
                        <AssetIcon
                          symbol={selectedCollateral.denom}
                          network="sifchain"
                          size="sm"
                        />
                      </div>
                    </div>
                  </li>
                </ul>
                <ul className="mt-8 flex flex-col gap-3">
                  <li className="flex flex-row items-center rounded-lg bg-gray-850 py-2 px-4 text-base font-semibold">
                    <AssetIcon
                      symbol={selectedPosition.denom}
                      network="sifchain"
                      size="sm"
                    />
                    <span className="ml-1">
                      {selectedPosition.name.toUpperCase()}
                    </span>
                  </li>
                  <li className="px-4">
                    <div className="flex flex-row items-center">
                      <span className="mr-auto min-w-fit text-gray-300">
                        Entry price
                      </span>
                      <span>
                        {formatNumberAsCurrency(selectedPosition.priceUsd, 4)}
                      </span>
                    </div>
                  </li>
                  <li className="px-4">
                    <div className="flex flex-row items-center">
                      <span className="mr-auto min-w-fit text-gray-300">
                        Position size
                      </span>
                      <div className="flex flex-row items-center">
                        <span className="mr-1">
                          {formatNumberAsDecimal(
                            Number(inputPosition.value),
                            4
                          )}
                        </span>
                        <AssetIcon
                          symbol={selectedPosition.denom}
                          network="sifchain"
                          size="sm"
                        />
                      </div>
                    </div>
                  </li>
                  <li className="px-4">
                    <div className="flex flex-row items-center">
                      <span className="mr-auto min-w-fit text-gray-300">
                        Fees
                      </span>
                      <div className="flex flex-row items-center gap-1">
                        <span>
                          {formatNumberAsCurrency(
                            openPositionFee * selectedPosition.priceUsd
                          )}
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="px-4">
                    <div className="flex flex-row items-center">
                      <span className="mr-auto min-w-fit text-gray-300">
                        Opening position
                      </span>
                      <div className="flex flex-row items-center">
                        <span className="mr-1">
                          {formatNumberAsDecimal(
                            Number(inputPosition.value) > 0
                              ? calculateOpenPosition(
                                  Number(inputPosition.value),
                                  Number(selectedPosition.priceUsd)
                                ) -
                                  openPositionFee * selectedPosition.priceUsd
                              : 0
                          )}
                        </span>
                        <AssetIcon
                          symbol={selectedPosition.denom}
                          network="sifchain"
                          size="sm"
                        />
                      </div>
                    </div>
                  </li>
                  {poolActive ? (
                    <li className="px-4">
                      <div className="flex flex-row items-center">
                        <span className="mr-auto min-w-fit text-gray-300">
                          Current interest rate
                        </span>
                        <span>
                          {formatNumberAsPercent(
                            Decimal.fromAtomics(
                              poolActive.interestRate,
                              ROWAN.decimals
                            ).toFloatApproximation() * 100,
                            8
                          )}
                        </span>
                      </div>
                    </li>
                  ) : null}
                </ul>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 px-4 pb-4">
                <Button
                  variant="tertiary"
                  as="button"
                  size="xs"
                  className="self-center font-normal text-gray-300"
                  onClick={onClickReset}
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  as="button"
                  size="md"
                  className="col-span-3"
                  disabled={isDisabledOpenPosition}
                  onClick={onClickOpenPosition}
                >
                  Open position
                </Button>
              </div>
            </>
          ) : (
            <div className="m-4 flex items-center justify-center rounded bg-gray-850 p-2 text-4xl">
              <RacetrackSpinnerIcon />
            </div>
          )}
        </aside>
        <section className="col-span-5 rounded border border-gold-800">
          <OpenPositionsTable
            walletAddress={walletAddress.data ?? ""}
            hideColumns={["Pool", "Paid Interest"]}
          />
        </section>
      </section>
      <Modal
        className="text-sm"
        isOpen={modalConfirmOpenPosition.isOpen}
        onTransitionEnd={() => {
          setCheckbox01(false);
          setCheckbox02(false);
        }}
        onClose={() => {
          if (modalConfirmOpenPosition.isOpen) {
            setModalConfirmOpenPosition({ isOpen: false });
            confirmOpenPositionMutation.reset();
          }
        }}
      >
        <>
          <h1 className="text-center text-lg font-bold">
            Review opening trade
          </h1>
          {selectedPosition ? (
            <ul className="mt-6 flex flex-col gap-3">
              <li>
                <div className="flex flex-row items-center">
                  <span className="mr-auto min-w-fit text-gray-300">
                    Opening position
                  </span>
                  <div className="flex flex-row items-center">
                    <span className="mr-1">
                      {formatNumberAsDecimal(
                        Number(inputPosition.value) > 0
                          ? calculateOpenPosition(
                              Number(inputPosition.value),
                              Number(selectedPosition.priceUsd)
                            )
                          : 0
                      )}
                    </span>
                    {selectedPosition.denom ? (
                      <AssetIcon
                        symbol={selectedPosition.denom}
                        network="sifchain"
                        size="sm"
                      />
                    ) : null}
                  </div>
                </div>
              </li>
              <li>
                <div className="flex flex-row">
                  <span className="mr-auto min-w-fit text-gray-300">
                    Entry price
                  </span>
                  <span>
                    {formatNumberAsCurrency(selectedPosition.priceUsd, 4)}
                  </span>
                </div>
              </li>
              <li>
                <div className="flex flex-row">
                  <span className="mr-auto min-w-fit text-gray-300">
                    Current interest rate
                  </span>
                  {poolActive ? (
                    <span>
                      {formatNumberAsPercent(
                        Number(poolActive.stats.interestRate)
                      )}
                    </span>
                  ) : null}
                </div>
              </li>
            </ul>
          ) : (
            <div className="mt-6 flex items-center justify-center rounded bg-gray-850 p-2 text-4xl">
              <RacetrackSpinnerIcon />
            </div>
          )}
          <ul className="mt-6">
            <li>
              <label
                htmlFor="checkbox01"
                className="flex flex-row items-start gap-2 rounded bg-gray-700 p-4"
              >
                <input
                  id="checkbox01"
                  name="checkbox01"
                  type="checkbox"
                  checked={checkbox01}
                  onChange={() => {
                    setCheckbox01(!checkbox01);
                  }}
                />
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
                  iusto fugiat iste asperiores, non amet eligendi vitae culpa,
                  aperiam voluptates accusamus voluptatem quibusdam modi maxime
                  facere aliquam quae saepe quaerat.
                </p>
              </label>
            </li>
            <li>
              <label
                htmlFor="checkbox02"
                className="mt-4 flex flex-row items-start gap-2 rounded bg-gray-700 p-4"
              >
                <input
                  id="checkbox02"
                  name="checkbox02"
                  type="checkbox"
                  checked={checkbox02}
                  onChange={() => {
                    setCheckbox02(!checkbox02);
                  }}
                />
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
                  iusto fugiat iste asperiores, non amet eligendi vitae culpa,
                  aperiam voluptates accusamus voluptatem quibusdam modi maxime
                  facere aliquam quae saepe quaerat.
                </p>
              </label>
            </li>
          </ul>
          {confirmOpenPositionMutation.isLoading ? (
            <p className="mt-6 rounded bg-indigo-200 py-3 px-4 text-center text-indigo-800">
              Opening trade...
            </p>
          ) : (
            <Button
              variant="primary"
              as="button"
              size="md"
              className="mt-6 w-full"
              disabled={isDisabledConfirmOpenPosition}
              onClick={onClickConfirmOpenPosition}
            >
              Confirm open position
            </Button>
          )}
          {confirmOpenPositionMutation.isError ? (
            <p className="text-center p-4 mt-6 rounded bg-red-200 text-red-800">
              <b className="mr-1">Failed to open margin position:</b>
              <span>
                {(confirmOpenPositionMutation.error as Error).message}
              </span>
            </p>
          ) : null}
        </>
      </Modal>
    </>
  );
};
