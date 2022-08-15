import { Transition } from "@headlessui/react";
import { ArrowDownIcon, Button, ButtonProps, Modal } from "@sifchain/ui";
import clsx from "clsx";
import type { PropsWithChildren } from "react";

import AssetIcon from "~/compounds/AssetIcon";

export type SwapConfirmationModalProps = {
  title: string;
  show: boolean;
  onClose: () => unknown;
  confirmationButtonProps: ButtonProps;
  showDetail: boolean;
  fromCoin: {
    amount: string;
    denom: string;
  };
  toCoin: {
    amount: string;
    amountPreSlippage: string;
    minimumAmount: string;
    denom: string;
  };
  liquidityProviderFee: string;
  priceImpact: string;
  slippage: string;
};

export const ConfirmationLineItem = (
  props: PropsWithChildren<{ className?: string }>
) => (
  <li
    className={clsx(
      "flex justify-between rounded-lg px-4 py-3 align-middle",
      props.className
    )}
  >
    {props.children}
  </li>
);

export const SwapConfirmationModal = (props: SwapConfirmationModalProps) => {
  return (
    <Modal title={props.title} isOpen={props.show} onClose={props.onClose}>
      <ul>
        <ConfirmationLineItem className="bg-black font-bold uppercase">
          <div className="flex gap-1 align-middle">
            <AssetIcon
              network="sifchain"
              symbol={props.fromCoin.denom}
              size="md"
            />
            {props.fromCoin.denom}
          </div>
          <span>{props.fromCoin.amount}</span>
        </ConfirmationLineItem>
        <div className="my-[-1.25em] flex justify-center">
          <div className="rounded-full border-2 border-gray-800 bg-gray-900 p-3">
            <ArrowDownIcon width="1em" height="1em" />
          </div>
        </div>
        <div className="overflow-y-hidden">
          <Transition
            show={props.showDetail}
            leave="transition-all duration-[2.5s]"
            leaveFrom="mt-0"
            leaveTo="mt-[-100%]"
          >
            <ConfirmationLineItem>
              <span>Swap result</span>
              <div className="flex gap-1 align-middle font-bold">
                {props.toCoin.amount}
                <AssetIcon
                  network="sifchain"
                  symbol={props.toCoin.denom}
                  size="md"
                />
              </div>
            </ConfirmationLineItem>
            <ConfirmationLineItem>
              <span>Liquidity provider fee</span>
              <span>{props.liquidityProviderFee}</span>
            </ConfirmationLineItem>
            <ConfirmationLineItem>
              <span>Price impact</span>
              <span>{props.priceImpact}</span>
            </ConfirmationLineItem>
          </Transition>
        </div>
        <ConfirmationLineItem className="bg-black font-bold uppercase">
          <div className="flex gap-1 align-middle">
            <AssetIcon
              network="sifchain"
              symbol={props.toCoin.denom}
              size="md"
            />
            {props.toCoin.denom}
          </div>
          <span>{props.toCoin.amountPreSlippage}</span>
        </ConfirmationLineItem>
        <ConfirmationLineItem>
          <span>Slippage</span>
          <span>{props.slippage}</span>
        </ConfirmationLineItem>
        <ConfirmationLineItem>
          <span>Minimum received</span>
          <div className="flex gap-1 align-middle font-bold">
            {props.toCoin.minimumAmount}
            <AssetIcon
              network="sifchain"
              symbol={props.toCoin.denom}
              size="md"
            />
          </div>
        </ConfirmationLineItem>
      </ul>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Button className="mt-8 w-full" {...props.confirmationButtonProps} />
    </Modal>
  );
};
