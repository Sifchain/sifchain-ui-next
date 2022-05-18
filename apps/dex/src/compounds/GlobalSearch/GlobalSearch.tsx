import React, { FC, useCallback, useState } from "react";
import { CommandPalette } from "@sifchain/ui";
type Props = {};

const GlobalSearch: FC<Props> = (props) => {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState("");

  const handleChange = useCallback((value: string) => {
    setValue(value);
  }, []);

  return (
    <CommandPalette
      query={query}
      entries={[]}
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
