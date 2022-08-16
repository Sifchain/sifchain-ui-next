import type { Decimal } from "@cosmjs/math";
import { Input, Label } from "@sifchain/ui";
import { useCallback } from "react";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import AssetIcon from "../AssetIcon";

type Coin = { denom: string; amount: string };

export type UnlockLiquidityTokenFieldsetProps = {
  label: string;
  coinLeft: Coin;
  coinRight: Coin;
  amount?: string;
  balance?: Decimal;
  onChangeAmount?: (amount: string) => void;
};

const formatBalance = (amount: Decimal) =>
  amount.toFloatApproximation().toLocaleString(undefined, {
    maximumFractionDigits: 6,
  }) ?? 0;

export const UnlockLiquidityTokenFieldset = (
  props: UnlockLiquidityTokenFieldsetProps
) => {
  const { indexedByDenom } = useTokenRegistryQuery();
  const tokenLeft = indexedByDenom[props.coinLeft.denom];
  const tokenRight = indexedByDenom[props.coinRight.denom];

  const handleHalfClick = useCallback(() => {
    if (props.balance) {
      props.onChangeAmount?.(
        (props.balance.toFloatApproximation() / 2).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: props.balance.fractionalDigits,
          useGrouping: false,
        })
      );
    }
  }, [props]);

  const handleMaxClick = useCallback(() => {
    if (props.balance) {
      props.onChangeAmount?.(props?.balance?.toString());
    }
  }, [props]);

  return (
    <fieldset className="rounded-md bg-black p-6 pb-10">
      <div className="mb-3">
        <legend className="contents opacity-90">
          <div className="flex justify-between gap-1">
            <div>{props.label}</div>
            <span className="flex gap-2 font-bold uppercase">
              <span className="flex gap-1">
                <AssetIcon symbol={props.coinLeft.denom} size="md" />{" "}
                {tokenLeft?.displaySymbol}
              </span>
              –
              <span className="flex gap-1">
                <AssetIcon symbol={props.coinRight.denom} size="md" />
                {tokenRight?.displaySymbol}
              </span>
            </span>
          </div>
        </legend>
      </div>
      <Input
        inputClassName="text-right"
        type="number"
        label="Amount"
        secondaryLabel={`Balance: ${
          props.balance ? formatBalance(props.balance) : 0
        }`}
        placeholder="Swap amount"
        value={props.amount}
        onChange={(event) => props.onChangeAmount?.(event.target.value)}
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
    </fieldset>
  );
};
