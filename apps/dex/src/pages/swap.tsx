import { Decimal } from "@cosmjs/math";
import { runCatching } from "@sifchain/common";
import {
  Button,
  ButtonGroup,
  RacetrackSpinnerIcon,
  SwapIcon,
} from "@sifchain/ui";
import BigNumber from "bignumber.js";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import tw from "tailwind-styled-components";

import { SwapConfirmationModal } from "~/compounds/Swap";
import TokenAmountFieldset from "~/compounds/TokenAmountFieldset";
import { useAllBalancesQuery } from "~/domains/bank/hooks/balances";
import { useEnhancedTokenQuery, useSwapMutation } from "~/domains/clp";
import useSifnodeQuery from "~/hooks/useSifnodeQuery";
import useSifSigner from "~/hooks/useSifSigner";
import { useSifStargateClient } from "~/hooks/useSifStargateClient";
import { getFirstQueryValue } from "~/utils/query";
import { isNilOrWhitespace } from "~/utils/string";

const FlipButton = tw.button<{
  $flipped: boolean;
}>`
  bg-gray-900 rounded-full p-3 border-4 border-gray-800 transition-transform
  ${(props) => (props.$flipped ? "rotate-180" : "rotate-0")}
`;

function formatDecimal(value: Decimal | number, maximumFractionDigits = 6) {
  const asNumber =
    typeof value === "number" ? value : value.toFloatApproximation();

  return asNumber.toLocaleString(undefined, {
    maximumFractionDigits,
  });
}

function formatPercent(value: Decimal | number, maximumFractionDigits = 6) {
  const asNumber =
    typeof value === "number" ? value : value.toFloatApproximation();

  return asNumber.toLocaleString(undefined, {
    style: "percent",
    maximumFractionDigits,
  });
}

