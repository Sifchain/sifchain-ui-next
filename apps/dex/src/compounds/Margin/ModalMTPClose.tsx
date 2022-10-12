import type { MarginOpenPositionsData } from "~/domains/margin/hooks";

import clsx from "clsx";
import { isNil } from "rambda";
import { Decimal } from "@cosmjs/math";
import {
  FlashMessageLoading,
  Button,
  formatNumberAsCurrency,
  formatNumberAsDecimal,
  Modal,
  FlashMessage5xxError,
  FlashMessage,
} from "@sifchain/ui";
import { SyntheticEvent, useCallback, useRef } from "react";
import Long from "long";

import { useMarginMTPCloseMutation } from "~/domains/margin/hooks";
import { useEnhancedTokenQuery, useMarginPositionSimulationQuery } from "~/domains/clp/hooks";

import { AssetHeading, TokenDisplaySymbol, TradeDetails, TradeReviewSeparator } from "./_components";
import { HtmlUnicode } from "./_trade";

const isTruthy = (target: any) => !isNil(target);

type MTPData = Pick<
  MarginOpenPositionsData,
  | "custody_asset"
  | "custody_amount"
  | "current_custody_amount"
  | "collateral_asset"
  | "id"
  | "collateral_amount"
  | "liabilities"
  | "custody_entry_price"
  | "current_interest_paid_custody"
>;

