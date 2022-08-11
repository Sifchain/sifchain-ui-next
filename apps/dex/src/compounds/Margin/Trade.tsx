import type { ChangeEvent, SyntheticEvent } from "react";
import type { NextPage } from "next";
import type { IAsset } from "@sifchain/common";

import { pathOr } from "ramda";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import Head from "next/head";

import {
  Button,
  formatNumberAsCurrency,
  Modal,
  RacetrackSpinnerIcon,
  SwapIcon,
  toast,
  TokenEntry,
} from "@sifchain/ui";

import AssetIcon from "~/compounds/AssetIcon";
import { PortfolioTable } from "~/compounds/Margin/PortfolioTable";
import { useAllBalancesQuery } from "~/domains/bank/hooks/balances";
import {
  useEnhancedPoolsQuery,
  useEnhancedTokenQuery,
  useRowanPriceQuery,
} from "~/domains/clp";

/**
 * ********************************************************************************************
 *
 * `_trade`: Input validation for Trade page.
 * `_mockdata`: To mock React-Query and fake the Data Services reponses
 * `_intl`: Functions to format data used across Margin. They will be moved to a different place.
 *
 * ********************************************************************************************
 */
import {
  HtmlUnicode,
  COLLATERAL_MAX_VALUE,
  POSITION_MAX_VALUE,
  LEVERAGE_MAX_VALUE,
  COLLATERAL_MIN_VALUE,
  POSITION_MIN_VALUE,
  LEVERAGE_MIN_VALUE,
  inputValidatorLeverage,
  inputValidatorPosition,
  inputValidatorCollateral,
} from "./_trade";
import { formatNumberAsDecimal } from "./_intl";
import { PoolOverview } from "./_components";
import { useMutationConfirmOpenPosition } from "./_mockdata";

