import { Decimal } from "@cosmjs/math";
import { Transition } from "@headlessui/react";
import { IAsset, runCatching } from "@sifchain/common";
import {
  ArrowDownIcon,
  Button,
  ButtonGroup,
  ButtonProps,
  Input,
  Modal,
  RacetrackSpinnerIcon,
  SwapIcon,
  TokenEntry,
  TokenSelector,
} from "@sifchain/ui";
import BigNumber from "bignumber.js";
import clsx from "clsx";
import {
  PropsWithChildren,
  startTransition,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery } from "react-query";
import AssetIcon from "~/compounds/AssetIcon";
import { useAllBalancesQuery } from "~/domains/bank/hooks/balances";
import { useSwapMutation } from "~/domains/clp";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import useSifnodeQuery from "~/hooks/useSifnodeQuery";
import useSifSigner from "~/hooks/useSifSigner";
import { useSifStargateClient } from "~/hooks/useSifStargateClient";

type SwapConfirmationModalProps = {
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

const ConfirmationLineItem = (
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

const SwapConfirmationModal = (props: SwapConfirmationModalProps) => {
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

const formatBalance = (amount: Decimal) =>
  amount.toFloatApproximation().toLocaleString(undefined, {
    maximumFractionDigits: 6,
  }) ?? 0;

const toTokenEntry = <T extends IAsset>(x: T) => ({
  name: x.name,
  symbol: x.symbol,
  displaySymbol: x.displaySymbol,
  decimals: x.decimals,
  network: x.network,
  imageUrl: x.imageUrl ?? "",
  balance: "",
  hasDarkIcon: Boolean(x.hasDarkIcon),
});

function useEnhancedToken(symbolOrDenom: string) {
  const sanitized = symbolOrDenom.toLowerCase();
  const registryQuery = useTokenRegistryQuery();
  const allBalancesQuery = useAllBalancesQuery();

  const registryEntry = registryQuery.findBySymbolOrDenom(sanitized);
  const balanceEntry = allBalancesQuery.findBySymbolOrDenom(
    registryEntry?.ibcDenom ?? registryEntry?.symbol ?? sanitized,
  );

  const poolQuery = useSifnodeQuery("clp.getPool", [
    {
      symbol: registryEntry?.ibcDenom ?? registryEntry?.symbol ?? sanitized,
    },
  ]);

  const derivedQuery = useQuery(
    ["enhanced-token", symbolOrDenom],
    () => {
      if (!registryEntry) {
        console.log(`Token registry entry not found for ${symbolOrDenom}`);
        return;
      }

      return {
        ...registryEntry,
        balance: balanceEntry?.amount,
        pool: poolQuery.data?.pool,
      };
    },
    {
      enabled:
        Boolean(symbolOrDenom) &&
        registryQuery.isSuccess &&
        allBalancesQuery.isSuccess &&
        poolQuery.isSuccess,
    },
  );

  return {
    ...derivedQuery,
    isLoading:
      derivedQuery.isLoading ||
      registryQuery.isLoading ||
      allBalancesQuery.isLoading ||
      poolQuery.isLoading,
    error:
      derivedQuery.error ??
      registryQuery.error ??
      allBalancesQuery.error ??
      poolQuery.error,
  };
}

function useTokenPair(
  fromTokenSymbolOrDenom: string,
  toTokenSymbolOrDenom: string,
) {
  const [isFlipped, setFlipped] = useState(false);

  const flip = () => setFlipped(!isFlipped);

  const fromTokenQuery = useEnhancedToken(fromTokenSymbolOrDenom);
  const toTokenQuery = useEnhancedToken(toTokenSymbolOrDenom);

  return {
    isFlipped,
    flip,
    fromTokenQuery,
    toTokenQuery,
  };
}

const SwapPage = () => {
  const swapMutation = useSwapMutation();
  const allBalancesQuery = useAllBalancesQuery();
  const { data: stargateClient, isSuccess: isSifStargateClientQuerySuccess } =
    useSifStargateClient();
  const { signer, status: signerStatus } = useSifSigner();
  const { data: registry } = useTokenRegistryQuery();

  const isReady = useMemo(
    () =>
      allBalancesQuery.isSuccess &&
      isSifStargateClientQuerySuccess &&
      signerStatus === "resolved",
    [allBalancesQuery.isSuccess, isSifStargateClientQuerySuccess, signerStatus],
  );

  const {
    fromTokenQuery: { data: fromToken },
    toTokenQuery: { data: toToken },
    isFlipped,
    flip,
  } = useTokenPair("rowan", "atom");

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const slippageOptions = [
    { label: "0.5%", value: 0.005 },
    { label: "1%", value: 0.01 },
    { label: "1.5%", value: 0.015 },
  ];
  const [selectedSlippageIndex, setSelectedSlippageIndex] = useState(0);
  const [fromAmount, setFromAmount] = useState("");
  const slippage = slippageOptions[selectedSlippageIndex]?.value;

  const commonOptions = {
    refetchInterval: 6000,
    enabled: !isConfirmationModalOpen,
  };

  const pmtpParamsQuery = useSifnodeQuery(
    "clp.getPmtpParams",
    [{}],
    commonOptions,
  );

  const tokenOptions: TokenEntry[] = registry.map(toTokenEntry);

  const fromAmountDecimal = runCatching(() =>
    Decimal.fromUserInput(fromAmount, fromToken?.decimals ?? 0),
  )[1];

  const swapSimulationResult = useMemo(
    () =>
      runCatching(() =>
        stargateClient?.simulateSwapSync(
          {
            denom: fromToken?.ibcDenom ?? fromToken?.symbol ?? "",
            amount: fromAmountDecimal?.atomics ?? "0",
            poolNativeAssetBalance:
              fromToken?.pool?.externalAssetBalance ?? "0",
            poolExternalAssetBalance:
              fromToken?.pool?.externalAssetBalance ?? "0",
          },
          {
            denom: toToken?.ibcDenom ?? toToken?.symbol ?? "",
            poolNativeAssetBalance: toToken?.pool?.externalAssetBalance ?? "0",
            poolExternalAssetBalance:
              toToken?.pool?.externalAssetBalance ?? "0",
          },
          pmtpParamsQuery.data?.pmtpRateParams?.pmtpPeriodBlockRate,
          slippage,
        ),
      )[1],
    [
      stargateClient,
      fromToken?.ibcDenom,
      fromToken?.symbol,
      fromToken?.pool?.externalAssetBalance,
      fromAmountDecimal?.atomics,
      toToken?.ibcDenom,
      toToken?.symbol,
      toToken?.pool?.externalAssetBalance,
      pmtpParamsQuery.data?.pmtpRateParams?.pmtpPeriodBlockRate,
      slippage,
    ],
  );

  const parsedSwapResult = useMemo(
    () => ({
      ...swapSimulationResult,
      rawReceiving: Decimal.fromAtomics(
        swapSimulationResult?.rawReceiving ?? "0",
        toToken?.decimals ?? 0,
      ),
      receivingPreSlippage: Decimal.fromAtomics(
        BigNumber.max(
          0,
          new BigNumber(swapSimulationResult?.rawReceiving ?? 0)
            .minus(swapSimulationResult?.liquidityProviderFee ?? 0)
            .times(
              new BigNumber(1).minus(swapSimulationResult?.priceImpact ?? 0),
            ),
        )
          .integerValue()
          .toFixed(0),
        toToken?.decimals ?? 0,
      ),
      minimumReceiving: Decimal.fromAtomics(
        swapSimulationResult?.minimumReceiving ?? "0",
        toToken?.decimals ?? 0,
      ),
      liquidityProviderFee: Decimal.fromAtomics(
        swapSimulationResult?.liquidityProviderFee ?? "0",
        toToken?.decimals ?? 0,
      ),
    }),
    [swapSimulationResult, toToken?.decimals],
  );

  useEffect(
    () => {
      // reset mutation state every time modal is opened
      if (isConfirmationModalOpen && swapMutation.status !== "idle") {
        swapMutation.reset();
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [isConfirmationModalOpen],
  );

  const swapButtonMsg = (() => {
    if (signerStatus === "resolved" && signer === undefined) {
      return "Please Connect Sif Wallet";
    }

    if (!isReady) {
      return "Loading";
    }

    if (
      fromAmountDecimal?.isGreaterThan(
        fromToken?.balance ?? Decimal.zero(fromAmountDecimal.fractionalDigits),
      )
    ) {
      return "Insufficient balance";
    }

    return "Swap";
  })();

  return (
    <>
      <div className="flex-1 flex flex-col justify-center items-center">
        <section className="flex-1 flex flex-col w-full bg-gray-800 p-6 md:w-auto md:min-w-[32rem] md:rounded-xl md:flex-initial">
          <header className="flex items-center justify-between pb-6">
            <h2 className="text-2xl font-bold text-white">Swap</h2>
          </header>
          <form
            className="flex-1 flex flex-col justify-between"
            onSubmit={(event) => {
              event.preventDefault();
              startTransition(() => setIsConfirmationModalOpen(true));
            }}
          >
            <div className="flex flex-col gap-3">
              <fieldset className="bg-black rounded-md p-6 pb-10">
                <legend className="contents font-bold opacity-90 mb-3">
                  From
                </legend>
                <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-end">
                  <TokenSelector
                    label=""
                    modalTitle="From"
                    tokens={tokenOptions}
                    value={fromToken ? toTokenEntry(fromToken) : undefined}
                    onChange={() => {
                      //
                    }}
                  />
                  <Input
                    className="text-right md:flex-1"
                    label=" "
                    secondaryLabel={`Balance: ${
                      fromToken?.balance ? formatBalance(fromToken.balance) : 0
                    }`}
                    placeholder="Swap amount"
                    value={fromAmount}
                    onChange={(event) => setFromAmount(event.target.value)}
                    fullWidth
                  />
                </div>
              </fieldset>
              <div className="flex justify-center align-middle my-[-2em] z-10">
                <button
                  className={clsx(
                    "bg-gray-900 rounded-full p-3 border-4 border-gray-800 transition-transform	",
                    { "rotate-180": isFlipped },
                  )}
                  type="button"
                  onClick={() => {
                    startTransition(() => {
                      // setFromSelectedOption(toSelectedOption);
                      // setToSelectedOption(fromSelectedOption);
                      setFromAmount((x) =>
                        parsedSwapResult.minimumReceiving.toFloatApproximation() ===
                        0
                          ? x
                          : parsedSwapResult.minimumReceiving.toString(),
                      );
                      flip();
                    });
                  }}
                >
                  <SwapIcon width="1.25em" height="1.25em" />
                </button>
              </div>
              <fieldset className="bg-black rounded-md p-6">
                <legend className="contents font-bold opacity-90 mb-3">
                  To
                </legend>
                <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-end">
                  <TokenSelector
                    label="Token"
                    modalTitle="From"
                    tokens={tokenOptions}
                    value={toToken ? toTokenEntry(toToken) : undefined}
                    onChange={() => {
                      //
                    }}
                  />
                  <Input
                    className="text-right md:flex-1"
                    secondaryLabel={`Balance: ${
                      toToken?.balance ? formatBalance(toToken.balance) : 0
                    }`}
                    label="Amount"
                    value={
                      parsedSwapResult.minimumReceiving.toFloatApproximation() ===
                      0
                        ? 0
                        : parsedSwapResult.minimumReceiving
                            .toFloatApproximation()
                            .toFixed(10)
                    }
                    fullWidth
                    disabled
                  />
                </div>
              </fieldset>
              <div className="flex justify-between items-center">
                <label className="pr-6">Slippage</label>
                <div>
                  <ButtonGroup
                    className="bg-black"
                    itemClassName="px-4"
                    size="sm"
                    gap={8}
                    selectedIndex={selectedSlippageIndex}
                    options={slippageOptions}
                    onChange={setSelectedSlippageIndex}
                  />
                </div>
              </div>
            </div>
            <Button className="mt-8" disabled={swapButtonMsg !== "Swap"}>
              {swapButtonMsg}
            </Button>
          </form>
        </section>
      </div>
      <SwapConfirmationModal
        title={(() => {
          switch (swapMutation.status) {
            case "idle":
              return "Review swap";
            case "loading":
              return "Waiting for confirmation";
            case "success":
              return "Transaction submitted";
            case "error":
              return "Transaction failed";
          }
        })()}
        show={isConfirmationModalOpen}
        onClose={() => startTransition(() => setIsConfirmationModalOpen(false))}
        showDetail={swapMutation.isIdle}
        confirmationButtonProps={{
          children: (() => {
            switch (swapMutation.status) {
              case "idle":
                return "Confirm";
              case "loading":
                return <RacetrackSpinnerIcon />;
              case "success":
                return "Close";
              case "error":
                return "Close";
            }
          })(),
          disabled: swapMutation.isLoading,
          onClick: () => {
            switch (swapMutation.status) {
              case "idle":
                swapMutation.mutate({
                  fromDenom: fromToken?.ibcDenom ?? "",
                  toDenom: toToken?.ibcDenom ?? "",
                  fromAmount: fromAmountDecimal?.atomics ?? "0",
                  minimumReceiving:
                    swapSimulationResult?.minimumReceiving ?? "0",
                });
                break;
              case "loading":
                return;
              default:
                setIsConfirmationModalOpen(false);
            }
          },
        }}
        fromCoin={{
          denom: fromToken?.displaySymbol ?? "",
          amount: (
            fromAmountDecimal?.toFloatApproximation() ?? 0
          ).toLocaleString(undefined, { maximumFractionDigits: 6 }),
        }}
        toCoin={{
          denom: toToken?.displaySymbol ?? "",
          amount: parsedSwapResult.rawReceiving
            .toFloatApproximation()
            .toLocaleString(undefined, { maximumFractionDigits: 6 }),
          amountPreSlippage: parsedSwapResult.receivingPreSlippage
            .toFloatApproximation()
            .toLocaleString(undefined, { maximumFractionDigits: 6 }),
          minimumAmount: parsedSwapResult.minimumReceiving
            .toFloatApproximation()
            .toLocaleString(undefined, { maximumFractionDigits: 6 }),
        }}
        liquidityProviderFee={parsedSwapResult.liquidityProviderFee
          .toFloatApproximation()
          .toLocaleString(undefined, { maximumFractionDigits: 6 })}
        priceImpact={(parsedSwapResult.priceImpact ?? 0).toLocaleString(
          undefined,
          {
            style: "percent",
            maximumFractionDigits: 2,
          },
        )}
        slippage={(slippage ?? 0).toLocaleString(undefined, {
          style: "percent",
          maximumFractionDigits: 2,
        })}
      />
    </>
  );
};

export default SwapPage;
