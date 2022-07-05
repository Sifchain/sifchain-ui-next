import { Combobox } from "@headlessui/react";
import clsx from "clsx";
import { FC, useEffect, useMemo, useState } from "react";
import tw from "tailwind-styled-components";

import { useSortedArray } from "../../hooks";
import {
  AsyncImage,
  Button,
  ChevronDownIcon,
  Modal,
  PencilIcon,
  SearchInput,
  SortIcon,
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

const AssetIcon: FC<{ imageUrl: string; hasDarkIcon?: boolean }> = (props) => (
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
);

export type TokenSelectorProps = {
  label: string;
  modalTitle: string;
  tokens: TokenEntry[];
  renderTokenItem?: FC<TokenItemProps>;
  value?: TokenEntry;
  onChange?: (token: TokenEntry) => void;
};

type SortKeys = keyof TokenEntry;

const SORT_KEYS: SortKeys[] = ["name", "balance"];

export const TokenSelector: FC<TokenSelectorProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenEntry | undefined>(
    props.value ?? props.tokens[0],
  );
  const [query, setQuery] = useState("");
  const { sorted, sort, sortKey, sortDirection } = useSortedArray(
    props.tokens,
    "name",
  );

  const sanitizedQuery = query.toLowerCase().trim();

  const filtered = useMemo(() => {
    return !sanitizedQuery.length
      ? sorted
      : sorted.filter(
          (token) =>
            token.name.toLowerCase().includes(sanitizedQuery) ||
            token.symbol.toLowerCase().includes(sanitizedQuery) ||
            token.displaySymbol.toLowerCase().includes(sanitizedQuery),
        );
  }, [sorted, sanitizedQuery]);

  useEffect(() => {
    if (!selectedToken) return;
    if (props.onChange && selectedToken?.symbol !== props.value?.symbol) {
      props.onChange(selectedToken);
    }
  }, [selectedToken]);

  return (
    <>
      <button
        className="input flex flex-1 items-center gap-4"
        onClick={setIsOpen.bind(null, true)}
      >
        {selectedToken && (
          <>
            <AssetIcon
              imageUrl={selectedToken.imageUrl ?? ""}
              hasDarkIcon={Boolean(selectedToken.hasDarkIcon)}
            />
            <span className="uppercase text-white">
              {selectedToken.displaySymbol}
            </span>
          </>
        )}
        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
      </button>
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
                  onClick={sort.bind(null, key)}
                >
                  {key}{" "}
                  <SortIcon
                    active={key === sortKey}
                    sortDirection={sortDirection}
                  />
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
      <AssetIcon
        imageUrl={props.imageUrl ?? ""}
        hasDarkIcon={Boolean(props.hasDarkIcon)}
      />

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
