import { Combobox } from "@headlessui/react";
import clsx from "clsx";
import { FC, useCallback, useMemo, useState } from "react";
import tw from "tailwind-styled-components";

import {
  AsyncImage,
  Button,
  Modal,
  PencilIcon,
  SearchInput,
  Select,
  SortUnderterminedIcon,
} from "../../components";

const NO_OP = () => {
  //
};

const ListContainer = tw.ul`
  grid gap-2 max-h-64 overflow-y-scroll -mx-3 no-scrollbar
`;

export type TokenEntry = {
  name: string;
  symbol: string;
  displaySymbol: string;
  decimals: number;
  network: string;
  homeNetwork?: string;
  label?: string;
  imageUrl?: string;
  hasDarkIcon?: boolean;
  balance?: string;
};

export type TokenSelectorProps = {
  label: string;
  modalTitle: string;
  tokens: TokenEntry[];
  renderTokenItem?: FC<TokenItemProps>;
};

type SortKeys = keyof TokenEntry;

const SORT_KEYS: SortKeys[] = ["name", "balance"];

export const TokenSelector: FC<TokenSelectorProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenEntry | undefined>(
    props.tokens[0],
  );
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKeys>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sanitizedQuery = query.toLowerCase().trim();

  const sorted = useMemo(() => {
    return props.tokens.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (sortKey === "balance") {
        return sortOrder === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      return sortOrder === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [props.tokens, sortKey, sortOrder]);

  const filtered = useMemo(() => {
    return sanitizedQuery.length
      ? sorted.filter(
          (token) =>
            token.name.toLowerCase().includes(sanitizedQuery) ||
            token.symbol.toLowerCase().includes(sanitizedQuery) ||
            token.displaySymbol.toLowerCase().includes(sanitizedQuery),
        )
      : sorted;
  }, [sorted, sanitizedQuery]);

  const handleSortClick = useCallback(
    (key: SortKeys) => {
      if (sortKey === key) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortKey(key);
        setSortOrder("asc");
      }
    },
    [sortOrder],
  );

  return (
    <>
      <Select
        label={props.label}
        options={[]}
        onChange={NO_OP}
        onClick={() => setIsOpen(true)}
      />
      <Modal
        title={props.modalTitle}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Combobox value={selectedToken} onChange={setSelectedToken}>
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <Combobox.Input
                as={SearchInput}
                fullWidth
                placeholder="0x0000"
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(token: TokenEntry) =>
                  token.displaySymbol || token.symbol
                }
              />
              <Button variant="secondary" className="h-11 w-11 !p-0">
                <PencilIcon className="text-lg" />
              </Button>
            </div>
            <div className="flex items-center py-1 px-4 justify-between transition-colors">
              {SORT_KEYS.map((key) => (
                <button
                  key={key}
                  className="uppercase text-gray-300 flex gap-2 items-center"
                  onClick={handleSortClick.bind(null, key)}
                >
                  {key} <SortUnderterminedIcon />
                </button>
              ))}
            </div>

            <Combobox.Options as={ListContainer} static>
              {filtered.map((token) => {
                const ItemComponent = props.renderTokenItem ?? TokenItem;

                return (
                  <Combobox.Option key={token.symbol} value={token}>
                    {({ selected, active }) => (
                      <ItemComponent
                        {...token}
                        balance="0.00"
                        selected={selected}
                        active={active}
                      />
                    )}
                  </Combobox.Option>
                );
              })}
            </Combobox.Options>
          </div>
        </Combobox>
      </Modal>
    </>
  );
};

export type TokenItemProps = Pick<
  TokenEntry,
  "name" | "symbol" | "displaySymbol" | "imageUrl" | "hasDarkIcon"
> & {
  balance: string;
  selected: boolean;
  active: boolean;
};

export const TokenItem: FC<TokenItemProps> = (props) => {
  return (
    <div
      role="button"
      className={clsx("flex items-center py-1 px-8 gap-4 transition-colors", {
        "bg-gray-600": props.active || props.selected,
      })}
    >
      <figure
        className={clsx(
          "h-7 w-7 rounded-full grid place-items-center overflow-hidden bg-black ring-4 ring-black/60",
          {
            "!bg-white": props.hasDarkIcon,
          },
        )}
      >
        <AsyncImage src={props.imageUrl} />
      </figure>
      <div className="grid flex-1">
        <span className="text-white text-base font-semibold uppercase">
          {props.displaySymbol}
        </span>
        <span className="text-gray-300 text-sm font-normal">{props.name}</span>
      </div>
      <div>
        {Boolean(props.balance) && (
          <span className="text-white font-semibold text-sm">
            {props.balance}
          </span>
        )}
      </div>
    </div>
  );
};
