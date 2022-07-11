import { Decimal } from "@cosmjs/math";
import { runCatching } from "@sifchain/common";
import { useAccounts } from "@sifchain/cosmos-connect";
import {
  ArrowDownIcon,
  Button,
  Input,
  Modal,
  ModalProps,
  RacetrackSpinnerIcon,
} from "@sifchain/ui";
import { ChangeEventHandler, useCallback, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import AssetIcon from "~/compounds/AssetIcon";
import { useAllBalancesQuery } from "~/domains/bank/hooks/balances";
import { useExportTokensMutation } from "~/domains/bank/hooks/export";
import { useDexEnvironment } from "~/domains/core/envs";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";

const ExportModal = (props: ModalProps & { denom: string }) => {
  const exportTokensMutation = useExportTokensMutation();

  const { indexedByIBCDenom } = useTokenRegistryQuery();
  const balances = useAllBalancesQuery();
  const balance = balances.indexedByDenom?.[props.denom];

  const token = indexedByIBCDenom[props.denom];
  const isEthToken = token?.ibcDenom?.startsWith("c");
  const { data: env } = useDexEnvironment();
  const { accounts: sifAccounts } = useAccounts(env?.sifChainId ?? "", {
    enabled: env !== undefined,
  });
  const { accounts: cosmAccounts } = useAccounts(token?.network ?? "", {
    enabled: token !== undefined && !isEthToken,
  });
  const { data: ethAccount } = useAccount();
  const recipientAddress = isEthToken
    ? ethAccount?.address
    : cosmAccounts?.[0]?.address;

  const [amount, setAmount] = useState("");
  const amountDecimal = useMemo(
    () =>
      runCatching(() =>
        Decimal.fromUserInput(amount, balance?.amount.fractionalDigits ?? 0),
      )[1],
    [amount, balance?.amount.fractionalDigits],
  );

  return (
    <Modal
      {...props}
      title={`Export ${indexedByIBCDenom[
        props.denom
      ]?.displaySymbol.toUpperCase()} from Sifchain`}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          exportTokensMutation.mutate({
            senderAddress: sifAccounts?.[0]?.address ?? "",
            recipientAddress: recipientAddress ?? "",
            amount: {
              amount: amountDecimal?.atomics ?? "0",
              denom: props.denom,
            },
          });
        }}
      >
        <fieldset className="p-4 mb-4 bg-black rounded-lg">
          <Input
            label="Amount"
            secondaryLabel={`Balance: ${(
              balance?.amount.toFloatApproximation() ?? 0
            ).toLocaleString(undefined, { maximumFractionDigits: 6 })}`}
            value={amount}
            onChange={useCallback<ChangeEventHandler<HTMLInputElement>>(
              (event) => setAmount(event.target.value),
              [],
            )}
            fullWidth
          />
        </fieldset>
        <Input
          className="!bg-gray-750 text-ellipsis"
          label="Recipient address"
          value={recipientAddress}
          fullWidth
          disabled
        />
        <dl className="flex flex-col gap-4 p-6 [&>div]:flex [&>div]:justify-between [&_dt]:opacity-70 [&_dd]:font-semibold [&_dd]:flex [&_dd]:items-center [&_dd]:gap-2">
          <div>
            <dt>Destination</dt>
            <dd>Ethereum</dd>
          </div>
          <div>
            <dt>Export amount</dt>
            <dd>
              {amountDecimal
                ?.toFloatApproximation()
                .toLocaleString(undefined, { maximumFractionDigits: 6 })}{" "}
              <AssetIcon network="sifchain" symbol={props.denom} size="sm" />
            </dd>
          </div>
          <div>
            <dt>Export fee</dt>
            <dd>
              0.99 <AssetIcon network="sifchain" symbol="rowan" size="sm" />
            </dd>
          </div>
          <div>
            <dt>New Sifchain Balance</dt>
            <dd>
              {(amountDecimal !== undefined &&
              balance?.amount.isGreaterThanOrEqual(amountDecimal)
                ? balance.amount
                    .minus(
                      amountDecimal ??
                        Decimal.zero(balance.amount.fractionalDigits),
                    )
                    .toFloatApproximation()
                : 0
              ).toLocaleString(undefined, { maximumFractionDigits: 6 })}{" "}
              <AssetIcon network="sifchain" symbol={props.denom} size="sm" />
            </dd>
          </div>
        </dl>
        <Button
          className="w-full mt-6"
          disabled={exportTokensMutation.isLoading}
        >
          {exportTokensMutation.isLoading ? (
            <RacetrackSpinnerIcon />
          ) : (
            <ArrowDownIcon className="rotate-180" />
          )}{" "}
          Export
        </Button>
      </form>
    </Modal>
  );
};

export default ExportModal;
