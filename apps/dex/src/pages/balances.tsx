import { Decimal } from "@cosmjs/math";
import { runCatching } from "@sifchain/common";
import { useAccounts } from "@sifchain/cosmos-connect";
import {
  ArrowDownIcon,
  Button,
  Input,
  Modal,
  ModalProps,
  PoolsIcon,
  RacetrackSpinnerIcon,
  Select,
  SwapIcon,
} from "@sifchain/ui";
import SvgDotsVerticalIcon from "@sifchain/ui/src/components/icons/svgr/DotsVerticalIcon";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEventHandler, FC, useCallback, useMemo, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import AssetIcon from "~/compounds/AssetIcon";
import { useAllBalances } from "~/domains/bank/hooks/balances";
import { useExportTokensMutation } from "~/domains/bank/hooks/export";
import { useImportTokensMutation } from "~/domains/bank/hooks/import";
import { useLiquidityProviders } from "~/domains/clp";
import { useDexEnvironment } from "~/domains/core/envs";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";

const useBalancesWithPool = () => {
  const { data: liquidityProviders } = useLiquidityProviders();
  const { data: balances } = useAllBalances();

  const totalRowan = liquidityProviders?.pools.reduce(
    (prev, curr) => prev.plus(curr.nativeAssetBalance),
    Decimal.zero(18),
  );

  return {
    balances: useMemo(
      () =>
        balances?.map((x) => ({
          ...x,
          pool: liquidityProviders?.pools.find(
            (y) => y.liquidityProvider?.asset?.symbol === x.denom,
          ),
        })),
      [balances, liquidityProviders?.pools],
    ),
    totalRowan,
  };
};

const Stat: FC<{ label: string; value: string }> = (props) => (
  <div className="flex-1 grid gap-1">
    <span className="opacity-80">{props.label}</span>
    <span className="font-semibold md:text-2xl">{props.value}</span>
  </div>
);

const TokenFigure = (props: {
  symbol: string;
  displaySymbol: string;
  network: string;
}) => {
  return (
    <figcaption className="flex items-center gap-4">
      <figure>
        <AssetIcon network="sifchain" symbol={props.symbol ?? ""} size="md" />
      </figure>
      <div>
        <h2 className="uppercase font-bold">{props.displaySymbol}</h2>
        <h3>{props.network}</h3>
      </div>
    </figcaption>
  );
};

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