type ModalMTPCloseProps = {
  data: MTPData;
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

  const { data: closingPositionSwap } = useMarginPositionSimulationQuery(
    props.data.custody_asset,
    props.data.collateral_asset,
    currentCustodyAmount,
    1, // leverage = 1 => standard swap
  );

  const { data: swapRateData } = useMarginPositionSimulationQuery(
    props.data.custody_asset,
    props.data.collateral_asset,
    "1",
    1, // leverage = 1 => standard swap
  );

  const swapRateAsNumber = Decimal.fromAtomics(
    swapRateData?.rawReceiving ?? "0",
    collateralTokenQuery?.data?.decimals ?? 0,
  ).toFloatApproximation();

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

  const content = useRef<JSX.Element | null>(null);

  if (
    collateralTokenQuery.isSuccess &&
    positionTokenQuery.isSuccess &&
    collateralTokenQuery.data &&
    positionTokenQuery.data &&
    closingPositionSwap
  ) {
    const collateralDecimals = collateralTokenQuery.data.decimals ?? 0;

    const closingPositionAsDecimal = Decimal.fromAtomics(closingPositionSwap.rawReceiving, collateralDecimals);
    const closingPositionFeeAsDecimal = Decimal.fromAtomics(
      closingPositionSwap.liquidityProviderFee ?? "0",
      collateralDecimals,
    );

    const liabilitiesAsDecimal = Decimal.fromUserInput(props.data.liabilities, collateralDecimals);

    const finalPositionWithLiabilitiesAsNumber = closingPositionAsDecimal.toFloatApproximation();

    const swapResultAsDecimal = closingPositionAsDecimal.plus(closingPositionFeeAsDecimal);

    const openingPositionAsNumber = Number(props.data.custody_amount ?? "0");
    const openingPriceAsNumber = Number(props.data.custody_entry_price ?? "0");

    const openingValueAsNumber = openingPositionAsNumber * openingPriceAsNumber;
    const totalInterestPaidAsNumber = Number(props.data.current_interest_paid_custody ?? "0");
    const currentPositionAsNumber = Number(currentCustodyAmount);
    const currentPriceAsNumber = Number(positionTokenQuery.data.priceUsd ?? "0");
    const currentValueAsNumber = currentPositionAsNumber * currentPriceAsNumber;

    const collateralAmountAsNumber = Number(props.data.collateral_amount);

    const resultingPaymentAsDecimal = closingPositionAsDecimal.minus(liabilitiesAsDecimal);
    const tradePnlAsNumber = resultingPaymentAsDecimal.toFloatApproximation() - collateralAmountAsNumber;

    const tradePnlSign = Math.sign(tradePnlAsNumber);
    const tradePnlAbs = Math.abs(tradePnlAsNumber);

    content.current = (
      <>
        <section className="grid gap-3">
          <AssetHeading symbol={props.data.custody_asset} />
          <TradeDetails
            heading={[
              "Opening position",
              <>
                {formatNumberAsDecimal(openingPositionAsNumber, 4)}{" "}
                <TokenDisplaySymbol symbol={props.data.custody_asset} />
              </>,
            ]}
            details={[
              ["Opening price", formatNumberAsCurrency(openingPriceAsNumber, 4)],
              ["Opening value", formatNumberAsCurrency(openingValueAsNumber, 4)],
            ]}
          />
          <TradeDetails
            heading={[
              "Total interest paid",
              <>
                <HtmlUnicode name="MinusSign" />
                {formatNumberAsDecimal(totalInterestPaidAsNumber, 4)}{" "}
                <TokenDisplaySymbol symbol={props.data.custody_asset} />
              </>,
            ]}
          />
          <TradeDetails
            heading={[
              "Current position",
              <>
                {formatNumberAsDecimal(currentPositionAsNumber, 4)}{" "}
                <TokenDisplaySymbol symbol={props.data.custody_asset} />
              </>,
            ]}
            details={[
              ["Current price", formatNumberAsCurrency(currentPriceAsNumber, 4)],
              ["Current value", formatNumberAsCurrency(currentValueAsNumber, 4)],
            ]}
          />
        </section>
        <TradeReviewSeparator />
        <section className="grid gap-3">
          <AssetHeading symbol={props.data.collateral_asset} />
          <TradeDetails
            heading={[
              "Closing position",
              <>
                {formatNumberAsDecimal(finalPositionWithLiabilitiesAsNumber, 4)}{" "}
                <TokenDisplaySymbol symbol={props.data.collateral_asset} />
              </>,
            ]}
            details={[
              [
                "Current swap rate",
                <>
                  1 <TokenDisplaySymbol symbol={props.data.custody_asset} /> <HtmlUnicode name="AlmostEqualTo" />{" "}
                  {formatNumberAsDecimal(swapRateAsNumber, 4)}{" "}
                  <TokenDisplaySymbol symbol={props.data.collateral_asset} />
                </>,
              ],
              [
                "Swap result",
                <>
                  {formatNumberAsDecimal(swapResultAsDecimal.toFloatApproximation(), 4)}{" "}
                  <TokenDisplaySymbol symbol={props.data.collateral_asset} />
                </>,
              ],
              [
                "Fees",
                <>
                  <HtmlUnicode name="MinusSign" />
                  {formatNumberAsDecimal(closingPositionFeeAsDecimal.toFloatApproximation(), 4)}{" "}
                  <TokenDisplaySymbol symbol={props.data.collateral_asset} />
                </>,
              ],
            ]}
          />
          <TradeDetails
            heading={[
              "Borrow amount",
              <>
                <HtmlUnicode name="MinusSign" />
                {formatNumberAsDecimal(liabilitiesAsDecimal.toFloatApproximation(), 4)}{" "}
                <TokenDisplaySymbol symbol={props.data.collateral_asset} />
              </>,
            ]}
          />
          <TradeDetails
            heading={[
              "Resulting payment",
              <>
                {formatNumberAsDecimal(resultingPaymentAsDecimal.toFloatApproximation(), 4)}{" "}
                <TokenDisplaySymbol symbol={props.data.collateral_asset} />
              </>,
            ]}
            details={[
              [
                "Collateral",
                <>
                  <HtmlUnicode name="MinusSign" />
                  {formatNumberAsDecimal(collateralAmountAsNumber, 4)}{" "}
                  <TokenDisplaySymbol symbol={props.data.collateral_asset} />
                </>,
              ],
              [
                "Estimated PnL",
                <div
                  key="estimated-pnl"
                  className={clsx({
                    "text-green-400": tradePnlSign === 1,
                    "text-red-400": tradePnlSign === -1,
                  })}
                >
                  {tradePnlSign === 1 ? <HtmlUnicode name="PlusSign" /> : <HtmlUnicode name="MinusSign" />}
                  {formatNumberAsDecimal(tradePnlAbs, 4)} <TokenDisplaySymbol symbol={props.data.collateral_asset} />
                </div>,
              ],
            ]}
          />
        </section>
        {isNil(tradePnlAbs) ? (
          <FlashMessage className="mt-4 bg-yellow-100 text-center text-yellow-700">
            Calculations are still in progress. You can close your trade as soon as your closing positions is defined.
            Close this pop-up and re-open.
          </FlashMessage>
        ) : null}
        {confirmClosePosition.isError ? (
          <FlashMessage className="relative mt-4 bg-red-200 text-red-800">
            <b className="mr-1">Failed to close position:</b>
            <span>{(confirmClosePosition.error as Error).message}</span>
          </FlashMessage>
        ) : null}
        {confirmClosePosition.isLoading ? (
          <p className="mt-4 rounded bg-indigo-200 py-3 px-4 text-center text-indigo-800">Closing position...</p>
        ) : (
          <Button
            variant="primary"
            as="button"
            size="md"
            className="disalbed:opacity-50 mt-4 w-full rounded"
            onClick={isTruthy(tradePnlAbs) ? onClickConfirmClose : undefined}
            disabled={isNil(tradePnlAbs)}
          >
            Close trade
          </Button>
        )}
      </>
    );
  }

  if (collateralTokenQuery.isError || positionTokenQuery.isError) {
    console.group("Modal MTP Close Error");
    console.log({ collateralTokenQuery, positionTokenQuery });
    console.groupEnd();
    content.current = <FlashMessage5xxError size="full-page" />;
  }

  if (!content.current) {
    content.current = <FlashMessageLoading size="full-page" />;
  }

  return (
    <Modal
      title="Review closing trade"
      className="text-sm dark:bg-gray-900"
      isOpen={props.isOpen}
      onTransitionEnd={onTransitionEnd}
      onClose={props.onClose}
    >
      {content.current}
    </Modal>
  );
}
