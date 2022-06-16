import { Decimal } from "@cosmjs/math";
import { runCatching } from "@sifchain/common";
import { Button, Input } from "@sifchain/ui";
import { useMemo, useState } from "react";
import { useSwapMutation } from "~/domains/clp";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import useSifnodeQuery from "~/hooks/useSifnodeQuery";
import useSifSigner from "~/hooks/useSifSigner";
import { useSifStargateClient } from "~/hooks/useSifStargateClient";
import PageLayout from "~/layouts/PageLayout";

const SwapPage = () => {
  const swapMutation = useSwapMutation();
  const { data: stargateClient } = useSifStargateClient();
  const { signer } = useSifSigner();

  const [fromDenom, setFromDenom] = useState("cusdc");
  const [toDenom, setToDenom] = useState("rowan");
  const [slippage, setSlippage] = useState(0.005);
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
    <PageLayout heading="Swap" title="Swap">
      Swap Page
      {stargateClient !== undefined && (
        <form
          className="flex flex-col gap-2"
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
          <select
            value={fromDenom}
            onChange={(event) => setFromDenom(event.target.value)}
          >
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
            {tokenRegistryQuery.data.map((x) => (
              <option key={x.ibcDenom} value={x.ibcDenom}>
                {x.displaySymbol}
              </option>
            ))}
          </select>
          <select
            value={toDenom}
            onChange={(event) => setToDenom(event.target.value)}
          >
            {tokenRegistryQuery.data.map((x) => (
              <option key={x.ibcDenom} value={x.ibcDenom}>
                {x.displaySymbol}
              </option>
            ))}
          </select>
          <select
            value={slippage}
            onChange={(event) => setSlippage(parseFloat(event.target.value))}
          >
            <option value={0.005}>0.5%</option>
            <option value={0.01}>1%</option>
            <option value={0.015}>1.5%</option>
          </select>
          <Input
            placeholder="Swap amount"
            value={fromAmount}
            onChange={(event) => setFromAmount(event.target.value)}
          />
          <p>Raw receiving: {formattedResult.rawReceiving}</p>
          <p>Minimum receiving: {formattedResult.minimumReceiving}</p>
          <p>Liquidity provider fee: {formattedResult.liquidityProviderFee}</p>
          <p>Price impact: {formattedResult.priceImpact}</p>
          <Button disabled={signer === undefined}>
            {signer === undefined ? "Please Sif Connect Wallet" : "Swap"}
          </Button>
        </form>
      )}
    </PageLayout>
  );
};

export default SwapPage;