const ExportModal = (props: ModalProps & { denom: string }) => {
  const exportTokensMutation = useExportTokensMutation();

  const { indexedByIBCDenom } = useTokenRegistryQuery();
  const balances = useAllBalances();
  const balance = balances.indexedByDenom?.[props.denom];

  const token = indexedByIBCDenom[props.denom];
  const isEthToken = token?.ibcDenom.startsWith("c");
  const { data: env } = useDexEnvironment();
  const { accounts: sifAccounts } = useAccounts(env?.sifChainId ?? "", {
    enabled: env !== undefined,
  });
  const { accounts: cosmAccounts } = useAccounts(token?.chainId ?? "", {
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

const AssetsPage: NextPage = () => {
  const router = useRouter();

  const { data: env } = useDexEnvironment();
  const { balances, totalRowan } = useBalancesWithPool();

  const [selectedDenom, setSelectedDenom] = useState<string | undefined>();
  const selectedBalance = useMemo(
    () => balances?.find((x) => x.denom === selectedDenom),
    [balances, selectedDenom],
  );

  const stats = useMemo(() => {
    return [
      {
        label: "Total",
        value: 10,
      },
      {
        label: "Available",
        value: 100000,
      },
      {
        label: "Pooled",
        value: 100000,
      },
    ];
  }, []);

  const actions = useMemo(
    () => [
      {
        label: "Import",
        Icon: ArrowDownIcon,
        href: (denom: string) =>
          `balances?action=import&denom=${encodeURIComponent(denom)}`,
      },
      {
        label: "Export",
        Icon: () => <ArrowDownIcon className="rotate-180" />,
        href: (denom: string) =>
          `balances?action=export&denom=${encodeURIComponent(denom)}`,
      },
      {
        label: "Pools",
        Icon: PoolsIcon,
        href: (denom: string) => `/pools?denom=${encodeURIComponent(denom)}`,
      },
      {
        label: "Swap",
        Icon: SwapIcon,
        href: (denom: string) => `/swap?fromDenom=${encodeURIComponent(denom)}`,
      },
    ],
    [],
  );

  return (
    <>
      <section className="flex-1 w-full bg-black p-6 md:py-12 md:px-24">
        <header className="mb-10 md:mb-12">
          <div className="flex items-center justify-between pb-6 md:pb-8">
            <h2 className="text-2xl font-bold text-white">Balances</h2>
            <Link href={`balances?action=import&denom=cusdc`}>
              <Button as="a">
                <ArrowDownIcon /> Import
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {stats.map((stat) => (
              <Stat
                key={stat.label}
                label={stat.label}
                value={stat.value.toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                })}
              />
            ))}
          </div>
        </header>
        <div className="flex flex-col gap-4 md:hidden">
          {balances?.map((balance) => {
            const pooledAmount =
              balance.denom === env?.nativeAsset.symbol
                ? totalRowan
                : balance.pool?.externalAssetBalance;

            return (
              <details
                key={balance.denom}
                className="[&[open]>summary>div>.marker]:rotate-180"
              >
                <summary className="flex justify-between items-center mb-2">
                  <TokenFigure
                    symbol={balance.symbol ?? ""}
                    displaySymbol={balance.displaySymbol ?? ""}
                    network={balance.network ?? ""}
                  />
                  <div className="flex items-center gap-4">
                    <strong>
                      {balance.amount
                        .plus(
                          pooledAmount ??
                            Decimal.zero(balance.amount.fractionalDigits),
                        )
                        .toFloatApproximation()
                        .toLocaleString(undefined, {
                          maximumFractionDigits: 6,
                        })}
                    </strong>
                    <span className="marker p-2 cursor-pointer select-none">
                      ▼
                    </span>
                    <button
                      className="p-2"
                      onClick={() => setSelectedDenom(balance.denom)}
                    >
                      <SvgDotsVerticalIcon />
                    </button>
                  </div>
                </summary>
                <div className="flex pl-10">
                  <div className="flex-1">
                    <header className="opacity-80">Available</header>
                    <div>
                      {balance.amount
                        .toFloatApproximation()
                        .toLocaleString(undefined, {
                          maximumFractionDigits: 6,
                        })}
                    </div>
                  </div>
                  <div className="flex-1">
                    <header className="opacity-80">Pooled</header>
                    <div>
                      {(pooledAmount ?? Decimal.zero(0))
                        ?.toFloatApproximation()
                        .toLocaleString(undefined, {
                          maximumFractionDigits: 6,
                        })}
                    </div>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
        <table className="hidden w-full md:table">
          <thead className="text-left uppercase text-xs [&>th]:font-normal [&>th]:opacity-80 [&>th]:pb-6">
            <th>Token</th>
            <th>Balance</th>
            <th>Available</th>
            <th>Pooled</th>
            <th>Action</th>
          </thead>
          <tbody>
            {balances?.map((balance) => {
              const pooledAmount =
                balance.denom === env?.nativeAsset.symbol
                  ? totalRowan
                  : balance.pool?.externalAssetBalance;

              return (
                <tr key={balance.denom} className="[&>td]:pb-2">
                  <td>
                    <TokenFigure
                      symbol={balance.symbol ?? ""}
                      displaySymbol={balance.displaySymbol ?? ""}
                      network={balance.network ?? ""}
                    />
                  </td>
                  <td>
                    {balance.amount
                      .plus(
                        pooledAmount ??
                          Decimal.zero(balance.amount.fractionalDigits),
                      )
                      .toFloatApproximation()
                      .toLocaleString(undefined, {
                        maximumFractionDigits: 6,
                      })}
                  </td>
                  <td>
                    {balance.amount
                      .toFloatApproximation()
                      .toLocaleString(undefined, {
                        maximumFractionDigits: 6,
                      })}
                  </td>
                  <td>
                    {(pooledAmount ?? Decimal.zero(0))
                      ?.toFloatApproximation()
                      .toLocaleString(undefined, {
                        maximumFractionDigits: 6,
                      })}
                  </td>
                  <td className="w-0">
                    <div className="flex gap-3">
                      {actions.map(({ label, href }, index) => (
                        <Link key={index} href={href(balance.denom)}>
                          <a className="flex-1 text-center h-full px-4 py-3 rounded first:bg-gray-750 hover:bg-gray-700">
                            <span>{label}</span>
                          </a>
                        </Link>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      <Modal
        title={selectedBalance?.displaySymbol?.toUpperCase()}
        isOpen={selectedDenom !== undefined}
        onClose={useCallback(() => setSelectedDenom(undefined), [])}
      >
        {actions.map(({ label, Icon, href }, index) => (
          <Link key={index} href={href(selectedDenom ?? "")}>
            <a className="flex items-center gap-2 w-full px-2 py-3 rounded hover:bg-gray-700">
              <Icon />
              <span>{label}</span>
            </a>
          </Link>
        ))}
      </Modal>
      <ImportModal
        denom={router.query["denom"]?.toString() ?? ""}
        isOpen={router.query["action"] === "import"}
        onClose={useCallback(() => router.back(), [router])}
        onRequestDenomChange={useCallback(
          (denom) =>
            router.replace(
              `balances?action=import&denom=${encodeURIComponent(denom ?? "")}`,
            ),
          [router],
        )}
      />
      <ExportModal
        denom={router.query["denom"]?.toString() ?? ""}
        isOpen={router.query["action"] === "export"}
        onClose={useCallback(() => router.back(), [router])}
      />
    </>
  );
};

export default AssetsPage;
