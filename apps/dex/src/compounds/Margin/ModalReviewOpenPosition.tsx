import type { SyntheticEvent } from "react";

import { Button, formatNumberAsCurrency, Modal, RacetrackSpinnerIcon } from "@sifchain/ui";
import { useMemo, useState, useCallback } from "react";

import { useOpenMTPMutation } from "~/domains/margin/hooks";
import { transformMTPMutationErrors } from "~/domains/margin/transformMTPMutationErrors";
import AssetIcon from "~/compounds/AssetIcon";

import { formatNumberAsDecimal, formatNumberAsPercent } from "./_intl";

type ModalReviewOpenPositionProps = {
  data: {
    collateralAmount: string;
    fromDenom: string;
    leverage: string;
    poolInterestRate: number;
    positionPriceUsd: number;
    positionTokenAmount: number;
    toDenom: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onMutationError?: (_error: Error) => void;
  onMutationSuccess?: () => void;
  onTransitionEnd?: () => void;
};
export function ModalReviewOpenPosition(props: ModalReviewOpenPositionProps) {
  const confirmOpenPositionMutation = useOpenMTPMutation();
  const [checkbox01, setCheckbox01] = useState(false);
  const [checkbox02, setCheckbox02] = useState(false);

  const isDisabledConfirmOpenPosition = useMemo(() => {
    return checkbox01 === false || checkbox02 === false;
  }, [checkbox01, checkbox02]);

  const onClickConfirmOpenPosition = async (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await confirmOpenPositionMutation.mutateAsync({
        collateralAsset: props.data.fromDenom,
        borrowAsset: props.data.toDenom,
        position: 1, // LONG
        collateralAmount: props.data.collateralAmount,
        leverage: props.data.leverage,
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
    confirmOpenPositionMutation.reset();
    setCheckbox01(false);
    setCheckbox02(false);
  }, [confirmOpenPositionMutation, props]);

  return (
    <Modal className="text-sm" isOpen={props.isOpen} onTransitionEnd={onTransitionEnd} onClose={props.onClose}>
      <>
        <h1 className="text-center text-lg font-bold">Review opening trade</h1>
        {props.data.positionTokenAmount &&
        props.data.toDenom &&
        props.data.positionPriceUsd &&
        props.data.poolInterestRate ? (
          <ul className="mt-6 flex flex-col gap-3">
            <li>
              <div className="flex flex-row items-center">
                <span className="mr-auto min-w-fit text-gray-300">Opening position</span>
                <div className="flex flex-row items-center">
                  <span className="mr-1">{formatNumberAsDecimal(props.data.positionTokenAmount)}</span>
                  <AssetIcon symbol={props.data.toDenom} network="sifchain" size="sm" />
                </div>
              </div>
            </li>
            <li>
              <div className="flex flex-row">
                <span className="mr-auto min-w-fit text-gray-300">Entry price</span>
                <span>{formatNumberAsCurrency(props.data.positionPriceUsd, 4)}</span>
              </div>
            </li>
            <li>
              <div className="flex flex-row">
                <span className="mr-auto min-w-fit text-gray-300">Current interest rate</span>
                <span>{formatNumberAsPercent(Number(props.data.poolInterestRate))}</span>
              </div>
            </li>
          </ul>
        ) : (
          <div className="bg-gray-850 mt-6 flex items-center justify-center rounded p-2 text-4xl">
            <RacetrackSpinnerIcon />
          </div>
        )}
        <ul className="mt-6">
          <li>
            <label htmlFor="checkbox01" className="flex flex-row items-start gap-2 rounded bg-gray-700 p-4">
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam iusto fugiat iste asperiores, non amet
                eligendi vitae culpa, aperiam voluptates accusamus voluptatem quibusdam modi maxime facere aliquam quae
                saepe quaerat.
              </p>
            </label>
          </li>
          <li>
            <label htmlFor="checkbox02" className="mt-4 flex flex-row items-start gap-2 rounded bg-gray-700 p-4">
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam iusto fugiat iste asperiores, non amet
                eligendi vitae culpa, aperiam voluptates accusamus voluptatem quibusdam modi maxime facere aliquam quae
                saepe quaerat.
              </p>
            </label>
          </li>
        </ul>
        {confirmOpenPositionMutation.isLoading ? (
          <p className="mt-6 rounded bg-indigo-200 py-3 px-4 text-center text-indigo-800">Opening trade...</p>
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
          <p className="mt-6 rounded bg-red-200 p-4 text-center text-red-800">
            <b className="mr-1">Failed to open margin position:</b>
            <span>{transformMTPMutationErrors((confirmOpenPositionMutation.error as Error).message)}</span>
          </p>
        ) : null}
      </>
    </Modal>
  );
}
