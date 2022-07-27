import type { NextPage } from "next";

import { useQuery } from "react-query";

import {
  Button,
  TwinRadioGroup,
  formatNumberAsCurrency,
  TokenEntry,
} from "@sifchain/ui";
import Head from "next/head";
import { ChangeEvent, SyntheticEvent, useMemo, useState } from "react";
import { TokenSelector as BaseTokenSelector } from "@sifchain/ui";
import immer from "immer";
import clsx from "clsx";

import { PortfolioTable } from "~/compounds/Margin/PortfolioTable";
import { useEnhancedPoolsQuery, useRowanPriceQuery } from "~/domains/clp";
import type { EnhancedRegistryAsset } from "~/domains/tokenRegistry/hooks/useTokenRegistry";
import useTokenRegistryQuery from "~/domains/tokenRegistry/hooks/useTokenRegistry";

import { createOpenPositionsRow, createHistoryRow } from "./mockdata";
import type { OpenPositionsTableProps } from "./OpenPositionsTable";
import type { HistoryTableProps } from "./HistoryTable";

/**
 * ********************************************************************************************
 *
 * Utilities for Trade Entry sidebar design
 *
 * ********************************************************************************************
 */
function HtmlUnicode({ name }: { name: string }) {
  const unicodes: Record<string, string | string> = {
    AlmostEqualTo: "&#x2248;", // https://www.compart.com/en/unicode/U+2248
    RightwardsArrow: "&rightarrow;", // https://www.compart.com/en/unicode/U+2192
    EqualsSign: "&equals;", // https://www.compart.com/en/unicode/U+003D
  };
  const entity = unicodes[name] || `MISSING_UNICODE: ${name}`;
  return <span dangerouslySetInnerHTML={{ __html: entity }} />;
}

function ValueFromTo({
  from,
  to,
  almostEqual,
  className,
}: {
  from: string;
  to: string;
  almostEqual?: boolean;
  className?: string;
}) {
  return (
    <span className={className}>
      {almostEqual ? <HtmlUnicode name="AlmostEqualTo" /> : null}
      <span className="ml-1 mr-1">{from}</span>
      <HtmlUnicode name="RightwardsArrow" />
      <span className="ml-1">{to}</span>
    </span>
  );
}

/**
 * ********************************************************************************************
 *
 * Trade Entry Sidebar: Collateral Input Constants and Form Errors
 *
 * ********************************************************************************************
 */
const COLLATERAL_MIN_VALUE = 0;
const COLLATERAL_MAX_VALUE = 1000000;
const COLLATERAL_ERRORS = {
  INVALID_NUMBER: `Collateral amount must be between ${formatNumberAsCurrency(
    0,
  )} and ${formatNumberAsCurrency(COLLATERAL_MAX_VALUE)}`,
  INVALID_RANGE: `Collateral amount must be between ${formatNumberAsCurrency(
    0,
  )} and ${formatNumberAsCurrency(COLLATERAL_MAX_VALUE)}`,
};
function inputValidatorCollateral(
  $input: HTMLInputElement,
  event: "blur" | "change",
) {
  const value = Number($input.value);
  const payload = {
    value: $input.value,
    error: "",
  };
  if ($input.value !== "" && Number.isNaN(value)) {
    payload.error = COLLATERAL_ERRORS.INVALID_NUMBER;
  }

  if (
    $input.value !== "" &&
    (value > COLLATERAL_MAX_VALUE || value < COLLATERAL_MIN_VALUE)
  ) {
    payload.error = COLLATERAL_ERRORS.INVALID_RANGE;
  }

  if (event === "blur" && $input.value === "") {
    payload.error = COLLATERAL_ERRORS.INVALID_NUMBER;
  }

  return payload;
}

/**
 * ********************************************************************************************
 *
 * Trade Entry Sidebar: Position Input Constants and Form Errors
 *
 * ********************************************************************************************
 */
const POSITION_MIN_VALUE = 0;
const POSITION_MAX_VALUE = 1000000;
const POSITION_ERRORS = {
  INVALID_NUMBER: `Position amount must be between ${formatNumberAsCurrency(
    0,
  )} and ${formatNumberAsCurrency(POSITION_MAX_VALUE)}`,
  INVALID_RANGE: `Position amount must be between ${formatNumberAsCurrency(
    0,
  )} and ${formatNumberAsCurrency(POSITION_MAX_VALUE)}`,
};
function inputValidatorPosition(
  $input: HTMLInputElement,
  event: "blur" | "change",
) {
  const value = Number($input.value);
  const payload = {
    value: $input.value,
    error: "",
  };
  if ($input.value !== "" && Number.isNaN(value)) {
    payload.error = POSITION_ERRORS.INVALID_NUMBER;
  }

  if (
    $input.value !== "" &&
    (value > POSITION_MAX_VALUE || value < POSITION_MIN_VALUE)
  ) {
    payload.error = POSITION_ERRORS.INVALID_RANGE;
  }

  if (event === "blur" && $input.value === "") {
    payload.error = POSITION_ERRORS.INVALID_NUMBER;
  }

  return payload;
}

