import { Combobox } from "@headlessui/react";
import clsx from "clsx";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import tw from "tailwind-styled-components";

import {
  AsyncImage,
  Button,
  ChevronDownIcon,
  LockIcon,
  Modal,
  PencilIcon,
  RacetrackSpinnerIcon,
  SearchInput,
  SortIcon,
} from "../../components";
import { SortOptions, useSortedArray } from "../../hooks";
import { TokenItem, TokenItemProps } from "./TokenItem";
import type { TokenEntry } from "./types";

const ListContainer = tw.ul`
  grid gap-2 max-h-64 overflow-y-scroll -mx-3 no-scrollbar
`;

const AssetIcon: FC<{
  imageUrl: string;
  hasDarkIcon?: boolean;
  size: TokenSelectorProps["size"];
}> = (props) => (
  <figure
    className={clsx(
      props.size === "xs" ? "h-4 w-4" : "h-6 w-6",
      "rounded-full grid place-items-center overflow-hidden bg-black ring-4 ring-black/60",
      {
        "!bg-white": props.hasDarkIcon,
      },
    )}
  >
    {props.imageUrl ? (
      <AsyncImage src={props.imageUrl} />
    ) : (
      <RacetrackSpinnerIcon
        className={clsx(props.size === "xs" ? "h-4 w-4" : "h-6 w-6")}
      />
    )}
  </figure>
);

export type TokenSelectorProps = {
  label?: string;
  modalTitle: string;
  tokens: TokenEntry[];
  renderTokenItem?: FC<TokenItemProps>;
  value?: TokenEntry | undefined;
  onChange?: (token: TokenEntry) => void;
  size?: "xs";
  buttonClassName?: string;
  readonly?: boolean;
  inline?: boolean;
  textPlaceholder?: string;
  hideColumns?: string[];
};

type SortKeys = keyof TokenEntry;

const SORT_KEYS: SortOptions<TokenEntry>[] = [
  {
    sortKey: "name",
    sortAs: "string",
    sortDirection: "asc",
  },
  {
    sortKey: "balance",
    sortAs: "number",
    sortDirection: "desc",
  },
];

export const TokenSelector: FC<TokenSelectorProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedToken, _setSelectedToken] = useState<TokenEntry | undefined>(
    props.value ?? props.tokens[0],
  );
  const [query, setQuery] = useState("");
  const { sorted, sort, sortKey, sortDirection } = useSortedArray(
    props.tokens,
    {
      sortKey: "balance",
      sortAs: "number",
      sortDirection: "desc",
    },
  );

  const setSelectedToken = useCallback((token: TokenEntry | undefined) => {
    _setSelectedToken(token);
    if (token !== undefined) {
      props.onChange?.(token);
    }
  }, []);

  useEffect(() => {
    if (props.value) {
      _setSelectedToken(props.value);
    }
  }, [props.value]);

  const sanitizedQuery = query.toLowerCase().trim();

  const filtered = useMemo(() => {
    return !sanitizedQuery.length
      ? sorted
      : sorted.filter((token) =>
          [token.name, token.symbol, token.displaySymbol].some((value) =>
            value.toLowerCase().includes(sanitizedQuery),
          ),
        );
  }, [sorted, sanitizedQuery]);

  return (
    <>
      <div
        className={clsx(
          "relative gap-1",
          props.inline ? "inline-grid" : "grid",
          {
            "text-xs": props.size === "xs",
          },
        )}
      >
        {props.label && <span className="input-label">{props.label}</span>}
        <button
          className={clsx(
            "h-12 bg-gray-700 text-lg font-semibold rounded flex items-center px-2.5 gap-2.5 overflow-hidden",
            props.buttonClassName,
          )}
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
          disabled={props.readonly}
        >
          {selectedToken ? (
            <>
              <AssetIcon
                imageUrl={selectedToken.imageUrl ?? ""}
                hasDarkIcon={Boolean(selectedToken.hasDarkIcon)}
                size={props.size}
              />
              <span className="uppercase block text-white overflow-hidden text-ellipsis whitespace-nowrap">
                {selectedToken.displaySymbol}
              </span>
            </>
          ) : (
            <>
              <AssetIcon imageUrl="" size={props.size} />
              <span className="uppercase text-white">...</span>
            </>
          )}
          {props.readonly ? (
            <LockIcon
              className={clsx(
                "ml-auto text-white",
                props.size === "xs" ? "h-3 w-3" : "h-4 w-4",
              )}
            />
          ) : (
            <ChevronDownIcon
              className={clsx(
                "ml-auto text-gray-400",
                props.size === "xs" ? "h-3 w-3" : "h-4 w-4",
              )}
            />
          )}
        </button>
      </div>
      <Modal
        title={props.modalTitle}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Combobox
          value={selectedToken}
          onChange={(token) => {
            setSelectedToken(token);
            setQuery("");
            setIsOpen(false);
          }}
        >
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <Combobox.Input
                as={SearchInput}
                fullWidth
                placeholder={props.textPlaceholder}
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(token: TokenEntry) =>
                  sanitizedQuery || token.displaySymbol || token.symbol
                }
              />
              <Button variant="secondary" className="h-11 w-11 !p-0 hidden">
                <PencilIcon className="text-lg" />
              </Button>
            </div>
            <div className="flex items-center py-1 px-4 justify-between transition-colors">
              {SORT_KEYS.map((options) =>
                props.hideColumns?.includes(options.sortKey) ? null : (
                  <button
                    key={options.sortKey}
                    className="uppercase text-gray-300 flex gap-2 items-center"
                    onClick={sort.bind(null, options)}
                  >
                    {options.sortKey}{" "}
                    <SortIcon
                      active={options.sortKey === sortKey}
                      sortDirection={sortDirection}
                    />
                  </button>
                ),
              )}
            </div>

            <Combobox.Options as={ListContainer} static>
              {filtered.length === 0 ? (
                <p className="text-center p-4">No matching results.</p>
              ) : (
                filtered.map((token) => {
                  const ItemComponent = props.renderTokenItem ?? TokenItem;

                  return (
                    <Combobox.Option
                      key={`${token.symbol}-${
                        token.homeNetwork ?? token.network
                      }`}
                      value={token}
                    >
                      {({ selected, active }) => (
                        <ItemComponent
                          {...token}
                          selected={selected}
                          active={active}
                        />
                      )}
                    </Combobox.Option>
                  );
                })
              )}
            </Combobox.Options>
          </div>
        </Combobox>
      </Modal>
    </>
  );
};
TokenSelector.defaultProps = {
  textPlaceholder: "0x0000",
};
