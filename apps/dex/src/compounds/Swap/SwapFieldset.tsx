import type { Decimal } from "@cosmjs/math";
import { Input, Label } from "@sifchain/ui";
import { FC, useCallback } from "react";

import TokenSelector from "../TokenSelector";

const formatBalance = (amount: Decimal) =>
  amount.toFloatApproximation().toLocaleString(undefined, {
    maximumFractionDigits: 6,
  }) ?? 0;

export type SwapFieldsetProps = {
  label: string;
  denom: string;
  balance?: Decimal;
  amount?: string;
  onDenomChange: (denom: string) => void;
  onAmountChange: (amount: string) => void;
};

export const SwapFieldset: FC<SwapFieldsetProps> = (props) => {
  const handleHalfClick = useCallback(() => {
    if (props.balance) {
      props.onAmountChange(
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
      props.onAmountChange(props?.balance?.toString());
    }
  }, [props]);

  return (
    <fieldset className="bg-black rounded-md p-6 pb-10">
      <div className="mb-3">
        <legend className="contents font-bold opacity-90">{props.label}</legend>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-end">
        <div className="md:min-w-[200px]">
          <TokenSelector
            label="Token"
            modalTitle={props.label}
            value={props.denom}
            onChange={(token) => token && props.onDenomChange(token.denom)}
          />
        </div>
        <Input
          inputClassName="text-right w-0 md:w-auto"
          type="number"
          label="Amount"
          secondaryLabel={`Balance: ${
            props.balance ? formatBalance(props.balance) : 0
          }`}
          placeholder="Swap amount"
          value={props.amount}
          onChange={(event) => props.onAmountChange(event.target.value)}
          leadingIcon={
            <div className="flex gap-1.5">
              <Label type="button" onClick={handleHalfClick}>
                Half
              </Label>
              <Label type="button" onClick={handleMaxClick}>
                Max
              </Label>
            </div>
          }
          fullWidth
        />
      </div>
    </fieldset>
  );
};
