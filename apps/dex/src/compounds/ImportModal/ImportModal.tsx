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
  Select,
} from "@sifchain/ui";
import { ChangeEventHandler, useCallback, useMemo, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import AssetIcon from "~/compounds/AssetIcon";
import { useAllBalances } from "~/domains/bank/hooks/balances";
import { useImportTokensMutation } from "~/domains/bank/hooks/import";
import { useDexEnvironment } from "~/domains/core/envs";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";

const ImportModal = (
  props: ModalProps & {
    denom: string;
    onRequestDenomChange: (denom: string) => unknown;
  },
) => {
  const importTokensMutation = useImportTokensMutation();

  const { data: tokenRegistry, indexedByIBCDenom } = useTokenRegistryQuery();
  const token = indexedByIBCDenom[props.denom];
  const balances = useAllBalances();
  const balance = balances.indexedByDenom?.[props.denom];

  const { data: evmAccount } = useAccount();
  const { data: evmWalletBalance } = useBalance({
    addressOrName: evmAccount?.address ?? "",
    token: token?.symbol === "CETH" ? (undefined as any) : token?.address,
  });
  const walletBalance = Number(evmWalletBalance?.formatted ?? 0);

  const { data: env } = useDexEnvironment();
  const { accounts: cosmAccounts } = useAccounts(env?.sifChainId ?? "", {
    enabled: env !== undefined,
  });
  const recipientAddress = cosmAccounts?.[0]?.address;

  const tokenOptions = useMemo(
    () =>
      tokenRegistry.map((x) => ({
        id: x.ibcDenom ?? "",
        label: x.displaySymbol,
        body: x.displaySymbol,
      })),
    [tokenRegistry],
  );

  const selectedTokenOptions = useMemo(
    () => tokenOptions.find((x) => x.id === props.denom),
    [props.denom, tokenOptions],
  );

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
      title={`Import ${indexedByIBCDenom[
        props.denom
      ]?.displaySymbol.toUpperCase()} from Sifchain`}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          importTokensMutation.mutate({
            chainId: token?.chainId ?? "",
            tokenAddress: token?.address ?? "",
            recipientAddress: recipientAddress ?? "",
            amount: {
              denom: props.denom,
              amount: amountDecimal?.atomics ?? "0",
            },
          });
        }}
      >
        <fieldset className="p-4 mb-4 bg-black rounded-lg">
          <Select
            className="z-10"
            options={tokenOptions}
            value={selectedTokenOptions}
            onChange={useCallback(
              (value) => props.onRequestDenomChange(value.id),
              [props],
            )}
          />
          <Input
            label="Amount"
            secondaryLabel={`Balance: ${(walletBalance ?? 0).toLocaleString(
              undefined,
              { maximumFractionDigits: 6 },
            )}`}
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
            <dt>Direction</dt>
            <dd>
              <span className="capitalize">{token?.network}</span>→ Sifchain
            </dd>
          </div>
          <div>
            <dt>Import amount</dt>
            <dd>
              {amountDecimal
                ?.toFloatApproximation()
                .toLocaleString(undefined, { maximumFractionDigits: 6 })}{" "}
              <AssetIcon network="sifchain" symbol={props.denom} size="sm" />
            </dd>
          </div>
          <div>
            <dt>New Sifchain Balance</dt>
            <dd>
              {balance?.amount
                .plus(
                  amountDecimal ??
                    Decimal.zero(balance.amount.fractionalDigits),
                )
                .toFloatApproximation()
                .toLocaleString(undefined, { maximumFractionDigits: 6 })}{" "}
              <AssetIcon network="sifchain" symbol={props.denom} size="sm" />
            </dd>
          </div>
        </dl>
        <Button
          className="w-full mt-6"
          disabled={importTokensMutation.isLoading}
        >
          {importTokensMutation.isLoading ? (
            <RacetrackSpinnerIcon />
          ) : (
            <ArrowDownIcon />
          )}{" "}
          Import
        </Button>
      </form>
    </Modal>
  );
};

export default ImportModal;
