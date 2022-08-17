import type { OpenPositionsQueryData } from "~/domains/margin/hooks/useMarginOpenPositionsQuery";

import { ArrowDownIcon, Button, Modal } from "@sifchain/ui";
import { SyntheticEvent, useCallback } from "react";
import Long from "long";

import { useCloseMTPMutation } from "~/domains/margin/hooks";
import AssetIcon from "~/compounds/AssetIcon";
import { useEnhancedTokenQuery } from "~/domains/clp";
import { FlashMessageLoading } from "./_components";

type ModalClosePositionProps = {
  data: OpenPositionsQueryData;
  isOpen: boolean;
  onClose: () => void;
  onMutationError?: (_error: Error) => void;
  onMutationSuccess?: () => void;
  onTransitionEnd?: () => void;
};
export function ModalClosePosition(props: ModalClosePositionProps) {
  const positionToCloseMutation = useCloseMTPMutation();
  const collateralTokenQuery = useEnhancedTokenQuery(props.data.collateral_asset);
  const positionTokenQuery = useEnhancedTokenQuery(props.data.custody_asset);
  const onClickConfirmClose = async (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await positionToCloseMutation.mutateAsync({
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
    positionToCloseMutation.reset();
  }, [positionToCloseMutation, props]);

  let content = <FlashMessageLoading />;
  if (collateralTokenQuery.isSuccess && positionTokenQuery.isSuccess) {
    content = (
      <>
        <div className="mb-4 rounded-lg bg-yellow-100 p-4 text-sm text-yellow-700" role="alert">
          <span className="font-medium">Warning:</span> The data used below are mocked values, but the action to close a
          position is functional.
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
              <span>&mdash;</span>
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
              <span>&mdash;</span>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Total interest paid</span>
              <div className="flex flex-row items-center">
                <span className="mr-1">&mdash;</span>
                <AssetIcon symbol={props.data.custody_asset} network="sifchain" size="sm" />
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Current position</span>
              <div className="flex flex-row items-center">
                <span className="mr-1">&mdash;</span>
                <AssetIcon symbol={props.data.custody_asset} network="sifchain" size="sm" />
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Current price</span>
              <span>&mdash;</span>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Current value</span>
              <span>&mdash;</span>
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
                <span className="mr-1">&mdash;</span>
                <AssetIcon symbol={props.data.collateral_asset} network="sifchain" size="sm" />
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Price Impact</span>
              <span>&mdash;</span>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Resulting amount</span>
              <div className="flex flex-row items-center">
                <span className="mr-1">&mdash;</span>
                <AssetIcon symbol={props.data.collateral_asset} network="sifchain" size="sm" />
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">PnL</span>
              <span>&mdash;</span>
            </div>
          </li>
        </ul>
        {positionToCloseMutation.isLoading ? (
          <p className="mt-4 rounded bg-indigo-200 py-3 px-4 text-center text-indigo-800">Closing position...</p>
        ) : (
          <Button variant="primary" as="button" size="md" className="mt-4 w-full rounded" onClick={onClickConfirmClose}>
            Confirm close
          </Button>
        )}
        {positionToCloseMutation.isError ? (
          <p className="mt-4 rounded bg-red-200 p-4 text-center text-red-800">
            <b className="mr-1">Failed to open margin position:</b>
            <span>{(positionToCloseMutation.error as Error).message}</span>
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
