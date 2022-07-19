import { Button, ChevronDownIcon, PoolsIcon, SearchInput } from "@sifchain/ui";
import type { NextPage } from "next";
import AssetIcon from "~/compounds/AssetIcon";
import useSifApiQuery from "~/hooks/useSifApiQuery";

const Pools: NextPage = () => {
  const { data } = useSifApiQuery("assets.getTokenStats", []);

  return (
    <section className="flex-1 w-full bg-black p-6 md:py-12 md:px-24">
      <header className="mb-10 md:mb-12">
        <div className="flex items-center justify-between pb-6 md:pb-8">
          <h2 className="text-2xl font-bold text-white">Pools</h2>
          <SearchInput placeholder="Search token" />
        </div>
        <div className="flex flex-col gap-4">
          {data?.pools?.map((x, index) => (
            <details
              key={index}
              className="border-2 border-stone-800 rounded-md overflow-hidden [&[open]_.marker]:rotate-180"
            >
              <summary className="flex flex-col p-3 bg-gray-800">
                <header className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center [&>*:first-child]:-mr-4">
                      <AssetIcon network="sifchain" symbol="rowan" size="md" />
                      <AssetIcon
                        network="sifchain"
                        symbol={x.symbol ?? ""}
                        size="md"
                      />
                    </div>
                    <span className="font-bold">{x.symbol?.toUpperCase()}</span>
                  </div>
                  <button className="marker pointer-events-none">
                    <ChevronDownIcon />
                  </button>
                </header>
                <dl className="grid auto-cols-auto gap-y-1 [&>dt]:col-start-1 [&>dd]:col-start-2 [&>dd]:font-semibold [&>dd]:text-right">
                  <dt>My pool value</dt>
                  <dd>
                    {x.poolBalance?.toLocaleString(undefined, {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 2,
                    })}
                  </dd>
                  <dt>My pool share</dt>
                  <dd>
                    {x.poolBalance &&
                      x.poolTVL &&
                      (x.poolBalance / x.poolTVL).toLocaleString(undefined, {
                        style: "percent",
                        maximumFractionDigits: 2,
                      })}
                  </dd>
                </dl>
              </summary>
              <div className="p-3">
                <dl className="grid auto-cols-auto gap-y-1 [&>dt]:col-start-1 [&>dd]:col-start-2 [&>dt]:text-gray-300 [&>dd]:font-semibold [&>dd]:text-right">
                  <dt>TVL</dt>
                  <dd>
                    {x.poolTVL?.toLocaleString(undefined, {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 2,
                    })}
                  </dd>
                  <dt>APR</dt>
                  <dd>
                    {x.poolApr?.toLocaleString(undefined, {
                      style: "percent",
                    })}
                  </dd>
                  <dt>24hr trading volume</dt>
                  <dd>
                    {x.volume?.toLocaleString(undefined, {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 2,
                    })}
                  </dd>
                  <dt>Arb opportunity</dt>
                  <dd className="error-">
                    {x.arb &&
                      (x.arb / 100).toLocaleString(undefined, {
                        style: "percent",
                        maximumFractionDigits: 2,
                      })}
                  </dd>
                </dl>
                <Button className="mt-2 w-full" variant="secondary">
                  <PoolsIcon /> Pool
                </Button>
              </div>
            </details>
          ))}
        </div>
      </header>
    </section>
  );
};

export default Pools;
