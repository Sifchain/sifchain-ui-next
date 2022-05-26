import {
  CommandPalette,
  CommandPaletteEntry,
  useRecentEntries,
} from "@sifchain/ui";
import { indexBy, prop } from "rambda";
import React, { useCallback, useMemo, useState, type FC } from "react";

import AssetIcon from "~/compounds/AssetIcon";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";

type Props = {};

const GlobalSearch: FC<Props> = (_props) => {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState("");

  const { data: assets } = useTokenRegistryQuery();

  const [recentEntries, addRecentEntry] = useRecentEntries([], {
    adapter: "localStorage",
    key: "global-search",
  });

  const { entries, indexedById } = useMemo(() => {
    if (!assets) {
      return {
        entries: [],
        indexedById: {},
      };
    }
    const entries = assets.map(
      (asset): CommandPaletteEntry => ({
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
      }),
    );

    return {
      entries,
      indexedById: indexBy(prop("id"), entries),
    };
  }, [assets]);

  const handleChange = useCallback(
    (selectedId: string) => {
      setValue(selectedId);
      const selected = indexedById[selectedId];

      if (selected) {
        addRecentEntry(selected);
      }
    },
    [entries],
  );

  return (
    <CommandPalette
      query={query}
      entries={entries}
      quickActions={[]}
      recentEntrires={recentEntries}
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