const FEE_USDC = 0.5;
const INTEREST_RATE = 0.25;
const HARD_CODED_ADDRES_DS = "sif19z5atv2m8rz970l09th0vhhxjmnq0zrrfe4650";

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

  if (
    enhancedPools.isSuccess &&
    enhancedRowan.isSuccess &&
    rowanPrice.isSuccess &&
    enhancedPools.data &&
    enhancedRowan.data &&
    rowanPrice.data
  ) {
    enhancedRowan.data.priceUsd = rowanPrice.data;
    return (
      <Trade
        enhancedPools={enhancedPools.data}
        enhancedRowan={enhancedRowan.data}
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
};

const ROWAN_DENOM = "rowan";
const mutateDisplaySymbol = (displaySymbol: string) =>
  `${displaySymbol.toUpperCase()} · ${ROWAN_DENOM.toUpperCase()}`;

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

  /**
   * ********************************************************************************************
   *
   * Input validation and "Open position" disabling derivate
   *
   * ********************************************************************************************
   */
  const [inputCollateral, setInputCollateral] = useState({
    value: `0`,
    error: "",
  });

  const [inputPosition, setInputPosition] = useState({
    value: `0`,
    error: "",
  });

  const [inputLeverage, setInputLeverage] = useState({
    value: `${LEVERAGE_MAX_VALUE}`,
    error: "",
  });

  const { findBySymbolOrDenom: findBalanceBySymbolOrDenom } =
    useAllBalancesQuery();

  const positionBalance = useMemo(
    () =>
      selectedPosition
        ? findBalanceBySymbolOrDenom(
            selectedPosition.denom ?? selectedPosition.symbol,
          )
        : undefined,
    [findBalanceBySymbolOrDenom, selectedPosition],
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
            selectedCollateral.denom ?? selectedCollateral.symbol,
          )
        : undefined,
    [findBalanceBySymbolOrDenom, selectedCollateral],
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
      Boolean(inputLeverage.error)
    );
  }, [inputCollateral.error, inputPosition.error, inputLeverage.error]);

  /**
   * ********************************************************************************************
   *
   * "Confirm open position" modal
   *
   * ********************************************************************************************
   */
  const [checkbox01, setCheckbox01] = useState(false);
  const [checkbox02, setCheckbox02] = useState(false);

  const confirmOpenPositionMutation = useMutationConfirmOpenPosition();
  const [modalConfirmOpenPosition, setModalConfirmOpenPosition] = useState({
    isOpen: false,
  });

  const isDisabledConfirmOpenPosition = useMemo(() => {
    return checkbox01 === false || checkbox02 === false;
  }, [checkbox01, checkbox02]);

  const onClickConfirmOpenPosition = async (
    event: SyntheticEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    try {
      const req = await confirmOpenPositionMutation.mutateAsync({
        id: "1234",
      });
      const json = req as { id: string };
      setModalConfirmOpenPosition({ isOpen: false });
      toast.success(`Position created successfully! Position ID: ${json.id}`);
    } catch (err) {
      console.log(err);
    }
  };

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

    const positionTokenPrice =
      selectedPosition.denom === ROWAN_DENOM
        ? enhancedRowan.priceUsd
        : poolActive?.stats.priceToken ?? 0;

    const collateralTokenPrice =
      selectedPosition.denom !== ROWAN_DENOM
        ? enhancedRowan.priceUsd
        : poolActive?.stats.priceToken ?? 0;

    const collateralDollarValue =
      (collateralTokenPrice ?? 0) * Number(payload.value);

    // colleteral dollar value * leverage / position token price
    const positionInputAmount =
      (collateralDollarValue * Number(inputLeverage.value)) /
      positionTokenPrice;

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

    const positionTokenPrice =
      selectedPosition.denom === ROWAN_DENOM
        ? enhancedRowan.priceUsd
        : poolActive?.stats.priceToken ?? 0;

    const collateralTokenPrice =
      selectedPosition.denom !== ROWAN_DENOM
        ? enhancedRowan.priceUsd
        : poolActive?.stats.priceToken ?? 0;

    const positionDollarValue =
      (positionTokenPrice ?? 0) * Number(payload.value);

    // position dollar value / leverage / collateral token price
    const collateralInputAmount =
      positionDollarValue / Number(inputLeverage.value) / collateralTokenPrice;

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
    const payload = inputValidatorLeverage($input, "change");

    if (!payload.error) {
      const positionTokenPrice =
        selectedPosition.denom === ROWAN_DENOM
          ? enhancedRowan.priceUsd
          : poolActive?.stats.priceToken ?? 0;

      const collateralTokenPrice =
        selectedPosition.denom !== ROWAN_DENOM
          ? enhancedRowan.priceUsd
          : poolActive?.stats.priceToken ?? 0;

      const collateralDollarValue =
        (collateralTokenPrice ?? 0) * Number(inputCollateral.value);

      // colleteral dollar value * leverage / position token price
      const positionInputAmount =
        (collateralDollarValue * Number(payload.value)) / positionTokenPrice;

      setInputPosition({
        value: String(positionInputAmount),
        error: "",
      });
    }

    setInputLeverage(payload);
  };

  const onBlurLeverage = (event: ChangeEvent<HTMLInputElement>) => {
    const $input = event.currentTarget;
    const payload = inputValidatorLeverage($input, "blur");
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
      value: String(LEVERAGE_MAX_VALUE),
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
      },
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
      <section className="bg-gray-800 border border-gold-800 rounded mt-4 text-xs">
        {poolActive ? (
          <PoolOverview
            pool={poolActive}
            assets={pools.map((pool) => pool.asset)}
            rowanPriceUsd={enhancedRowan.priceUsd}
            onChangePoolSelector={onChangePoolSelector}
          />
        ) : (
          <div className="text-4xl flex items-center justify-center p-4 rounded">
            <RacetrackSpinnerIcon />
          </div>
        )}
      </section>
      <section className="mt-4 text-xs grid grid-cols-7 gap-x-5">
        <aside className="bg-gray-800 border border-gold-800 rounded col-span-2 flex flex-col">
          <ul className="border-b border-gold-800 flex flex-col gap-0 p-4">
            <li className="flex flex-col">
              <div className="text-xs mb-1 flex flex-row">
                <span className="mr-auto">Collateral</span>
                <span className="text-gray-300">
                  Balance:
                  <span className="ml-1">
                    {formatNumberAsDecimal(
                      collateralBalance?.amount?.toFloatApproximation() ?? 0,
                    )}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-row gap-2.5 items-center text-sm font-semibold p-2 bg-gray-700 text-white rounded">
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
                    "text-right text-sm bg-gray-700 rounded border-0 font-semibold",
                    {
                      "ring ring-red-600 focus:ring focus:ring-red-600":
                        inputCollateral.error,
                    },
                  )}
                />
              </div>
              {inputCollateral.error ? (
                <span className="bg-red-200 radious border-red-700 border text-red-700 col-span-6 text-right p-2 rounded my-2">
                  {inputCollateral.error}
                </span>
              ) : (
                <span className="text-gray-300 text-right mt-1">
                  <HtmlUnicode name="EqualsSign" />
                  <span className="ml-1">
                    {formatNumberAsCurrency(collateralDollarValue, 4)}
                  </span>
                </span>
              )}
            </li>
            <li className="flex justify-center items-center py-5 relative">
              <div className="h-[2px] w-full bg-gray-900" />
              <button
                type="button"
                onClick={onClickSwitch}
                className={clsx(
                  "bg-gray-900 rounded-full p-3 border-2 border-gray-800 absolute text-lg transition-transform hover:scale-125",
                  switchCollateralAndPosition ? "rotate-180" : "rotate-0",
                )}
              >
                <SwapIcon />
              </button>
            </li>
            <li className="flex flex-col">
              <div className="text-xs mb-1 flex flex-row">
                <span className="mr-auto">Position</span>
                <span className="text-gray-300">
                  Balance:
                  <span className="ml-1">
                    {formatNumberAsDecimal(
                      positionBalance?.amount?.toFloatApproximation() ?? 0,
                    )}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-row gap-2.5 items-center text-sm font-semibold p-2 bg-gray-700 text-white rounded">
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
                    "text-right text-sm bg-gray-700 rounded border-0 font-semibold",
                    {
                      "ring ring-red-600 focus:ring focus:ring-red-600":
                        inputPosition.error,
                    },
                  )}
                />
              </div>
              {inputPosition.error ? (
                <span className="bg-red-200 radious border-red-700 border text-red-700 col-span-6 text-right p-2 rounded mt-2">
                  {inputPosition.error}
                </span>
              ) : (
                <span className="text-gray-300 text-right mt-1">
                  <HtmlUnicode name="EqualsSign" />
                  <span className="ml-1">
                    {formatNumberAsCurrency(positionDollarValue, 4)}
                  </span>
                </span>
              )}
            </li>
            <li className="mt-2 grid grid-cols-6 gap-2">
              <p className="col-span-3 self-end text-sm font-semibold p-2 text-center bg-gray-500 text-gray-200 rounded">
                Long
              </p>
              <div className="col-span-3 flex flex-col">
                <span className="text-xs text-gray-300 mb-1">
                  <span className="mr-1">Leverage</span>
                  <span className="text-gray-400">Up to 2x</span>
                </span>
                <input
                  type="number"
                  placeholder="Leverage amount"
                  step="0.01"
                  min={LEVERAGE_MIN_VALUE}
                  max={LEVERAGE_MAX_VALUE}
                  value={inputLeverage.value}
                  onChange={onChangeLeverage}
                  onBlur={onBlurLeverage}
                  className={clsx(
                    "text-right text-sm bg-gray-700 rounded border-0",
                    {
                      "ring ring-red-600 focus:ring focus:ring-red-600":
                        inputLeverage.error,
                    },
                  )}
                />
              </div>
              {Boolean(inputLeverage.error) && (
                <span className="bg-red-200 radious border-red-700 border text-red-700 col-span-6 text-right p-2 rounded">
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
                <ul className="flex flex-col gap-3 mt-4">
                  <li className="bg-gray-850 text-base font-semibold py-2 px-4 rounded-lg flex flex-row items-center">
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
                            4,
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
                          {formatNumberAsDecimal(
                            Number(inputCollateral.value) *
                              Number(inputLeverage.value) -
                              Number(inputCollateral.value),
                            4,
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
                </ul>
                <ul className="flex flex-col gap-3 mt-8">
                  <li className="bg-gray-850 text-base font-semibold py-2 px-4 rounded-lg flex flex-row items-center">
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
                            4,
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
                        <HtmlUnicode name="MinusSign" />
                        <span>{formatNumberAsCurrency(FEE_USDC)}</span>
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
                              ? Number(inputPosition.value) -
                                  FEE_USDC / Number(selectedPosition.priceUsd)
                              : 0,
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
                        Current interest rate
                      </span>
                      <span>{INTEREST_RATE * 100}%</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-4 gap-2 px-4 pb-4 mt-4">
                <Button
                  variant="tertiary"
                  as="button"
                  size="xs"
                  className="text-gray-300 font-normal self-center"
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
            <div className="text-4xl flex items-center justify-center p-2 m-4 rounded bg-gray-850">
              <RacetrackSpinnerIcon />
            </div>
          )}
        </aside>
        <section className="col-span-5 rounded border border-gold-800">
          <PortfolioTable
            queryId={HARD_CODED_ADDRES_DS}
            openPositions={{
              hideColumns: [
                "pool",
                "unsettledInterest",
                "nextPayment",
                "paidInterest",
              ],
            }}
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
          }
        }}
      >
        <>
          <h1 className="text-lg font-bold text-center">
            Review opening trade
          </h1>
          {selectedPosition ? (
            <ul className="flex flex-col gap-3 mt-6">
              <li>
                <div className="flex flex-row items-center">
                  <span className="mr-auto min-w-fit text-gray-300">
                    Opening position
                  </span>
                  <div className="flex flex-row items-center">
                    <span className="mr-1">
                      {formatNumberAsDecimal(
                        Number(inputPosition.value) > 0
                          ? Number(inputPosition.value) -
                              FEE_USDC / Number(selectedPosition.priceUsd)
                          : 0,
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
                  <span>{INTEREST_RATE * 100}%</span>
                </div>
              </li>
            </ul>
          ) : (
            <div className="text-4xl flex items-center justify-center p-2 mt-6 rounded bg-gray-850">
              <RacetrackSpinnerIcon />
            </div>
          )}
          <ul className="mt-6">
            <li>
              <label
                htmlFor="checkbox01"
                className="bg-gray-700 p-4 flex flex-row items-start gap-2 rounded"
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
                className="bg-gray-700 p-4 flex flex-row items-start gap-2 rounded mt-4"
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
            <p className="text-center rounded py-3 px-4 mt-6 bg-indigo-200 text-indigo-800">
              Opening trade...
            </p>
          ) : (
            <Button
              variant="primary"
              as="button"
              size="md"
              className="w-full mt-6"
              disabled={isDisabledConfirmOpenPosition}
              onClick={onClickConfirmOpenPosition}
            >
              Confirm open position
            </Button>
          )}
          {confirmOpenPositionMutation.isError ? (
            <p className="text-center p-4 mt-6 rounded bg-red-200 text-red-800">
              <span className="mr-1">An error occurred:</span>
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
