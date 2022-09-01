import type { OpenPositionsQueryData } from "~/domains/margin/hooks";

import clsx from "clsx";
import { Decimal } from "@cosmjs/math";
import {
  FlashMessageLoading,
  ArrowDownIcon,
  Button,
  formatNumberAsCurrency,
  formatNumberAsDecimal,
  Modal,
  FlashMessage5xxError,
} from "@sifchain/ui";
import { SyntheticEvent, useCallback } from "react";
import Long from "long";
import { isNil } from "rambda";

import { useMarginMTPCloseMutation } from "~/domains/margin/hooks";
import { useEnhancedTokenQuery, useSwapSimulationQuery } from "~/domains/clp/hooks";

import AssetIcon from "~/compounds/AssetIcon";

import { formatNumberAsPercent } from "./_intl";
import { HtmlUnicode, removeFirstCharsUC } from "./_trade";

type ModalMTPCloseProps = {
  data: OpenPositionsQueryData;
  isOpen: boolean;
  onClose: () => void;
  onMutationError?: (_error: Error) => void;
  onMutationSuccess?: () => void;
  onTransitionEnd?: () => void;
};
export function ModalMTPClose(props: ModalMTPCloseProps) {
  const currentCustodyAmount = props.data.current_custody_amount ?? "0";

  const confirmClosePosition = useMarginMTPCloseMutation({
    _optimisticCustodyAmount: currentCustodyAmount,
  });

  const collateralTokenQuery = useEnhancedTokenQuery(props.data.collateral_asset);
  const positionTokenQuery = useEnhancedTokenQuery(props.data.custody_asset);

  const { data: closingPositionSwap } = useSwapSimulationQuery(
    props.data.custody_asset,
    props.data.collateral_asset,
    currentCustodyAmount,
    0.01,
  );

  const onClickConfirmClose = useCallback(
    async (event: SyntheticEvent<HTMLButtonElement>) => {
      event.preventDefault();
      try {
        await confirmClosePosition.mutateAsync({
          id: Long.fromString(props.data.id),
        });
        if (props.onMutationSuccess) {
          props.onMutationSuccess();
        }
      } catch (err) {
        if (props.onMutationError) {
          props.onMutationError(err as Error);
        }
      }
    },
    [confirmClosePosition, props],
  );
  const onTransitionEnd = useCallback(() => {
    if (props.onTransitionEnd) {
      props.onTransitionEnd();
    }
    confirmClosePosition.reset();
  }, [confirmClosePosition, props]);

  let content = <FlashMessageLoading size="full-page" />;

  if (
    collateralTokenQuery.isSuccess &&
    positionTokenQuery.isSuccess &&
    collateralTokenQuery.data &&
    positionTokenQuery.data &&
    closingPositionSwap
  ) {
    const collateralDecimals = collateralTokenQuery.data.decimals ?? 0;

    const closingPositionRaw = closingPositionSwap.rawReceiving ?? "0";
    const closingPositionMinReceivingRaw = closingPositionSwap.minimumReceiving ?? "0";

    const closingPositionAsDecimal = Decimal.fromAtomics(closingPositionRaw, collateralDecimals);

    const liabilitiesAsDecimal = Decimal.fromUserInput(props.data.liabilities, collateralDecimals);

    const closingPositionMinReceivingAsDecimal = Decimal.fromAtomics(
      closingPositionMinReceivingRaw,
      collateralDecimals,
    );

    let closingPositionFees;
    let finalPositionWithLiabilitiesAsNumber;
    try {
      closingPositionFees = closingPositionAsDecimal.minus(closingPositionMinReceivingAsDecimal).toFloatApproximation();
      finalPositionWithLiabilitiesAsNumber = closingPositionMinReceivingAsDecimal
        .minus(liabilitiesAsDecimal)
        .toFloatApproximation();
    } catch (error) {
      console.group("Closing Position Fee BigNumber Error");
      console.log({ error });
      console.groupEnd();
      closingPositionFees = 0;
      finalPositionWithLiabilitiesAsNumber = 0;
    }

    const openingPositionAsNumber = Number(props.data.custody_amount ?? "0");
    const openingValueAsNumber = openingPositionAsNumber * positionTokenQuery.data.priceUsd;

    const totalInterestPaidAsNumber = Number(props.data.current_interest_paid_custody ?? "0");

    const currentPositionAsNumber = Number(currentCustodyAmount);
    const currentPriceAsNumber = Number(positionTokenQuery.data.priceUsd ?? "0");
    const currentValueAsNumber = currentPositionAsNumber * currentPriceAsNumber;

    const tradePnlAsNumber = finalPositionWithLiabilitiesAsNumber - Number(props.data.collateral_amount);
    const tradePnlSign = Math.sign(tradePnlAsNumber);

    content = (
      <>
        <ul className="flex flex-col gap-3">
          <li className="bg-gray-850 flex flex-row items-center rounded-lg py-2 px-4 text-base font-semibold">
            {isNil(props.data.custody_asset) ? (
              <HtmlUnicode name="EmDash" />
            ) : (
              <>
                <AssetIcon symbol={props.data.custody_asset} network="sifchain" size="sm" />
                <span className="ml-1">{removeFirstCharsUC(props.data.custody_asset.toUpperCase())}</span>
              </>
            )}
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Entry price</span>
              {isNil(props.data.custody_entry_price) ? (
                <HtmlUnicode name="EmDash" />
              ) : (
                <span>{formatNumberAsCurrency(Number(props.data.custody_entry_price), 4)}</span>
              )}
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Opening position</span>
              <div className="flex flex-row items-center">
                {isNil(openingPositionAsNumber) ? (
                  <HtmlUnicode name="EmDash" />
                ) : (
                  <>
                    <AssetIcon symbol={props.data.custody_asset} network="sifchain" size="sm" />
                    <span className="ml-1">{formatNumberAsDecimal(openingPositionAsNumber, 4)}</span>
                  </>
                )}
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Opening value</span>
              {isNil(openingValueAsNumber) ? (
                <HtmlUnicode name="EmDash" />
              ) : (
                <span>{formatNumberAsCurrency(openingValueAsNumber, 4)}</span>
              )}
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Total interest paid</span>
              <div className="flex flex-row items-center">
                {isNil(totalInterestPaidAsNumber) ? (
                  <HtmlUnicode name="EmDash" />
                ) : (
                  <>
                    <AssetIcon symbol={props.data.custody_asset} network="sifchain" size="sm" />
                    <span className="ml-1">{formatNumberAsDecimal(totalInterestPaidAsNumber, 4)}</span>
                  </>
                )}
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Current position</span>
              <div className="flex flex-row items-center">
                {isNil(currentPositionAsNumber) ? (
                  <HtmlUnicode name="EmDash" />
                ) : (
                  <>
                    <AssetIcon symbol={props.data.custody_asset} network="sifchain" size="sm" />
                    <b className="ml-1">{formatNumberAsDecimal(currentPositionAsNumber, 4)}</b>
                  </>
                )}
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Current price</span>
              {isNil(currentPriceAsNumber) ? (
                <HtmlUnicode name="EmDash" />
              ) : (
                <span>{formatNumberAsCurrency(currentPriceAsNumber, 4)}</span>
              )}
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Current value</span>
              {isNil(currentValueAsNumber) ? (
                <HtmlUnicode name="EmDash" />
              ) : (
                <span>{formatNumberAsCurrency(currentValueAsNumber, 4)}</span>
              )}
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
            {isNil(props.data.collateral_asset) ? (
              <HtmlUnicode name="EmDash" />
            ) : (
              <>
                <AssetIcon symbol={props.data.collateral_asset} network="sifchain" size="sm" />
                <span className="ml-1">{removeFirstCharsUC(props.data.collateral_asset.toUpperCase())}</span>
              </>
            )}
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Closing position</span>
              <div className="flex flex-row items-center">
                {isNil(closingPositionAsDecimal) ? (
                  <HtmlUnicode name="EmDash" />
                ) : (
                  <>
                    <AssetIcon symbol={props.data.collateral_asset} network="sifchain" size="sm" />
                    <span className="ml-1">
                      {formatNumberAsDecimal(closingPositionAsDecimal.toFloatApproximation(), 4)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Borrow amount</span>
              <div className="flex flex-row items-center text-red-400">
                {isNil(props.data.liabilities) ? (
                  <HtmlUnicode name="EmDash" />
                ) : (
                  <>
                    <AssetIcon symbol={props.data.collateral_asset} network="sifchain" size="sm" />
                    <HtmlUnicode name="MinusSign" className="ml-1" />
                    <span>{formatNumberAsDecimal(Number(props.data.liabilities), 4)}</span>
                  </>
                )}
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Fees</span>
              <div className={clsx("flex flex-row items-center ", { "text-red-400": closingPositionFees !== 0 })}>
                {isNil(closingPositionFees) ? (
                  <HtmlUnicode name="EmDash" />
                ) : (
                  <>
                    <AssetIcon symbol={props.data.collateral_asset} network="sifchain" size="sm" />
                    {closingPositionFees !== 0 ? (
                      <HtmlUnicode name="MinusSign" className="ml-1" />
                    ) : (
                      <div className="ml-1" />
                    )}
                    <span>{formatNumberAsDecimal(closingPositionFees, 4)}</span>
                  </>
                )}
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Price Impact</span>
              {isNil(closingPositionSwap.priceImpact) ? (
                <HtmlUnicode name="EmDash" />
              ) : (
                <span>{formatNumberAsPercent(closingPositionSwap.priceImpact, 4)}</span>
              )}
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Resulting amount</span>
              <div className="flex flex-row items-center">
                {isNil(finalPositionWithLiabilitiesAsNumber) ? (
                  <HtmlUnicode name="EmDash" />
                ) : (
                  <>
                    <AssetIcon symbol={props.data.collateral_asset} network="sifchain" size="sm" />
                    <b className="ml-1">{formatNumberAsDecimal(finalPositionWithLiabilitiesAsNumber, 4)}</b>
                  </>
                )}
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Trade PnL</span>
              <div className="flex flex-row items-center">
                {isNil(tradePnlAsNumber) ? (
                  <HtmlUnicode name="EmDash" />
                ) : (
                  <>
                    <AssetIcon symbol={props.data.collateral_asset} network="sifchain" size="sm" />
                    <span
                      className={clsx("ml-1", {
                        "text-green-400": tradePnlSign === 1 && tradePnlAsNumber > 0,
                        "text-red-400": tradePnlSign === -1 && tradePnlAsNumber < 0,
                      })}
                    >
                      {formatNumberAsDecimal(tradePnlAsNumber, 4)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </li>
        </ul>
        {confirmClosePosition.isLoading ? (
          <p className="mt-4 rounded bg-indigo-200 py-3 px-4 text-center text-indigo-800">Closing position...</p>
        ) : (
          <Button variant="primary" as="button" size="md" className="mt-4 w-full rounded" onClick={onClickConfirmClose}>
            Confirm close
          </Button>
        )}
        {confirmClosePosition.isError ? (
          <p className="mt-4 rounded bg-red-200 p-4 text-center text-red-800">
            <b className="mr-1">Failed to close position:</b>
            <span>{(confirmClosePosition.error as Error).message}</span>
          </p>
        ) : null}
      </>
    );
  }

  if (collateralTokenQuery.isError || positionTokenQuery.isError) {
    console.group("Modal MTP Close Error");
    console.log({ collateralTokenQuery, positionTokenQuery });
    console.groupEnd();
    content = <FlashMessage5xxError size="full-page" />;
  }

  return (
    <Modal
      title="Review closing trade"
      className="text-sm"
      isOpen={props.isOpen}
      onTransitionEnd={onTransitionEnd}
      onClose={props.onClose}
    >
      {content}
    </Modal>
  );
}
