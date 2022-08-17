import type { OpenPositionsQueryData } from "~/domains/margin/hooks/useMarginOpenPositionsQuery";

import { ArrowDownIcon, Button, Modal } from "@sifchain/ui";
import { SyntheticEvent, useCallback } from "react";
import Long from "long";

import { FlashMessageLoading } from "./_components";
import { HtmlUnicode } from "./_trade";
import { useCloseMTPMutation, transformMTPMutationErrors } from "~/domains/margin/hooks";
import { useEnhancedTokenQuery, useSwapSimulation } from "~/domains/clp";
import AssetIcon from "~/compounds/AssetIcon";

type ModalClosePositionProps = {
  data: OpenPositionsQueryData;
  isOpen: boolean;
  onClose: () => void;
  onMutationError?: (_error: Error) => void;
  onMutationSuccess?: () => void;
  onTransitionEnd?: () => void;
};
export function ModalClosePosition(props: ModalClosePositionProps) {
  const confirmClosePosition = useCloseMTPMutation();
  const collateralTokenQuery = useEnhancedTokenQuery(props.data.collateral_asset);
  const positionTokenQuery = useEnhancedTokenQuery(props.data.custody_asset);
  const positionToCollateralSwap = useSwapSimulation(
    props.data.custody_asset,
    props.data.collateral_asset,
    props.data.custody_amount,
  );
  const onClickConfirmClose = async (event: SyntheticEvent<HTMLButtonElement>) => {
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
  };
  const onTransitionEnd = useCallback(() => {
    if (props.onTransitionEnd) {
      props.onTransitionEnd();
    }
    confirmClosePosition.reset();
  }, [confirmClosePosition, props]);

  let content = <FlashMessageLoading />;

  if (collateralTokenQuery.isSuccess && positionTokenQuery.isSuccess && positionToCollateralSwap.data) {
    content = (
      <>
        <div className="mb-4 rounded-lg bg-yellow-100 p-4 text-sm text-yellow-700" role="alert">
          <span className="font-medium">Warning:</span> Calculations and data points are missing in this flow. We are
          working on it. However, the action to close a trade position is functional.
        </div>
        <h1 className="text-center text-lg font-bold">Review closing trade</h1>
        <ul className="mt-4 flex flex-col gap-3">
          <li className="bg-gray-850 flex flex-row items-center rounded-lg py-2 px-4 text-base font-semibold">
            <AssetIcon symbol={props.data.custody_asset} network="sifchain" size="sm" />
            <span className="ml-1">{props.data.custody_asset.toUpperCase()}</span>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Entry price</span>
              <span>
                <HtmlUnicode name="EmDash" />
              </span>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Opening position</span>
              <div className="flex flex-row items-center">
                <span className="mr-1">{props.data.custody_amount}</span>
                <AssetIcon symbol={props.data.custody_asset} network="sifchain" size="sm" />
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Opening value</span>
              <span className="mr-1">{props.data.current_price ?? <HtmlUnicode name="EmDash" />}</span>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Total interest paid</span>
              <div className="flex flex-row items-center">
                <span className="mr-1">{props.data.paid_interest ?? <HtmlUnicode name="EmDash" />}</span>
                <AssetIcon symbol={props.data.custody_asset} network="sifchain" size="sm" />
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Current position</span>
              <div className="flex flex-row items-center">
                <span className="mr-1">{props.data.current_price ?? <HtmlUnicode name="EmDash" />}</span>
                <AssetIcon symbol={props.data.custody_asset} network="sifchain" size="sm" />
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Current price</span>
              <span>{props.data.current_price ?? <HtmlUnicode name="EmDash" />}</span>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Current value</span>
              <span>{props.data.current_price ?? <HtmlUnicode name="EmDash" />}</span>
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
            <AssetIcon symbol={props.data.collateral_asset} network="sifchain" size="sm" />
            <span className="ml-1">{props.data.collateral_asset.toUpperCase()}</span>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Closing position</span>
              <div className="flex flex-row items-center">
                <span className="mr-1">{props.data.collateral_amount}</span>
                <AssetIcon symbol={props.data.collateral_asset} network="sifchain" size="sm" />
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Fees</span>
              <div className="flex flex-row items-center">
                <span className="mr-1">{positionToCollateralSwap.data.liquidityProviderFee}</span>
                <AssetIcon symbol={props.data.collateral_asset} network="sifchain" size="sm" />
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Price Impact</span>
              <span>{positionToCollateralSwap.data.priceImpact}</span>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Resulting amount</span>
              <div className="flex flex-row items-center">
                <span className="mr-1">{positionToCollateralSwap.data.rawReceiving}</span>
                <AssetIcon symbol={props.data.collateral_asset} network="sifchain" size="sm" />
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Unrealized P&L</span>
              <span>{props.data.unrealized_pnl ?? <HtmlUnicode name="EmDash" />}</span>
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
            <b className="mr-1">Failed to close margin position:</b>
            <span>{transformMTPMutationErrors((confirmClosePosition.error as Error).message)}</span>
          </p>
        ) : null}
      </>
    );
  }

  return (
    <Modal className="text-sm" isOpen={props.isOpen} onTransitionEnd={onTransitionEnd} onClose={props.onClose}>
      {content}
    </Modal>
  );
}
