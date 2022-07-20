import { AsyncImage, SearchInput, useCopyToClipboard } from "@sifchain/ui";
import clsx from "clsx";
import React, { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { CheckIcon, DuplicateIcon } from "@heroicons/react/outline";

import type { AssetConfig } from "~/types";
import { CardsGrid, GridCard } from "~/components/core";

type AssetsQueryOptions = {
  network: "ethereum" | "sifchain" | "cosmoshub";
  env: "devnet" | "mainnet" | "testnet";
};

function useAssetsQuery({ network, env }: AssetsQueryOptions) {
  const query = useQuery(["assets", network, env], async () => {
    const { default: assetsFile } = await import(
      `~/../public/config/networks/${network}/assets.${network}.${env}.json`
    );

    return assetsFile.assets as AssetConfig[];
  });

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

  const [copied, _copy] = useCopyToClipboard();
  const [copiedConfirmed, setCopiedConfirmed] = useState(false);

  const copy = (address: string) => {
    _copy(address);
    setCopiedConfirmed(true);
  };

  useEffect(() => {
    if (copiedConfirmed) {
      setTimeout(() => setCopiedConfirmed(false), 2000);
    }
  }, [copiedConfirmed]);

  return (
    <section className="grid gap-4">
      <header className="flex items-center justify-between">
        <h2 className="text-xl">{props.title}</h2>{" "}
        {assets && <div>{assets.length} assets</div>}
      </header>
      <CardsGrid>
        {assets
          ?.filter((asset) =>
            asset.name.toLowerCase().includes(props.search.toLowerCase()),
          )
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((asset) => (
            <li key={asset.symbol}>
              <GridCard>
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
                  <button
                    className="text-xs text-gray-300 flex gap-1 items-center"
                    onClick={copy.bind(null, asset.address)}
                  >
                    {copied === asset.address && copiedConfirmed ? (
                      <>
                        token address copied <CheckIcon className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        {asset.address} <DuplicateIcon className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
                <div>
                  <div>network: {asset.network}</div>
                  <div>home network: {asset.homeNetwork}</div>
                </div>
              </GridCard>
            </li>
          ))}
      </CardsGrid>
    </section>
  );
};

export default Assets;
