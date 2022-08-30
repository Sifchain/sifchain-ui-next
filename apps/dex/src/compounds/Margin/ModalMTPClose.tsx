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
  const confirmClosePosition = useMarginMTPCloseMutation({
    _optimisticCustodyAmount: props.data.custody_amount,
  });
  const collateralTokenQuery = useEnhancedTokenQuery(props.data.collateral_asset);
  const positionTokenQuery = useEnhancedTokenQuery(props.data.custody_asset);

  const collateralDecimals = collateralTokenQuery.data?.decimals ?? 0;
  const totalInterestPaid = Number(props.data.current_interest_paid_custody ?? "0");

  const { data: closingPositionSwap } = useSwapSimulationQuery(
    props.data.custody_asset,
    props.data.collateral_asset,
    props.data.current_custody_amount,
  );

  const closingPositionRaw = closingPositionSwap?.rawReceiving ?? "0";
  const closingPositionMinReceivingRaw = closingPositionSwap?.minimumReceiving ?? "0";

  const closingPositionAsNumber = Decimal.fromAtomics(closingPositionRaw, collateralDecimals).toFloatApproximation();

  const closingPositionMinReceivingAsNumber = Decimal.fromAtomics(
    closingPositionMinReceivingRaw,
    collateralDecimals,
  ).toFloatApproximation();

  const closingPositionFees = closingPositionAsNumber - closingPositionMinReceivingAsNumber;

  const currentPriceAsNumber = Number(positionTokenQuery.data?.priceUsd ?? "0");

  const onClickConfirmClose = useCallback(
    async (event: SyntheticEvent<HTMLButtonElement>) => {
      event.preventDefault();
      try {
        await confirmClosePosition.mutateAsync({
          id: Long.fromNumber(Number(props.data.id)),
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
    const openingPosition = Number(props.data.custody_amount ?? "0");
    const openingPositionValue = openingPosition * positionTokenQuery.data.priceUsd;
    const currentPosition = Number(props.data.current_custody_amount ?? "0");
    const currentValue = currentPosition * currentPriceAsNumber;
    const tradePnlValue = closingPositionMinReceivingAsNumber - Number(props.data.collateral_amount);
    const tradePnlValueSign = Math.sign(tradePnlValue);
    content = (
      <>
        <h1 className="text-center text-lg font-bold">Review closing trade</h1>
        <ul className="mt-4 flex flex-col gap-3">
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
                {isNil(openingPosition) ? (
                  <HtmlUnicode name="EmDash" />
                ) : (
                  <>
                    <AssetIcon symbol={props.data.custody_asset} network="sifchain" size="sm" />
                    <span className="ml-1">{formatNumberAsDecimal(openingPosition, 4)}</span>
                  </>
                )}
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Opening value</span>
              {isNil(openingPositionValue) ? (
                <HtmlUnicode name="EmDash" />
              ) : (
                <span>{formatNumberAsCurrency(openingPositionValue, 4)}</span>
              )}
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Total interest paid</span>
              <div className="flex flex-row items-center">
                {isNil(totalInterestPaid) ? (
                  <HtmlUnicode name="EmDash" />
                ) : (
                  <>
                    <AssetIcon symbol={props.data.custody_asset} network="sifchain" size="sm" />
                    <span className="ml-1">{formatNumberAsDecimal(totalInterestPaid, 4)}</span>
                  </>
                )}
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Current position</span>
              <div className="flex flex-row items-center">
                {isNil(currentPosition) ? (
                  <HtmlUnicode name="EmDash" />
                ) : (
                  <>
                    <AssetIcon symbol={props.data.custody_asset} network="sifchain" size="sm" />
                    <b className="ml-1">{formatNumberAsDecimal(currentPosition, 4)}</b>
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
              {isNil(currentValue) ? (
                <HtmlUnicode name="EmDash" />
              ) : (
                <span>{formatNumberAsCurrency(currentValue, 4)}</span>
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
                {isNil(closingPositionAsNumber) ? (
                  <HtmlUnicode name="EmDash" />
                ) : (
                  <>
                    <AssetIcon symbol={props.data.collateral_asset} network="sifchain" size="sm" />
                    <span className="ml-1">{formatNumberAsDecimal(closingPositionAsNumber, 4)}</span>
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
              <div className="flex flex-row items-center text-red-400">
                {isNil(closingPositionFees) ? (
                  <HtmlUnicode name="EmDash" />
                ) : (
                  <>
                    <AssetIcon symbol={props.data.collateral_asset} network="sifchain" size="sm" />
                    <HtmlUnicode name="MinusSign" className="ml-1" />
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
                {isNil(closingPositionMinReceivingAsNumber) ? (
                  <HtmlUnicode name="EmDash" />
                ) : (
                  <>
                    <AssetIcon symbol={props.data.collateral_asset} network="sifchain" size="sm" />
                    <b className="ml-1">{formatNumberAsDecimal(closingPositionMinReceivingAsNumber, 4)}</b>
                  </>
                )}
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Trade PnL</span>
              <div className="flex flex-row items-center">
                {isNil(tradePnlValue) ? (
                  <HtmlUnicode name="EmDash" />
                ) : (
                  <>
                    <AssetIcon symbol={props.data.collateral_asset} network="sifchain" size="sm" />
                    <span
                      className={clsx("ml-1", {
                        "text-green-400": tradePnlValueSign === 1 && tradePnlValue > 0,
                        "text-red-400": tradePnlValueSign === -1 && tradePnlValue < 0,
                      })}
                    >
                      {formatNumberAsDecimal(tradePnlValue, 4)}
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
    <Modal className="text-sm" isOpen={props.isOpen} onTransitionEnd={onTransitionEnd} onClose={props.onClose}>
      {content}
    </Modal>
  );
}
