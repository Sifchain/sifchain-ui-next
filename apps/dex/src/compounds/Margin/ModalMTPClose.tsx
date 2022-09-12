import type { MarginOpenPositionsData } from "~/domains/margin/hooks";

import { Decimal } from "@cosmjs/math";
import {
  FlashMessageLoading,
  Button,
  formatNumberAsCurrency,
  formatNumberAsDecimal,
  Modal,
  FlashMessage5xxError,
} from "@sifchain/ui";
import { SyntheticEvent, useCallback } from "react";
import Long from "long";

import { useMarginMTPCloseMutation } from "~/domains/margin/hooks";
import { useEnhancedTokenQuery, useSwapSimulationQuery } from "~/domains/clp/hooks";

import { AssetHeading, TokenDisplaySymbol, TradeDetails, TradeReviewSeparator } from "./_components";
import { HtmlUnicode } from "./_trade";

type ModalMTPCloseProps = {
  data: MarginOpenPositionsData;
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

  const { data: swapRateData } = useSwapSimulationQuery(
    props.data.custody_asset,
    props.data.collateral_asset,
    "1",
    0.01,
  );

  const swapRateAsNumber = Decimal.fromAtomics(
    swapRateData?.minimumReceiving ?? "0",
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
        <section className="grid gap-3">
          <AssetHeading symbol={props.data.custody_asset} />
          <TradeDetails
            heading={["Opening Position", ""]}
            details={[
              ["Opening price", formatNumberAsCurrency(Number(props.data.custody_entry_price), 4)],
              ["Opening value", formatNumberAsCurrency(openingValueAsNumber, 4)],
            ]}
          />
          <TradeDetails heading={["Total insterest paid", formatNumberAsCurrency(totalInterestPaidAsNumber, 4)]} />
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
                  {formatNumberAsDecimal(closingPositionMinReceivingAsDecimal.toFloatApproximation(), 4)}{" "}
                  <TokenDisplaySymbol symbol={props.data.collateral_asset} />
                </>,
              ],
              [
                "Fees",
                <>
                  {formatNumberAsCurrency(closingPositionFees, 4)}{" "}
                  <TokenDisplaySymbol symbol={props.data.collateral_asset} />
                </>,
              ],
            ]}
          />
          <TradeDetails
            heading={[
              "Borrow amount",
              <>
                {formatNumberAsDecimal(liabilitiesAsDecimal.toFloatApproximation(), 4)}{" "}
                <TokenDisplaySymbol symbol={props.data.collateral_asset} />
              </>,
            ]}
          />
          <TradeDetails
            heading={[
              "Resulting payment",
              <>
                {formatNumberAsDecimal(closingPositionAsDecimal.toFloatApproximation(), 4)}{" "}
                <TokenDisplaySymbol symbol={props.data.collateral_asset} />
              </>,
            ]}
            details={[
              [
                "Collateral",
                <>
                  {formatNumberAsDecimal(Number(props.data.collateral_amount), 4)}{" "}
                  <TokenDisplaySymbol symbol={props.data.collateral_asset} />
                </>,
              ],
              [
                "Estimated PnL",
                <>
                  {tradePnlSign === 1 ? <HtmlUnicode name="PlusSign" /> : <HtmlUnicode name="MinusSign" />}
                  {formatNumberAsCurrency(Math.abs(tradePnlAsNumber), 4)}{" "}
                  <TokenDisplaySymbol symbol={props.data.collateral_asset} />
                </>,
              ],
            ]}
          />
        </section>
        {confirmClosePosition.isError ? (
          <p className="mt-4 rounded bg-red-200 p-4 text-center text-red-800">
            <b className="mr-1">Failed to close position:</b>
            <span>{(confirmClosePosition.error as Error).message}</span>
          </p>
        ) : null}
        {confirmClosePosition.isLoading ? (
          <p className="mt-4 rounded bg-indigo-200 py-3 px-4 text-center text-indigo-800">Closing position...</p>
        ) : (
          <Button variant="primary" as="button" size="md" className="mt-4 w-full rounded" onClick={onClickConfirmClose}>
            Confirm close
          </Button>
        )}
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
      className="text-sm dark:bg-gray-900"
      isOpen={props.isOpen}
      onTransitionEnd={onTransitionEnd}
      onClose={props.onClose}
    >
      {content}
    </Modal>
  );
}
