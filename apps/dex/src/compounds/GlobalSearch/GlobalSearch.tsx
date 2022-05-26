import React, { type FC, useCallback, useMemo, useState } from "react";
import { CommandPalette, CommandPaletteEntry } from "@sifchain/ui";

import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import AssetIcon from "~/compounds/AssetIcon";

type Props = {};

const GlobalSearch: FC<Props> = (_props) => {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState("");

  const { data: assets } = useTokenRegistryQuery();

  const handleChange = useCallback((value: string) => {
    setValue(value);

    // ...
  }, []);

  const entries = useMemo<CommandPaletteEntry[]>(() => {
    if (!assets) {
      return [];
    }
    return assets.map((asset) => {
      return {
        id: asset.symbol,
        label: `${asset.name}  (${(
          asset.displaySymbol ?? asset.symbol
        ).toUpperCase()})`,
        icon: (
          <AssetIcon
            symbol={asset.symbol}
            network="sifchain"
            size="sm"
            invertColor={asset.hasDarkIcon}
          />
        ),
      };
    });
  }, [assets]);

  return (
    <CommandPalette
      query={query}
      entries={entries}
      quickActions={[]}
      onQueryChange={setQuery}
      categories={[]}
      storageKey="@sifchain/recent-entries"
      className="max-w-2xl w-full mx-auto"
      value={value}
      onChange={handleChange}
    />
  );
};

export default GlobalSearch;