/**
 * ********************************************************************************************
 *
 * Trade Entry Sidebar: Leverage Input Constants and Form Errors
 *
 * ********************************************************************************************
 */
const LEVERAGE_MIN_VALUE = 0;
const LEVERAGE_MAX_VALUE = 2;
const LEVERAGE_ERRORS = {
  INVALID_NUMBER: "Leverage amount must be between 0 and 2",
  INVALID_RANGE: "Leverage amount must be between 0 and 2",
};
function inputValidatorLeverage(
  $input: HTMLInputElement,
  event: "blur" | "change",
) {
  const value = Number($input.value);
  const payload = {
    value: $input.value,
    error: "",
  };
  if ($input.value !== "" && Number.isNaN(value)) {
    payload.error = LEVERAGE_ERRORS.INVALID_NUMBER;
  }

  if (
    $input.value !== "" &&
    (value > LEVERAGE_MAX_VALUE || value < LEVERAGE_MIN_VALUE)
  ) {
    payload.error = LEVERAGE_ERRORS.INVALID_RANGE;
  }

  if (event === "blur" && $input.value === "") {
    payload.error = LEVERAGE_ERRORS.INVALID_NUMBER;
  }

  return payload;
}

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
  const tokenRegistry = useTokenRegistryQuery();
  const enhancedPools = useEnhancedPoolsQuery();
  const rowanPrice = useRowanPriceQuery();

  if (
    tokenRegistry.isSuccess &&
    enhancedPools.isSuccess &&
    rowanPrice.isSuccess
  ) {
    return (
      <Trade
        tokenRegistry={tokenRegistry}
        enhancedPools={enhancedPools}
        rowanPrice={rowanPrice}
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
 *   - Query list of Open Positions based on selected Pool
 *   - Query list of History based on selected Pool
 *   - Perform trade entry calculations and trade summary
 *   - Mutate/Submit a place buy order
 *
 * ********************************************************************************************
 */
function useQueryOpenPositions(address: any) {
  const query = () =>
    new Promise((res) => {
      setTimeout(() => {
        res(Array.from({ length: 10 }, () => createOpenPositionsRow()));
      }, 2000);
    });
  return useQuery(["OpenPositions", address], query, {
    keepPreviousData: true,
  });
}
function useQueryHistory(address: any) {
  const query = () =>
    new Promise((res) => {
      setTimeout(() => {
        res(Array.from({ length: 10 }, () => createHistoryRow()));
      }, 2000);
    });
  return useQuery(["History", address], query, {
    keepPreviousData: true,
  });
}
type TradeProps = {
  tokenRegistry: ReturnType<typeof useTokenRegistryQuery>;
  enhancedPools: ReturnType<typeof useEnhancedPoolsQuery>;
  rowanPrice: ReturnType<typeof useRowanPriceQuery>;
};
const Trade = (props: TradeProps) => {
  const { tokenRegistry, enhancedPools, rowanPrice } = props;

  /**
   * ********************************************************************************************
   *
   * Find ROWAN as "Token" from Registry to use it in TokenSelector dropdown
   * For Collateral / Position dropdown logic
   *
   * ********************************************************************************************
   */
  const tokenRowan = useMemo(() => {
    return tokenRegistry.data.find((token) => token.displaySymbol === "rowan");
  }, [tokenRegistry.data]);

  /**
   * ********************************************************************************************
   *
   * Derivate `activePool` to enable "reactivity". On first load "pools[0]" may be "undefined"
   * "setSelectedPool" is used in "Inputs Event Handlers" section
   *
   * ********************************************************************************************
   */
  const [selectedPool, setSelectedPool] = useState<typeof pools[0]>();
  const pools = useMemo(() => enhancedPools.data || [], [enhancedPools.data]);
  const activePool = useMemo(() => {
    if (selectedPool) {
      return selectedPool;
    }
    return pools[0];
  }, [pools, selectedPool]);

  /**
   * ********************************************************************************************
   *
   * Open Positions and History data based on active pool
   * @TODO Move query to child component to avoid loading data if component isn't in the screen
   *
   * ********************************************************************************************
   */
  const openPositionsQuery = useQueryOpenPositions(activePool);
  const useQueryHistoryQuery = useQueryHistory(activePool);

  /**
   * ********************************************************************************************
   *
   * Collateral default is to display "ROWAN" and it can be changed
   *
   * ********************************************************************************************
   */
  const [selectedCollateral, setSelectedCollateral] = useState(tokenRowan);

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
    if (selectedCollateral?.denom === activePool?.asset.denom) {
      return tokenRowan;
    }
    return activePool?.asset;
  }, [selectedCollateral, activePool, tokenRowan]);

  /**
   * ********************************************************************************************
   *
   * Collateral and Position dropdown must display only tokens from the pool + native (Rowan)
   *
   * ********************************************************************************************
   */
  const poolAvailableTokens = useMemo(() => {
    if (activePool && activePool.asset && tokenRowan) {
      return [activePool.asset, tokenRowan];
    }
    return [];
  }, [activePool, tokenRowan]);

  /**
   * ********************************************************************************************
   *
   * Input validation and "Place Buy Order" disabling derivate
   *
   * ********************************************************************************************
   */
  const [inputCollateral, setInputCollateral] = useState({
    value: `${COLLATERAL_MAX_VALUE}`,
    error: "",
  });
  const [inputPosition, setInputPosition] = useState({
    value: `${POSITION_MAX_VALUE}`,
    error: "",
  });
  const [radioPositionSide, setRadioPositionSide] = useState("long");
  const [inputLeverage, setInputLeverage] = useState({
    value: `${LEVERAGE_MAX_VALUE}`,
    error: "",
  });

  const isDisabledPlaceBuyOrder = useMemo(() => {
    return (
      Boolean(inputCollateral.error) ||
      Boolean(inputPosition.error) ||
      Boolean(inputLeverage.error)
    );
  }, [inputCollateral.error, inputPosition.error, inputLeverage.error]);

  /**
   * ********************************************************************************************
   *
   * Changing `displaySymbol` to match design requirements and`TokenSelector` API
   * We don't need that in the real object / data
   *
   * ********************************************************************************************
   */
  const modifiedActivePool = useMemo(() => {
    return immer(activePool?.asset, (draftAsset) => {
      if (draftAsset) {
        draftAsset.displaySymbol = `${draftAsset?.displaySymbol} / ROWAN`;
      }
    });
  }, [activePool?.asset]);
  const modifiedPools = useMemo(() => {
    return pools.map((pool) =>
      immer(pool.asset, (draftAsset) => {
        draftAsset.displaySymbol = `${draftAsset?.displaySymbol} / ROWAN`;
      }),
    );
  }, [pools]);

  /**
   * ********************************************************************************************
   *
   * Inputs Event Handlers
   *
   * ********************************************************************************************
   */
  const onChangePoolSelector = (token: TokenEntry) => {
    const asset = token as EnhancedRegistryAsset;
    const pool = pools.find(
      (pool) => pool.externalAsset?.symbol === asset.denom,
    );
    setSelectedPool(pool);
    setSelectedCollateral(tokenRowan);
  };
  const onChangeCollateralSelector = (token: TokenEntry) => {
    setSelectedCollateral(token as EnhancedRegistryAsset);
  };
  const onChangePositionSide = (position: string) => {
    setRadioPositionSide(position);
  };
  const onBlurLeverage = (event: ChangeEvent<HTMLInputElement>) => {
    const $input = event.currentTarget;
    const payload = inputValidatorLeverage($input, "blur");
    setInputLeverage(payload);
  };
  const onChangeLeverage = (event: ChangeEvent<HTMLInputElement>) => {
    const $input = event.currentTarget;
    const payload = inputValidatorLeverage($input, "change");
    setInputLeverage(payload);
  };
  const onChangePosition = (event: ChangeEvent<HTMLInputElement>) => {
    const $input = event.currentTarget;
    const payload = inputValidatorPosition($input, "change");
    setInputPosition(payload);
  };
  const onBlurPosition = (event: ChangeEvent<HTMLInputElement>) => {
    const $input = event.currentTarget;
    const payload = inputValidatorPosition($input, "blur");
    setInputPosition(payload);
  };
  const onChangeCollateral = (event: ChangeEvent<HTMLInputElement>) => {
    const $input = event.currentTarget;
    const payload = inputValidatorCollateral($input, "change");
    setInputCollateral(payload);
  };
  const onBlurCollateral = (event: ChangeEvent<HTMLInputElement>) => {
    const $input = event.currentTarget;
    const payload = inputValidatorCollateral($input, "blur");
    setInputCollateral(payload);
  };
  const onClickResetPlaceBuyOrder = (
    event: SyntheticEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    setSelectedPool(pools[0]);
    setSelectedCollateral(tokenRowan);
  };
  const onClickPlaceBuyOrder = (event: SyntheticEvent<HTMLButtonElement>) => {
    console.log(event.currentTarget);
  };

  return (
    <>
      <Head>
        <title>Sichain Dex - Margin - Trade</title>
      </Head>
      <section className="bg-gray-800 border border-gold-800 rounded mt-4 text-xs">
        <ul className="grid grid-cols-7 gap-5">
          <li className="col-span-2 pl-4 py-4">
            <BaseTokenSelector
              modalTitle="Pool"
              value={modifiedActivePool}
              onChange={onChangePoolSelector}
              tokens={modifiedPools}
              buttonClassName="text-base h-10 font-semibold"
            />
          </li>
          <li className="py-4">
            <div className="flex flex-col">
              <span className="text-gray-300">Pool TVL</span>
              <span className="font-semibold text-sm">
                <span className="mr-1">
                  {formatNumberAsCurrency(activePool?.stats.poolTVL || 0)}
                </span>
                <span className="text-green-400">(+2.8%)</span>
              </span>
            </div>
          </li>
          <li className="py-4">
            <div className="flex flex-col">
              <span className="text-gray-300">Pool Volume</span>
              <span className="font-semibold text-sm">
                <span className="mr-1">
                  {formatNumberAsCurrency(activePool?.stats.volume || 0)}
                </span>
                <span className="text-green-400">(+2.8%)</span>
              </span>
            </div>
          </li>
          <li className="py-4">
            <div className="flex flex-col">
              <span className="text-gray-300">ROWAN Price</span>
              <span className="font-semibold text-sm">
                <span className="mr-1">
                  {formatNumberAsCurrency(rowanPrice.data || 0, 4)}
                </span>
                <span className="text-red-400">(-2.8%)</span>
              </span>
            </div>
          </li>
          <li className="py-4">
            <div className="flex flex-col">
              <span className="text-gray-300">
                {activePool?.stats.symbol?.toUpperCase()} Price
              </span>
              <span className="font-semibold text-sm">
                <span className="mr-1">
                  <span className="mr-1">
                    {formatNumberAsCurrency(
                      Number(activePool?.stats.priceToken) || 0,
                    )}
                  </span>
                </span>
                <span className="text-red-400">(-1.3%)</span>
              </span>
            </div>
          </li>
          <li className="py-4">
            <div className="flex flex-col">
              <span className="text-gray-300">Pool Health</span>
              <span className="font-semibold text-sm">&ndash;</span>
            </div>
          </li>
        </ul>
      </section>
      <section className="mt-4 text-xs grid grid-cols-7 gap-x-5">
        <aside className="bg-gray-800 border border-gold-800 rounded col-span-2 flex flex-col">
          <ul className="border-b border-gold-800 flex flex-col gap-4 p-4">
            <li>
              <div className="flex flex-row">
                <span className="mr-auto min-w-fit text-gray-300">
                  Account Balance
                </span>
                <ValueFromTo
                  from="$50,000"
                  to="$49,000"
                  almostEqual={true}
                  className="font-semibold"
                />
              </div>
            </li>
            <li>
              <div className="flex flex-row">
                <span className="mr-auto min-w-fit text-gray-300">
                  Collateral Balance
                </span>
                <ValueFromTo
                  from="$5,000"
                  to="$4,000"
                  almostEqual={true}
                  className="font-semibold"
                />
              </div>
              <p className="text-gray-400 text-xs w-full text-right">
                <ValueFromTo from="40,000 ROWAN" to="40,000 ROWAN" />
              </p>
            </li>
            <li>
              <div className="flex flex-row">
                <span className="mr-auto min-w-fit text-gray-300">
                  Total Borrowed
                </span>
                <ValueFromTo
                  from="$10,000"
                  to="$11,000"
                  almostEqual={true}
                  className="font-semibold"
                />
              </div>
              <p className="text-gray-400 text-xs w-full text-right">
                <ValueFromTo from="100,000 ROWAN" to="100,000 ROWAN" />
              </p>
            </li>
          </ul>
          <ul className="border-b border-gold-800 flex flex-col gap-0 p-4">
            <li className="flex flex-col">
              <span className="text-xs text-gray-300 mb-1">Collateral</span>
              <div className="grid grid-cols-2 gap-2">
                <BaseTokenSelector
                  modalTitle="Collateral"
                  value={selectedCollateral}
                  onChange={onChangeCollateralSelector}
                  buttonClassName="h-9 !text-sm"
                  tokens={poolAvailableTokens}
                />
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
                    "text-right text-sm bg-gray-700 rounded border-0 font-semibold input-appearance-none",
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
                    {formatNumberAsCurrency(Number(inputCollateral.value))}
                  </span>
                </span>
              )}
            </li>
            <li className="flex flex-col">
              <span className="text-xs text-gray-300 mb-1">Position</span>
              <div className="grid grid-cols-2 gap-2">
                <BaseTokenSelector
                  modalTitle="Position"
                  value={selectedPosition}
                  buttonClassName="h-9 !text-sm"
                  readonly
                  tokens={poolAvailableTokens}
                />
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
                    "text-right text-sm bg-gray-700 rounded border-0 font-semibold input-appearance-none",
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
                    {formatNumberAsCurrency(Number(inputPosition.value))}
                  </span>
                </span>
              )}
            </li>
            <li className="mt-2 grid grid-cols-6 gap-2">
              <TwinRadioGroup
                value={radioPositionSide}
                className="col-span-3 self-end text-sm"
                name="margin-side"
                onChange={onChangePositionSide}
                options={[
                  {
                    title: "Long",
                    value: "long",
                  },
                  {
                    title: "Short",
                    value: "short",
                  },
                ]}
              />
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
                    "text-right text-sm bg-gray-700 rounded border-0 input-appearance-none",
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
          <div className="p-4">
            <ul className="bg-gray-850 flex flex-col gap-3 p-4 rounded-lg">
              <li>
                <div className="flex flex-row">
                  <span className="mr-auto min-w-fit text-gray-300">
                    Collateral Balance
                  </span>
                  <span>$1,000 </span>
                </div>
                <p className="text-gray-400 text-xs w-full text-right">
                  50,000 ROWAN
                </p>
              </li>
              <li>
                <div className="flex flex-row">
                  <span className="mr-auto min-w-fit text-gray-300">
                    Borrow Amount
                  </span>
                  <span>$1,000</span>
                </div>
                <p className="text-gray-400 text-xs w-full text-right">
                  100,000 ROWAN
                </p>
              </li>
              <li>
                <div className="flex flex-row">
                  <span className="mr-auto min-w-fit text-gray-300">
                    Overall Position
                  </span>
                  <span>$2,000</span>
                </div>
                <p className="text-gray-400 text-xs w-full text-right">2ETH</p>
              </li>
              <li>
                <div className="flex flex-row">
                  <span className="mr-auto min-w-fit text-gray-300">
                    Trade Fees
                  </span>
                  <span>&minus;$50</span>
                </div>
                <p className="text-gray-400 text-xs w-full text-right">
                  .0005 ETH
                </p>
              </li>
              <li>
                <div className="flex flex-row">
                  <span className="mr-auto min-w-fit text-gray-300">
                    Resulting Position
                  </span>
                  <span>$1,900</span>
                </div>
                <p className="text-gray-400 text-xs w-full text-right">
                  1.9 ETH
                </p>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-4 gap-2 px-4 pb-4">
            <Button
              variant="tertiary"
              as="button"
              size="xs"
              className="text-gray-300 font-normal self-center"
              onClick={onClickResetPlaceBuyOrder}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              as="button"
              size="md"
              className="col-span-3 rounded"
              disabled={isDisabledPlaceBuyOrder}
              onClick={onClickPlaceBuyOrder}
            >
              Place buy order
            </Button>
          </div>
        </aside>
        <section className="col-span-5 rounded border border-gold-800">
          {openPositionsQuery.isLoading || useQueryHistoryQuery.isLoading ? (
            <div className="bg-gray-850 p-10 text-center text-gray-100">
              Loading...
            </div>
          ) : (
            // @TODO Restructure PortfolioTable to receive an address (Pool or User) and let it manage the loading of data
            <PortfolioTable
              openPositions={{
                rows: openPositionsQuery.data as OpenPositionsTableProps["rows"],
                hideCols: ["unsettledInterest", "nextPayment", "paidInterest"],
              }}
              history={{
                rows: useQueryHistoryQuery.data as HistoryTableProps["rows"],
              }}
            />
          )}
        </section>
      </section>
    </>
  );
};
