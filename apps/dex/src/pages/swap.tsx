import { Decimal } from "@cosmjs/math";
import { Popover } from "@headlessui/react";
import { runCatching } from "@sifchain/common";
import {
  ArrowLeftIcon,
  Button,
  ButtonGroup,
  Input,
  Select,
  SelectOption,
  SettingsIcon,
  SwapIcon,
} from "@sifchain/ui";
import { useMemo, useState } from "react";
import { useSwapMutation } from "~/domains/clp";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import useSifnodeQuery from "~/hooks/useSifnodeQuery";
import useSifSigner from "~/hooks/useSifSigner";
import { useSifStargateClient } from "~/hooks/useSifStargateClient";

const SwapPage = () => {
  const swapMutation = useSwapMutation();
  const { data: stargateClient } = useSifStargateClient();
  const { signer } = useSifSigner();

  const [fromSelectedOption, setFromSelectedOption] = useState<SelectOption>({
    id: "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
    label: "atom",
    body: "atom",
  });
  const [toSelectedOption, setToSelectedOption] = useState<SelectOption>({
    id: "rowan",
    label: "rowan",
    body: "rowan",
  });

  const fromDenom = fromSelectedOption.id;
  const toDenom = toSelectedOption.id;

  const slippageOptions = [
    { label: "0.5%", value: 0.005 },
    { label: "1%", value: 0.01 },
    { label: "1.5%", value: 0.015 },
  ];
  const [selectedSlippageIndex, setSelectedSlippageIndex] = useState(0);
  const slippage = slippageOptions[selectedSlippageIndex]?.value;

  const [fromAmount, setFromAmount] = useState("");

  const commonOptions = { refetchInterval: 6000 };
  const pmtpParamsQuery = useSifnodeQuery(
    "clp.getPmtpParams",
    [{}],
    commonOptions,
  );

  const fromPoolQuery = useSifnodeQuery(
    "clp.getPool",
    [{ symbol: fromDenom }],
    commonOptions,
  );
  const toPoolQuery = useSifnodeQuery(
    "clp.getPool",
    [{ symbol: toDenom }],
    commonOptions,
  );

  // because rowan pool doesn't exist, it will return nothing
  // hence we doing this, if both selected token are rowan then we wouldn't allow the swap anyway
  const fromPool = fromPoolQuery.data?.pool ?? toPoolQuery.data?.pool;
  const toPool = toPoolQuery.data?.pool ?? fromPoolQuery.data?.pool;

  const tokenRegistryQuery = useTokenRegistryQuery();

  const tokenOptions = tokenRegistryQuery.data.map((x) => ({
    id: x.ibcDenom ?? "",
    label: x.displaySymbol,
    body: x.displaySymbol,
  }));

  const fromAmountDecimal = runCatching(() =>
    Decimal.fromUserInput(
      fromAmount,
      tokenRegistryQuery.indexedByIBCDenom[fromDenom]?.decimals ?? 0,
    ),
  )[1];

  const swapSimulationResult = useMemo(
    () =>
      runCatching(() =>
        stargateClient?.simulateSwapSync(
          {
            denom: fromDenom,
            amount: fromAmountDecimal?.atomics ?? "0",
            poolNativeAssetBalance: fromPool?.nativeAssetBalance ?? "0",
            poolExternalAssetBalance: fromPool?.externalAssetBalance ?? "0",
          },
          {
            denom: toDenom,
            poolNativeAssetBalance: toPool?.nativeAssetBalance ?? "0",
            poolExternalAssetBalance: toPool?.externalAssetBalance ?? "0",
          },
          pmtpParamsQuery.data?.pmtpRateParams?.pmtpPeriodBlockRate,
          slippage,
        ),
      )[1],
    [
      stargateClient,
      fromDenom,
      fromAmountDecimal?.atomics,
      fromPool?.nativeAssetBalance,
      fromPool?.externalAssetBalance,
      toDenom,
      toPool?.nativeAssetBalance,
      toPool?.externalAssetBalance,
      pmtpParamsQuery.data?.pmtpRateParams?.pmtpPeriodBlockRate,
      slippage,
    ],
  );

  const formattedResult = useMemo(
    () => ({
      ...swapSimulationResult,
      rawReceiving: Decimal.fromAtomics(
        swapSimulationResult?.rawReceiving ?? "0",
        tokenRegistryQuery.indexedByIBCDenom[toDenom]?.decimals ?? 0,
      ).toString(),
      minimumReceiving: Decimal.fromAtomics(
        swapSimulationResult?.minimumReceiving ?? "0",
        tokenRegistryQuery.indexedByIBCDenom[toDenom]?.decimals ?? 0,
      ).toString(),
      liquidityProviderFee: Decimal.fromAtomics(
        swapSimulationResult?.liquidityProvidierFee ?? "0",
        tokenRegistryQuery.indexedByIBCDenom[toDenom]?.decimals ?? 0,
      ).toString(),
    }),
    [swapSimulationResult, toDenom, tokenRegistryQuery.indexedByIBCDenom],
  );

  return (
    <section className="flex-1 flex flex-col bg-gray-800 w-full h-full p-6">
      <header className="flex items-center justify-between pb-6">
        <h2 className="text-2xl font-bold text-white">Swap</h2>
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button>
                {open ? <ArrowLeftIcon /> : <SettingsIcon />}
              </Popover.Button>
              <Popover.Panel className="absolute z-10 right-[-100%] bg-gray-700 rounded-lg border-gray-750 p-4">
                <ButtonGroup
                  selectedIndex={selectedSlippageIndex}
                  options={slippageOptions}
                  onChange={setSelectedSlippageIndex}
                />
              </Popover.Panel>
            </>
          )}
        </Popover>
      </header>
      <form
        className="flex-1 flex flex-col justify-between"
        onSubmit={(event) => {
          event.preventDefault();
          swapMutation.mutate({
            fromDenom,
            toDenom,
            fromAmount: fromAmountDecimal?.atomics ?? "0",
            minimumReceiving: swapSimulationResult?.minimumReceiving ?? "0",
          });
        }}
      >
        <div className="flex flex-col gap-3">
          <fieldset className="flex flex-col gap-2 bg-black rounded-md p-6">
            <legend className="float-left font-bold opacity-90">From</legend>
            <Select
              className="relative z-20"
              value={fromSelectedOption}
              options={tokenOptions}
              onChange={setFromSelectedOption}
            />
            <Input
              placeholder="Swap amount"
              value={fromAmount}
              onChange={(event) => setFromAmount(event.target.value)}
              fullWidth
            />
          </fieldset>
          <div className="flex justify-center align-middle my-[-2em] z-10">
            <button className="bg-gray-900 rounded-full p-3 border-4 border-gray-800">
              <SwapIcon width="1.25em" height="1.25em" />
            </button>
          </div>
          <fieldset className="flex flex-col gap-3 bg-black rounded-md p-6">
            <legend className="float-left font-bold opacity-90">To</legend>
            <Select
              className="relative z-10"
              value={toSelectedOption}
              options={tokenOptions}
              onChange={setToSelectedOption}
            />
            <Input
              value={formattedResult.minimumReceiving}
              fullWidth
              disabled
            />
          </fieldset>
        </div>
        <Button disabled={signer === undefined}>
          {signer === undefined ? "Please Connect Sif Wallet" : "Swap"}
        </Button>
      </form>
    </section>
  );
};

export default SwapPage;
