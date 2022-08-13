import type { Decimal } from "@cosmjs/math";
import { Input, Label } from "@sifchain/ui";
import clsx from "clsx";
import { FC, useCallback } from "react";

import TokenSelector from "../TokenSelector";

const formatBalance = (amount: Decimal) =>
  amount.toFloatApproximation().toLocaleString(undefined, {
    maximumFractionDigits: 6,
  }) ?? 0;

export type TokenAmountFieldsetProps = {
  label: string;
  denom: string;
  balance?: Decimal;
  amount?: string;
  onChangeDenom?: (denom: string) => void;
  onChangeAmount: (amount: string) => void;
  responsive?: boolean;
  tokenSelectionDisabled?: boolean;
  disabled?: boolean;
};

const TokenAmountFieldset: FC<TokenAmountFieldsetProps> = ({
  responsive = true,
  ...props
}) => {
  const handleHalfClick = useCallback(() => {
    if (props.balance) {
      props.onChangeAmount(
        (props.balance.toFloatApproximation() / 2).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: props.balance.fractionalDigits,
          useGrouping: false,
        }),
      );
    }
  }, [props]);

  const handleMaxClick = useCallback(() => {
    if (props.balance) {
      props.onChangeAmount(props?.balance?.toString());
    }
  }, [props]);

  return (
    <fieldset className="bg-black rounded-md p-6 pb-10">
      <div className="mb-3">
        <legend className="contents font-bold opacity-90">{props.label}</legend>
      </div>
      <div
        className={clsx("flex flex-col gap-2", {
          "md:flex-row md:justify-between md:items-end": responsive,
        })}
      >
        <div className={clsx({ "md:min-w-[160px]": responsive })}>
          <TokenSelector
            label="Token"
            modalTitle={props.label}
            value={props.denom}
            onChange={(token) => token && props.onChangeDenom?.(token.denom)}
            readonly={props.tokenSelectionDisabled}
          />
        </div>
        <Input
          containerClassName={clsx({ "md:min-w-[280px]": responsive })}
          inputClassName="text-right"
          type="number"
          label="Amount"
          secondaryLabel={`Balance: ${
            props.balance ? formatBalance(props.balance) : 0
          }`}
          placeholder="Swap amount"
          value={props.amount}
          onChange={(event) => props.onChangeAmount(event.target.value)}
          leadingIcon={
            !props.disabled && (
              <div className="flex gap-1.5">
                <Label type="button" onClick={handleHalfClick}>
                  Half
                </Label>
                <Label type="button" onClick={handleMaxClick}>
                  Max
                </Label>
              </div>
            )
          }
          disabled={props.disabled}
        />
      </div>
    </fieldset>
  );
};

export default TokenAmountFieldset;
