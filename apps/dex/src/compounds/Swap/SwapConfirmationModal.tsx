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
  props: PropsWithChildren<{ className?: string }>,
) => (
  <li
    className={clsx(
      "flex justify-between align-middle px-4 py-3 rounded-lg",
      props.className,
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
          <div className="flex align-middle gap-1">
            <AssetIcon
              network="sifchain"
              symbol={props.fromCoin.denom}
              size="md"
            />
            {props.fromCoin.denom}
          </div>
          <span>{props.fromCoin.amount}</span>
        </ConfirmationLineItem>
        <div className="flex justify-center my-[-1.25em]">
          <div className="bg-gray-900 rounded-full p-3 border-2 border-gray-800">
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
              <div className="flex align-middle gap-1 font-bold">
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
          <div className="flex align-middle gap-1">
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
          <div className="flex align-middle gap-1 font-bold">
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
      <Button className="w-full mt-8" {...props.confirmationButtonProps} />
    </Modal>
  );
};
