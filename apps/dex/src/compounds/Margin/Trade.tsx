import type { EnhancedRegistryAsset } from "~/domains/tokenRegistry/hooks/useTokenRegistry";
import type { NextPage } from "next";

import { ChangeEvent, SyntheticEvent, useMemo, useState } from "react";
import clsx from "clsx";
import Head from "next/head";
import immer from "immer";

import {
  ArrowDownIcon,
  Button,
  formatNumberAsCurrency,
  Modal,
  toast,
  TokenEntry,
  TokenSelector as BaseTokenSelector,
} from "@sifchain/ui";

import { PortfolioTable } from "~/compounds/Margin/PortfolioTable";
import { toTokenEntry } from "~/compounds/TokenSelector";
import { useBalancesStats } from "~/domains/bank/hooks/balances";
import { useEnhancedPoolsQuery, useEnhancedTokenQuery } from "~/domains/clp";

/**
 * ********************************************************************************************
 *
 * - `_trade`: Constant values, functions to abstract logic, and input validation utilities used across Trade page. They will be moved to a different place.
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
import { useMutationConfirmTradeOpen } from "./_mockdata";

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
  // const allBalances = useAllBalancesQuery();
  const balancesStats = useBalancesStats();

  if (
    enhancedPools.isSuccess &&
    // allBalances.isSuccess &&
    balancesStats.isSuccess
  ) {
    return (
      <Trade
        enhancedPools={enhancedPools}
        // allBalances={allBalances}
        accountBalance={
          balancesStats.data?.availableInUsdc.toFloatApproximation() ?? 0
        }
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
type TradeProps = {
  enhancedPools: ReturnType<typeof useEnhancedPoolsQuery>;
  // allBalances: ReturnType<typeof useAllBalancesQuery>;
  accountBalance: number;
};

const DEFAULT_COLLATERAL_DENOM = "rowan";

const Trade = (props: TradeProps) => {
  const { enhancedPools } = props;

  /**
   * ********************************************************************************************
   *
   * Derivate `activePool` to enable "reactivity". On first load "pools[0]" may be "undefined"
   * "setSelectedPool" is used in "Inputs Event Handlers" section
   *
   * ********************************************************************************************
   */
  const pools = useMemo(() => enhancedPools.data || [], [enhancedPools.data]);
  const [selectedPool, setSelectedPool] = useState<typeof pools[0]>();

  const activePool = useMemo(() => {
    if (selectedPool) {
      return selectedPool;
    }
    return pools[0];
  }, [pools, selectedPool]);

  const enhancedRowan = useEnhancedTokenQuery(DEFAULT_COLLATERAL_DENOM);

  /**
   * ********************************************************************************************
   *
   * Collateral default is to display "ROWAN" and it can be changed
   *
   * ********************************************************************************************
   */
  const [selectedCollateralDenom, setSelectedCollateralDenom] = useState(
    activePool?.asset.denom?.toLowerCase() as string,
  );

  const selectedCollateral = useEnhancedTokenQuery(selectedCollateralDenom);
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
    if (selectedCollateralDenom === activePool?.asset.denom) {
      return enhancedRowan.data;
    }
    return activePool?.asset;
  }, [selectedCollateralDenom, activePool, enhancedRowan.data]);

  /**
   * ********************************************************************************************
   *
   * Collateral and Position dropdown must display only tokens from the pool + native (Rowan)
   *
   * ********************************************************************************************
   */
  const poolAvailableTokens = useMemo(() => {
    if (activePool && activePool.asset && enhancedRowan.data) {
      return [activePool.asset, enhancedRowan.data];
    }
    return [];
  }, [activePool, enhancedRowan.data]);

  /**
   * ********************************************************************************************
   *
   * Input validation and "Open trade" disabling derivate
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
  const [inputLeverage, setInputLeverage] = useState({
    value: `${LEVERAGE_MAX_VALUE}`,
    error: "",
  });

  const isDisabledOpenTrade = useMemo(() => {
    return (
      Boolean(inputCollateral.error) ||
      Boolean(inputPosition.error) ||
      Boolean(inputLeverage.error)
    );
  }, [inputCollateral.error, inputPosition.error, inputLeverage.error]);

  /**
   * ********************************************************************************************
   *
   * "Confirm Open trade" modal
   *
   * ********************************************************************************************
   */
  const [checkbox01, setCheckbox01] = useState(false);
  const [checkbox02, setCheckbox02] = useState(false);

  const confirmTradeOpenMutation = useMutationConfirmTradeOpen();
  const [modalConfirmOpenTrade, setModalConfirmOpenTrade] = useState({
    isOpen: false,
  });

  const isDisabledConfirmOpenTrade = useMemo(() => {
    return checkbox01 === false || checkbox02 === false;
  }, [checkbox01, checkbox02]);
  const onClickConfirmOpenTrade = async (
    event: SyntheticEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    try {
      const position = (await confirmTradeOpenMutation.mutateAsync({
        id: "1234",
      })) as { id: string };
      setModalConfirmOpenTrade({ isOpen: false });
      toast.success(`Trade opened successfully! Trade ID: ${position.id}`);
    } catch (err) {
      console.log(err);
    }
  };

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
        draftAsset.displaySymbol = `${draftAsset?.displaySymbol} · ROWAN`;
      }
    });
  }, [activePool?.asset]);
  const modifiedPools = useMemo(() => {
    return pools.map((pool) =>
      immer(pool.asset, (draftAsset) => {
        draftAsset.displaySymbol = `${draftAsset?.displaySymbol} · ROWAN`;
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
    setSelectedCollateralDenom(DEFAULT_COLLATERAL_DENOM);
  };
  const onChangeCollateralSelector = (token: TokenEntry) => {
    setSelectedCollateralDenom(token.symbol.toLowerCase());
  };
  const onChangeLeverage = (event: ChangeEvent<HTMLInputElement>) => {
    const $input = event.currentTarget;
    const payload = inputValidatorLeverage($input, "change");
    setInputLeverage(payload);
  };
  const onBlurLeverage = (event: ChangeEvent<HTMLInputElement>) => {
    const $input = event.currentTarget;
    const payload = inputValidatorLeverage($input, "blur");
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

  const onClickReset = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const clean = {
      value: "",
      error: "",
    };
    setInputCollateral(clean);
    setInputPosition(clean);
    setInputLeverage(clean);
  };
  const onClickOpenTrade = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setModalConfirmOpenTrade({ isOpen: true });
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
              textPlaceholder=""
              modalTitle="Pool"
              value={modifiedActivePool}
              onChange={onChangePoolSelector}
              tokens={modifiedPools}
              buttonClassName="overflow-hidden text-base h-10 font-semibold"
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
                  {formatNumberAsCurrency(enhancedRowan.data?.priceUsd || 0, 4)}
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
              <span className="font-semibold text-sm">
                {formatNumberAsDecimal(Number(Math.random()))}
              </span>
            </div>
          </li>
        </ul>
      </section>
      <section className="mt-4 text-xs grid grid-cols-7 gap-x-5">
        <aside className="bg-gray-800 border border-gold-800 rounded col-span-2 flex flex-col">
          <ul className="border-b border-gold-800 flex flex-col gap-0 p-4">
            <li className="flex flex-col">
              <span className="text-xs text-gray-300 mb-1">Collateral</span>
              <div className="grid grid-cols-2 gap-2">
                <BaseTokenSelector
                  textPlaceholder=""
                  modalTitle="Collateral"
                  value={
                    selectedCollateral.data
                      ? toTokenEntry(selectedCollateral.data)
                      : undefined
                  }
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
                    {formatNumberAsCurrency(Number(inputCollateral.value))}
                  </span>
                </span>
              )}
            </li>
            <li className="flex flex-col">
              <span className="text-xs text-gray-300 mb-1">Position</span>
              <div className="grid grid-cols-2 gap-2">
                <BaseTokenSelector
                  textPlaceholder=""
                  modalTitle="Position"
                  value={selectedPosition}
                  buttonClassName="h-9 !text-sm"
                  tokens={poolAvailableTokens}
                  readonly
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
                    {formatNumberAsCurrency(Number(inputPosition.value))}
                  </span>
                </span>
              )}
            </li>
            <li className="mt-2 grid grid-cols-6 gap-2">
              <p className="col-span-3 self-end text-sm font-semibold p-2 text-center cursor-pointer bg-gray-500 text-gray-200 z-10 rounded hover:ring-1 hover:ring-indigo-300">
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
          <div className="p-4">
            <p className="text-center text-base">Review opening trade</p>
            <ul className="bg-gray-850 flex flex-col gap-3 p-4 rounded-lg mt-4">
              <li className="text-base font-semibold">USDC</li>
              <li>
                <div className="flex flex-row">
                  <span className="mr-auto min-w-fit text-gray-300">
                    Collateral
                  </span>
                  <span>$1,000 USDC</span>
                </div>
              </li>
              <li>
                <div className="flex flex-row">
                  <span className="mr-auto min-w-fit text-gray-300">
                    Borrow amount
                  </span>
                  <span>$2,000 USDC</span>
                </div>
              </li>
            </ul>
            <div className="flex justify-center items-center my-[-1em]">
              <div className="bg-black rounded-full p-3 border-2 border-gray-800">
                <ArrowDownIcon className="text-lg" />
              </div>
            </div>
            <ul className="bg-gray-850 flex flex-col gap-3 p-4 rounded-lg">
              <li className="text-base font-semibold">ROWAN</li>
              <li>
                <div className="flex flex-row">
                  <span className="mr-auto min-w-fit text-gray-300">
                    Entry price
                  </span>
                  <span>$0.005</span>
                </div>
              </li>
              <li>
                <div className="flex flex-row">
                  <span className="mr-auto min-w-fit text-gray-300">
                    Position size
                  </span>
                  <span>$400,000 ROWAN</span>
                </div>
              </li>
              <li>
                <div className="flex flex-row">
                  <span className="mr-auto min-w-fit text-gray-300">Fees</span>
                  <span>&minus;$50</span>
                </div>
              </li>
              <li>
                <div className="flex flex-row">
                  <span className="mr-auto min-w-fit text-gray-300">
                    Opening position
                  </span>
                  <span>$399.900 ROWAN</span>
                </div>
              </li>
            </ul>
            <div className="flex flex-row mt-2">
              <span className="mr-auto min-w-fit text-gray-300">
                Current interest rate
              </span>
              <span>25%</span>
            </div>
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
              disabled={isDisabledOpenTrade}
              onClick={onClickOpenTrade}
            >
              Open trade
            </Button>
          </div>
        </aside>
        <section className="col-span-5 rounded border border-gold-800">
          <PortfolioTable
            queryId="SomePoolIdOrAddress"
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
        isOpen={modalConfirmOpenTrade.isOpen}
        onTransitionEnd={() => {
          setCheckbox01(false);
          setCheckbox02(false);
        }}
        onClose={() => {
          if (modalConfirmOpenTrade.isOpen) {
            setModalConfirmOpenTrade({ isOpen: false });
          }
        }}
      >
        <>
          <h1 className="text-lg font-bold text-center">
            Review opening trade
          </h1>
          <ul className="flex flex-col gap-3 mt-6">
            <li>
              <div className="flex flex-row">
                <span className="mr-auto min-w-fit text-gray-300">
                  Opening position
                </span>
                <span>399,999 ROWAN</span>
              </div>
            </li>
            <li>
              <div className="flex flex-row">
                <span className="mr-auto min-w-fit text-gray-300">
                  Entry price
                </span>
                <span>$0.005</span>
              </div>
            </li>
            <li>
              <div className="flex flex-row">
                <span className="mr-auto min-w-fit text-gray-300">
                  Current interest rate
                </span>
                <span>25%</span>
              </div>
            </li>
          </ul>
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
          {confirmTradeOpenMutation.isLoading ? (
            <p className="text-center rounded py-3 px-4 mt-6 bg-indigo-200 text-indigo-800">
              Opening trade...
            </p>
          ) : (
            <Button
              variant="primary"
              as="button"
              size="md"
              className="w-full mt-6"
              disabled={isDisabledConfirmOpenTrade}
              onClick={onClickConfirmOpenTrade}
            >
              Confirm open trade
            </Button>
          )}
          {confirmTradeOpenMutation.isError ? (
            <p className="text-center p-4 mt-6 rounded bg-red-200 text-red-800">
              <span className="mr-1">An error occurred:</span>
              <span>{(confirmTradeOpenMutation.error as Error).message}</span>
            </p>
          ) : null}
        </>
      </Modal>
    </>
  );
};
