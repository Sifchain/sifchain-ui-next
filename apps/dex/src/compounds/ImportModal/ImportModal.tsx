import { Decimal } from "@cosmjs/math";
import { isEvmBridgedCoin, runCatching } from "@sifchain/common";
import {
  useAccounts,
  useAccounts as useCosmAccount,
  useStargateClient,
} from "@sifchain/cosmos-connect";
import {
  ArrowDownIcon,
  Button,
  Input,
  Modal,
  ModalProps,
  RacetrackSpinnerIcon,
  Select,
} from "@sifchain/ui";
import { isNil } from "rambda";
import {
  ChangeEventHandler,
  FormEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useAccount, useBalance, useQuery } from "wagmi";
import AssetIcon from "~/compounds/AssetIcon";
import {
  useAllBalancesQuery,
  useBalanceQuery,
} from "~/domains/bank/hooks/balances";
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
  const balances = useAllBalancesQuery();
  const balance = balances.indexedByDenom?.[props.denom];

  const { data: evmAccount } = useAccount();
  const { data: evmWalletBalance } = useBalance({
    addressOrName: evmAccount?.address ?? "",
    token: token?.symbol === "CETH" ? (undefined as any) : token?.address,
  });

  const importTokenWalletBalance = useBalanceQuery(
    token?.chainId ?? "",
    props.denom,
    {
      enabled: token?.chainId !== undefined,
    },
  );
  const walletBalance = isEvmBridgedCoin(props.denom)
    ? Decimal.fromAtomics(
        evmWalletBalance?.value.toString() ?? "0",
        evmWalletBalance?.decimals ?? 0,
      )
    : importTokenWalletBalance.data?.amount;

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

  const error = useMemo(() => {
    if (isEvmBridgedCoin(props.denom) && isNil(evmAccount)) {
      return new Error("Please connect Ethereum wallet");
    }

    if (!isEvmBridgedCoin(props.denom) && isNil(cosmAccounts)) {
      return new Error("Please connect Sifchain wallet");
    }

    if (
      walletBalance?.isLessThan(
        amountDecimal ?? Decimal.zero(walletBalance?.fractionalDigits ?? 0),
      )
    ) {
      return new Error("Insufficient fund");
    }

    return;
  }, [amountDecimal, cosmAccounts, evmAccount, props.denom, walletBalance]);

  const disabled = importTokensMutation.isLoading || error !== undefined;

  const title = useMemo(() => {
    switch (importTokensMutation.status) {
      case "loading":
        return "Waiting for confirmation";
      case "success":
        return "Transaction submitted";
      case "error":
        return "Transaction failed";
      case "idle":
      default:
        return `Import ${indexedByIBCDenom[
          props.denom
        ]?.displaySymbol.toUpperCase()} from Sifchain`;
    }
  }, [importTokensMutation.status, indexedByIBCDenom, props.denom]);

  const buttonMessage = useMemo(() => {
    if (error !== undefined) {
      return error.message;
    }

    if (importTokensMutation.isError || importTokensMutation.isSuccess) {
      return "Close";
    }

    return [
      importTokensMutation.isLoading ? (
        <RacetrackSpinnerIcon />
      ) : (
        <ArrowDownIcon />
      ),
      "Import",
    ];
  }, [
    error,
    importTokensMutation.isError,
    importTokensMutation.isLoading,
    importTokensMutation.isSuccess,
  ]);

  const onSubmit = useCallback(
    (e: FormEvent<HTMLElement>) => {
      e.preventDefault();

      if (importTokensMutation.isError || importTokensMutation.isSuccess) {
        props.onClose(false);
        return;
      }

      importTokensMutation.mutate({
        chainId: token?.chainId ?? "",
        tokenAddress: token?.address ?? "",
        recipientAddress: recipientAddress ?? "",
        amount: {
          denom: props.denom,
          amount: amountDecimal?.atomics ?? "0",
        },
      });
    },
    [
      amountDecimal?.atomics,
      importTokensMutation,
      props,
      recipientAddress,
      token?.address,
      token?.chainId,
    ],
  );

  return (
    <Modal
      {...props}
      onTransitionEnd={() => importTokensMutation.reset()}
      title={title}
    >
      <form onSubmit={onSubmit}>
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
        {isEvmBridgedCoin(props.denom) && (
          <div className="flex items-center gap-4 p-4 bg-gray-750 rounded-lg">
            <p className="text-lg">ℹ️</p>
            <p className="text-gray-200 text-xs">
              Your funds will be available for use on Sifchain after about 10
              minutes. However in some cases, this action can take up to 60
              minutes.
              <br />
              <br />
              Up to 2 transactions might be needed, please do not close the
              modal or leave the page while transactions are still inprogress
            </p>
          </div>
        )}
        <Button className="w-full mt-6 " disabled={disabled}>
          {buttonMessage}
        </Button>
      </form>
    </Modal>
  );
};

export default ImportModal;
