import type { NextPage } from "next";

import {
  Button,
  TwinRadioGroup,
  formatNumberAsCurrency,
  TokenEntry,
} from "@sifchain/ui";
import Head from "next/head";

import { TokenSelector as BaseTokenSelector } from "@sifchain/ui";
import { PortfolioTable } from "~/compounds/Margin/PortfolioTable";
import { useEnhancedPoolsQuery, useRowanPriceQuery } from "~/domains/clp";
import { useEffect, useMemo, useState } from "react";
import type { EnhancedRegistryAsset } from "~/domains/tokenRegistry/hooks/useTokenRegistry";

function HtmlUnicode({ name }: { name: string }) {
  const unicodes: Record<string, string | string> = {
    AlmostEqualTo: "&#x2248;", // https://www.compart.com/en/unicode/U+2248
    RightwardsArrow: "&rightarrow;", // https://www.compart.com/en/unicode/U+2192
    EqualsSign: "&equals;", // https://www.compart.com/en/unicode/U+003D
  };
  const entity = unicodes[name] || `MISSING_UNICODE: ${name}`;
  return <span dangerouslySetInnerHTML={{ __html: entity }} />;
}

function ValueFromTo({
  from,
  to,
  almostEqual,
  className,
}: {
  from: string;
  to: string;
  almostEqual?: boolean;
  className?: string;
}) {
  return (
    <span className={className}>
      {almostEqual ? <HtmlUnicode name="AlmostEqualTo" /> : null}
      <span className="ml-1 mr-1">{from}</span>
      <HtmlUnicode name="RightwardsArrow" />
      <span className="ml-1">{to}</span>
    </span>
  );
}