const SwapPage: NextPage = () => {
  const router = useRouter();

  const swapMutation = useSwapMutation();
  const allBalancesQuery = useAllBalancesQuery();
  const { data: stargateClient, isSuccess: isSifStargateClientQuerySuccess } =
    useSifStargateClient();
  const { signer, status: signerStatus } = useSifSigner();

  const isReady = useMemo(
    () =>
      allBalancesQuery.isSuccess &&
      isSifStargateClientQuerySuccess &&
      signerStatus === "resolved",
    [allBalancesQuery.isSuccess, isSifStargateClientQuerySuccess, signerStatus],
  );

  const fromDenom = decodeURIComponent(
    getFirstQueryValue(router.query["fromDenom"]) ?? "rowan",
  );
  const toDenom = decodeURIComponent(
    getFirstQueryValue(router.query["toDenom"]) ?? "cusdt",
  );

  const setDenomsPair = useCallback(
    (leftDenom: string | undefined, rightDenom: string | undefined) =>
      router.replace(
        `swap?fromDenom=${encodeURIComponent(
          leftDenom ?? fromDenom,
        )}&toDenom=${encodeURIComponent(rightDenom ?? toDenom)}`,
      ),
    [fromDenom, router, toDenom],
  );

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

  const { data: fromToken } = useEnhancedTokenQuery(fromDenom, commonOptions);
  const { data: toToken } = useEnhancedTokenQuery(toDenom, commonOptions);

  const pmtpParamsQuery = useSifnodeQuery(
    "clp.getPmtpParams",
    [{}],
    commonOptions,
  );

  const fromAmountDecimal = runCatching(() =>
    Decimal.fromUserInput(fromAmount, fromToken?.decimals ?? 0),
  )[1];

  const swapSimulationResult = useMemo(() => {
    const fromPool = fromToken?.pool ?? toToken?.pool;
    const toPool = toToken?.pool ?? fromToken?.pool;

    return runCatching(() =>
      stargateClient?.simulateSwapSync(
        {
          denom: fromToken?.denom ?? fromToken?.symbol ?? "",
          amount: fromAmountDecimal?.atomics ?? "0",
          poolNativeAssetBalance: fromPool?.nativeAssetBalance ?? "0",
          poolExternalAssetBalance: fromPool?.externalAssetBalance ?? "0",
        },
        {
          denom: toToken?.denom ?? toToken?.symbol ?? "",
          poolNativeAssetBalance: toPool?.nativeAssetBalance ?? "0",
          poolExternalAssetBalance: toPool?.externalAssetBalance ?? "0",
        },
        pmtpParamsQuery.data?.pmtpRateParams?.pmtpPeriodBlockRate,
        slippage,
      ),
    )[1];
  }, [
    fromToken,
    toToken,
    stargateClient,
    fromAmountDecimal?.atomics,
    pmtpParamsQuery.data?.pmtpRateParams?.pmtpPeriodBlockRate,
    slippage,
  ]);

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

  const [isFlipped, setFlipped] = useState(false);
  const flip = useCallback(() => {
    setDenomsPair(toDenom, fromDenom);
    setFromAmount((x) =>
      parsedSwapResult.minimumReceiving.toFloatApproximation() === 0
        ? x
        : parsedSwapResult.minimumReceiving.toString(),
    );
    setFlipped(!isFlipped);
  }, [
    fromDenom,
    isFlipped,
    parsedSwapResult.minimumReceiving,
    setDenomsPair,
    toDenom,
  ]);

  const validationError = useMemo(() => {
    if (signerStatus === "resolved" && signer === undefined) {
      return new Error("Please Connect Sif Wallet");
    }

    if (fromAmountDecimal?.toFloatApproximation() === 0) {
      return new Error();
    }

    if (
      fromAmountDecimal?.isGreaterThan(
        fromToken?.balance ?? Decimal.zero(fromAmountDecimal.fractionalDigits),
      )
    ) {
      return new Error("Insufficient balance");
    }

    return;
  }, [fromAmountDecimal, fromToken?.balance, signer, signerStatus]);

  const swapButtonText = useMemo(() => {
    if (!isReady) {
      return "Loading";
    }

    if (!isNilOrWhitespace(validationError?.message))
      return validationError?.message;

    return "Swap";
  }, [isReady, validationError?.message]);

  const [confirmationModalTitle, confirmationModalButtonLabel] = useMemo(() => {
    switch (swapMutation.status) {
      case "idle":
        return ["Review swap", "Confirm"];
      case "loading":
        return [
          "Waiting for confirmation",
          <RacetrackSpinnerIcon key="spinner-icon" />,
        ];
      case "success":
        return ["Transaction submitted", "Close"];
      case "error":
        return ["Transaction failed", "Close"];
    }
  }, [swapMutation.status]);

  return (
    <>
      <div className="flex-1 flex flex-col justify-center items-center">
        <section className="flex-1 flex flex-col w-full bg-gray-800 p-2 md:p-6 md:w-auto md:min-w-[32rem] md:rounded-xl md:flex-initial">
          <header className="flex items-center justify-between pb-2 md:pb-6">
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
              <TokenAmountFieldset
                label="From"
                denom={fromDenom}
                balance={fromToken?.balance}
                amount={fromAmount}
                onChangeDenom={(denom) => setDenomsPair(denom, undefined)}
                onChangeAmount={(amount) => setFromAmount(amount)}
              />
              <div className="flex justify-center align-middle my-[-2em] z-10">
                <FlipButton
                  $flipped={isFlipped}
                  onClick={(e) => {
                    e.preventDefault();
                    startTransition(() => {
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
                </FlipButton>
              </div>
              <TokenAmountFieldset
                label="To"
                denom={toDenom}
                balance={toToken?.balance}
                amount={
                  parsedSwapResult.minimumReceiving.toFloatApproximation() === 0
                    ? "0"
                    : parsedSwapResult.minimumReceiving
                        .toFloatApproximation()
                        .toFixed(10)
                }
                onChangeDenom={(denom) => setDenomsPair(undefined, denom)}
                onChangeAmount={(amount) => setFromAmount(amount)}
              />
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
            <Button
              className="mt-8"
              disabled={!isReady || validationError !== undefined}
            >
              {swapButtonText}
            </Button>
          </form>
        </section>
      </div>
      <SwapConfirmationModal
        title={confirmationModalTitle}
        show={isConfirmationModalOpen}
        onClose={() => startTransition(() => setIsConfirmationModalOpen(false))}
        showDetail={swapMutation.isIdle}
        confirmationButtonProps={{
          children: confirmationModalButtonLabel,
          disabled: swapMutation.isLoading,
          onClick: () => {
            switch (swapMutation.status) {
              case "idle":
                swapMutation.mutate({
                  fromDenom: fromToken?.denom ?? "",
                  toDenom: toToken?.denom ?? "",
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
          amount: formatDecimal(fromAmountDecimal ?? 0, 6),
        }}
        toCoin={{
          denom: toToken?.displaySymbol ?? "",
          amount: formatDecimal(parsedSwapResult.rawReceiving, 6),
          amountPreSlippage: formatDecimal(
            parsedSwapResult.receivingPreSlippage,
            6,
          ),
          minimumAmount: formatDecimal(parsedSwapResult.minimumReceiving),
        }}
        liquidityProviderFee={formatDecimal(
          parsedSwapResult.liquidityProviderFee,
        )}
        priceImpact={formatPercent(parsedSwapResult.priceImpact ?? 0, 2)}
        slippage={formatPercent(slippage ?? 0, 2)}
      />
    </>
  );
};

export default SwapPage;
