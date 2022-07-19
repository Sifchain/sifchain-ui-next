import { AsyncImage, SearchInput, SurfaceA } from "@sifchain/ui";
import clsx from "clsx";
import ky from "ky";
import React, { FC } from "react";
import { useQuery } from "react-query";
import type { AssetConfig } from "~/types";

type AssetsQueryOptions = {
  network: "ethereum" | "sifchain" | "cosmoshub";
  env: "devnet" | "mainnet" | "testnet";
};

function useAssetsQuery({ network, env }: AssetsQueryOptions) {
  const query = useQuery(["assets", network, env], () =>
    ky.get(`/api/assets/${network}/${env}`).json<AssetConfig[]>(),
  );

  return query;
}

const Assets = () => {
  const [search, setSearch] = React.useState("");

  return (
    <div className="grid gap-8">
      <div>
        <SearchInput
          placeholder="ROWAN"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <AssetsSection
        search={search}
        title="Sifchain Assets"
        network="sifchain"
        env="mainnet"
      />
      <AssetsSection
        search={search}
        title="Ethereum Assets"
        network="ethereum"
        env="mainnet"
      />
    </div>
  );
};

const AssetsSection: FC<
  { title: string; search: string } & AssetsQueryOptions
> = (props) => {
  const { data: assets } = useAssetsQuery({
    network: props.network,
    env: props.env,
  });
  return (
    <section className="grid gap-4">
      <header className="flex items-center justify-between">
        <h2 className="text-xl">{props.title}</h2>
      </header>
      <ul className="grid gap-2 md:grid-cols-2 xl:grid-cols-3 6xl:grid-cols-4">
        {assets
          ?.filter((asset) =>
            asset.name.toLowerCase().includes(props.search.toLowerCase()),
          )
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((asset) => (
            <li key={asset.symbol}>
              <SurfaceA className="min-h-[120px] grid">
                <div className="flex items-center gap-2">
                  {asset.imageUrl && (
                    <figure
                      className={clsx(
                        "h-8 w-8 ring-2 ring-gray-750 rounded-full overflow-hidden",
                        asset.hasDarkIcon ? "bg-gray-500" : "bg-gray-200",
                      )}
                    >
                      <AsyncImage
                        alt={`${asset.name} logo`}
                        className={clsx(
                          "p-0.5 rounded-full overflow-hidden h-8 w-8",
                          {
                            "invert ring-blue-300": asset.hasDarkIcon,
                          },
                        )}
                        src={asset.imageUrl}
                      />
                    </figure>
                  )}
                  {asset.name} ({asset.symbol.toUpperCase()})
                </div>
                {asset.address && (
                  <div className="text-xs text-gray-300">
                    {asset.address.toUpperCase()}
                  </div>
                )}
              </SurfaceA>
            </li>
          ))}
      </ul>
    </section>
  );
};

export default Assets;