const Trade: NextPage = () => {
  const enhancedPools = useEnhancedPoolsQuery();
  const useRowanPrice = useRowanPriceQuery();

  const pools: ReturnType<typeof useEnhancedPoolsQuery>["data"] = useMemo(
    () => enhancedPools.data || [],
    [enhancedPools.data],
  );
  const [selectedPool, setSelectedPool] = useState(pools[0]);

  useEffect(() => {
    if (pools && pools.length > 0) {
      setSelectedPool(pools[0]);
    }
  }, [pools]);

  const onChangePoolSelector = (token: TokenEntry) => {
    const asset = token as EnhancedRegistryAsset;
    const pool = pools.find(
      (pool) => pool.externalAsset?.symbol === asset.denom,
    );
    setSelectedPool(pool);
  };
  const onChangeCollateral = (token: TokenEntry) => console.log(token);
  const onChangePosition = (token: TokenEntry) => console.log(token);

  return (
    <>
      <Head>
        <title>Sichain Dex - Margin - Trade</title>
      </Head>
      <section className="bg-gray-800 border border-gold-800 rounded mt-4 text-xs">
        <ul className="grid grid-cols-7 gap-5">
          <li className="col-span-2 pl-4 py-4">
            <BaseTokenSelector
              modalTitle="Pool"
              value={selectedPool?.asset}
              onChange={onChangePoolSelector}
              tokens={pools.map((pool) => pool.asset)}
              buttonClassName="!h-auto !rounded border-none text-base font-semibold"
            />
          </li>
          <li className="py-4">
            <div className="flex flex-col">
              <span className="text-gray-300">Pool TVL</span>
              <span className="font-semibold text-sm">
                <span className="mr-1">
                  {formatNumberAsCurrency(selectedPool?.stats.poolTVL || 0)}
                </span>
                <span className="text-green-400">(+2.8%)</span>
              </span>
            </div>
          </li>
          <li className="py-4">
            <div className="flex flex-col">
              <span className="text-gray-300">Pool Volume</span>
              <span className="font-semibold text-sm">
                <span className="mr-1">
                  {formatNumberAsCurrency(selectedPool?.stats.volume || 0)}
                </span>
                <span className="text-green-400">(+2.8%)</span>
              </span>
            </div>
          </li>
          <li className="py-4">
            <div className="flex flex-col">
              <span className="text-gray-300">ROWAN Price</span>
              <span className="font-semibold text-sm">
                <span className="mr-1">
                  {formatNumberAsCurrency(useRowanPrice.data || 0, 4)}
                </span>
                <span className="text-red-400">(-2.8%)</span>
              </span>
            </div>
          </li>
          <li className="py-4">
            <div className="flex flex-col">
              <span className="text-gray-300">
                {selectedPool?.stats.symbol?.toUpperCase()} Price
              </span>
              <span className="font-semibold text-sm">
                <span className="mr-1">
                  <span className="mr-1">
                    {formatNumberAsCurrency(
                      Number(selectedPool?.stats.priceToken) || 0,
                    )}
                  </span>
                </span>
                <span className="text-red-400">(-1.3%)</span>
              </span>
            </div>
          </li>
          <li className="py-4">
            <div className="flex flex-col">
              <span className="text-gray-300">Pool Health</span>
              <span className="font-semibold text-sm">&ndash;</span>
            </div>
          </li>
        </ul>
      </section>
      <section className="mt-4 text-xs grid grid-cols-7 gap-x-5">
        <aside className="bg-gray-800 border border-gold-800 rounded col-span-2 flex flex-col">
          <ul className="border-b border-gold-800 flex flex-col gap-4 p-4">
            <li>
              <div className="flex flex-row">
                <span className="mr-auto min-w-fit text-gray-300">
                  Account Balance
                </span>
                <ValueFromTo
                  from="$50,000"
                  to="$49,000"
                  almostEqual={true}
                  className="font-semibold"
                />
              </div>
            </li>
            <li>
              <div className="flex flex-row">
                <span className="mr-auto min-w-fit text-gray-300">
                  Collateral Balance
                </span>
                <ValueFromTo
                  from="$5,000"
                  to="$4,000"
                  almostEqual={true}
                  className="font-semibold"
                />
              </div>
              <p className="text-gray-400 text-xs w-full text-right">
                <ValueFromTo from="40,000 ROWAN" to="40,000 ROWAN" />
              </p>
            </li>
            <li>
              <div className="flex flex-row">
                <span className="mr-auto min-w-fit text-gray-300">
                  Total Borrowed
                </span>
                <ValueFromTo
                  from="$10,000"
                  to="$11,000"
                  almostEqual={true}
                  className="font-semibold"
                />
              </div>
              <p className="text-gray-400 text-xs w-full text-right">
                <ValueFromTo from="100,000 ROWAN" to="100,000 ROWAN" />
              </p>
            </li>
          </ul>
          <ul className="border-b border-gold-800 flex flex-col gap-0 p-4">
            <li className="flex flex-col">
              <span className="text-xs text-gray-300 mb-1">Collateral</span>
              <div className="grid grid-cols-2 gap-2">
                <BaseTokenSelector
                  modalTitle="Collateral"
                  value={selectedPool?.asset}
                  onChange={onChangeCollateral}
                  buttonClassName="!h-auto !rounded border-none text-sm"
                  tokens={pools.map((pool) => pool.asset)}
                />
                <input
                  type="text"
                  defaultValue="100,000"
                  className="text-right text-sm bg-gray-700 rounded border-0 font-semibold"
                />
              </div>
              <span className="text-gray-300 text-right mt-1">
                <HtmlUnicode name="EqualsSign" />
                <span className="ml-1">$1,000</span>
              </span>
            </li>
            <li className="flex flex-col">
              <span className="text-xs text-gray-300 mb-1">Position</span>
              <div className="grid grid-cols-2 gap-2">
                <BaseTokenSelector
                  modalTitle="Position"
                  value={selectedPool?.asset}
                  onChange={onChangePosition}
                  buttonClassName="!h-auto !rounded border-none text-sm"
                  readonly
                  tokens={pools.map((pool) => pool.asset)}
                />
                <input
                  type="text"
                  defaultValue="1"
                  className="text-right text-sm bg-gray-700 rounded border-0 font-semibold"
                />
              </div>
              <span className="text-gray-300 text-right mt-1">
                <HtmlUnicode name="EqualsSign" />
                <span className="ml-1">$2,000</span>
              </span>
            </li>
            <li className="mt-2 grid grid-cols-6 gap-2">
              <TwinRadioGroup
                className="col-span-3 self-end text-sm"
                name="margin-side"
                options={[
                  {
                    title: "Long",
                    value: "long",
                  },
                  {
                    title: "Short",
                    value: "short",
                  },
                ]}
              />
              <div className="col-span-3 flex flex-col">
                <span className="text-xs text-gray-300 mb-1">
                  <span className="mr-1">Leverage</span>
                  <span className="text-gray-400">Up to 2x</span>
                </span>
                <input
                  type="text"
                  defaultValue="2x"
                  className="text-sm bg-gray-700 rounded border-0"
                />
              </div>
            </li>
          </ul>
          <div className="p-4">
            <ul className="bg-gray-850 flex flex-col gap-3 p-4 rounded-lg">
              <li>
                <div className="flex flex-row">
                  <span className="mr-auto min-w-fit text-gray-300">
                    Collateral Balance
                  </span>
                  <span>$1,000 </span>
                </div>
                <p className="text-gray-400 text-xs w-full text-right">
                  50,000 ROWAN
                </p>
              </li>
              <li>
                <div className="flex flex-row">
                  <span className="mr-auto min-w-fit text-gray-300">
                    Borrow Amount
                  </span>
                  <span>$1,000</span>
                </div>
                <p className="text-gray-400 text-xs w-full text-right">
                  100,000 ROWAN
                </p>
              </li>
              <li>
                <div className="flex flex-row">
                  <span className="mr-auto min-w-fit text-gray-300">
                    Overall Position
                  </span>
                  <span>$2,000</span>
                </div>
                <p className="text-gray-400 text-xs w-full text-right">2ETH</p>
              </li>
              <li>
                <div className="flex flex-row">
                  <span className="mr-auto min-w-fit text-gray-300">
                    Trade Fees
                  </span>
                  <span>&minus;$50</span>
                </div>
                <p className="text-gray-400 text-xs w-full text-right">
                  .0005 ETH
                </p>
              </li>
              <li>
                <div className="flex flex-row">
                  <span className="mr-auto min-w-fit text-gray-300">
                    Resulting Position
                  </span>
                  <span>$1,900</span>
                </div>
                <p className="text-gray-400 text-xs w-full text-right">
                  1.9 ETH
                </p>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-4 gap-2 px-4 pb-4">
            <Button
              variant="tertiary"
              as="button"
              size="xs"
              className="text-gray-300 font-normal self-center"
            >
              Reset
            </Button>
            <Button
              variant="primary"
              as="button"
              size="md"
              className="col-span-3 rounded"
            >
              Place buy order
            </Button>
          </div>
        </aside>
        <section className="col-span-5 rounded border border-gold-800">
          <PortfolioTable
            openPositions={{
              hideCols: ["unsettled-interest", "next-payment", "paid-interest"],
            }}
          />
        </section>
      </section>
    </>
  );
};

export default Trade;
