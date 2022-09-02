import type {
  MarginOpenPositionsData,
  useMarginOpenPositionsBySymbolQuery,
  useOpenPositionsQuery,
} from "~/domains/margin/hooks";

import {
  Button,
  ChevronDownIcon,
  FlashMessage5xxError,
  FlashMessageConnectSifChainWallet,
  FlashMessageConnectSifChainWalletError,
  FlashMessageConnectSifChainWalletLoading,
  FlashMessageLoading,
  formatNumberAsDecimal,
  Tooltip,
} from "@sifchain/ui";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { isNil } from "rambda";
import { useCallback, useState } from "react";

import AssetIcon from "~/compounds/AssetIcon";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import { useSifSignerAddressQuery } from "~/hooks/useSifSigner";
import { ModalMTPClose } from "./ModalMTPClose";

/**
 * ********************************************************************************************
 *
 * `_components`: "Dumb Components" used across Margin. They will be moved to a different place.
 * `_mockdata`: To mock React-Query and fake the Data Services reponses
 * `_intl`: Functions to format data used across Margin. They will be moved to a different place.
 * `_tables`: Constant values, functions to abstract logic, and pagination utilities used across Open Positions and History tables. They will be moved to a different place.
 *
 * ********************************************************************************************
 */

import { NoResultsRow, PaginationButtons, PaginationShowItems, PillUpdating } from "./_components";
import { createDurationLabel, formatDateISO, formatIntervalToDuration } from "./_intl";
import { findNextOrderAndSortBy, SORT_BY } from "./_tables";
import { HtmlUnicode, removeFirstCharsUC } from "./_trade";
import { TooltipInterestPaid, TooltipLiquidationRatio, TooltipNpv } from "./tooltips";

const isTruthy = (target: any) => !isNil(target);

/**
 * ********************************************************************************************
 *
 * OpenPositionsTable Compound
 *
 * ********************************************************************************************
 */
const HEADERS_TITLES = {
  DATE_OPENED: "Date Opened",
  POOL: "Pool",
  SIDE: "Side",
  POSITION: "Position",
  ASSET: "Asset",
  LEVERAGE: "Leverage",
  NPV: "NPV",
  INTEREST_RATE: "Interest Rate",
  PAID_INTEREST: "Paid Interest",
  LIQUIDATION_RATIO: "LR",
  DURATION: "Duration",
  CLOSE_POSITION: "Close Position",
} as const;
const OPEN_POSITIONS_HEADER_ITEMS = [
  { title: HEADERS_TITLES.DATE_OPENED, order_by: "date_opened" },
  { title: HEADERS_TITLES.POOL, order_by: "" },
  { title: HEADERS_TITLES.SIDE, order_by: "position" },
  { title: HEADERS_TITLES.POSITION, order_by: "custody_amount" },
  { title: HEADERS_TITLES.ASSET, order_by: "custody_asset" },
  { title: HEADERS_TITLES.LEVERAGE, order_by: "leverage" },
  { title: HEADERS_TITLES.NPV, order_by: "" },
  { title: HEADERS_TITLES.INTEREST_RATE, order_by: "interest_rate" },
  { title: HEADERS_TITLES.PAID_INTEREST, order_by: "interest_paid_custody" },
  { title: HEADERS_TITLES.LIQUIDATION_RATIO, order_by: "health" },
  { title: HEADERS_TITLES.DURATION, order_by: "" },
  { title: HEADERS_TITLES.CLOSE_POSITION, order_by: "" },
];

const RIGHT_ALIGNED_COLS = new Set<string>([
  HEADERS_TITLES.POSITION,
  HEADERS_TITLES.LEVERAGE,
  HEADERS_TITLES.NPV,
  HEADERS_TITLES.INTEREST_RATE,
  HEADERS_TITLES.PAID_INTEREST,
  HEADERS_TITLES.LIQUIDATION_RATIO,
]);

type HideColsUnion = typeof HEADERS_TITLES[keyof typeof HEADERS_TITLES];
export type OpenPositionsTableProps = {
  openPositionsQuery: ReturnType<typeof useOpenPositionsQuery> | ReturnType<typeof useMarginOpenPositionsBySymbolQuery>;
  classNamePaginationContainer?: string;
  hideColumns?: HideColsUnion[];
};
const OpenPositionsTable = (props: OpenPositionsTableProps) => {
  const router = useRouter();
  const tokenRegistryQuery = useTokenRegistryQuery();
  const walletAddressQuery = useSifSignerAddressQuery();
  const { openPositionsQuery } = props;

  const { hideColumns, classNamePaginationContainer } = props;
  const headers = OPEN_POSITIONS_HEADER_ITEMS;

  const [positionToClose, setPositionToClose] = useState<{
    isOpen: boolean;
    value: MarginOpenPositionsData | null;
  }>({
    isOpen: false,
    value: null,
  });

  const onClose = useCallback(() => {
    if (positionToClose.isOpen) {
      setPositionToClose((prev) => ({ ...prev, isOpen: false }));
    }
  }, [positionToClose.isOpen]);
  const onMutationSuccess = useCallback(() => {
    setPositionToClose({ isOpen: false, value: null });
  }, []);
  const onTransitionEnd = useCallback(() => {
    if (positionToClose.value !== null) {
      setPositionToClose((prev) => ({ ...prev, value: null }));
    }
  }, [positionToClose.value]);

  if (walletAddressQuery.fetchStatus === "idle" && walletAddressQuery.isLoading) {
    return <FlashMessageConnectSifChainWallet size="full-page" />;
  }

  if (walletAddressQuery.fetchStatus === "idle" && walletAddressQuery.isError) {
    return <FlashMessageConnectSifChainWalletError size="full-page" />;
  }

  if (walletAddressQuery.isFetching && walletAddressQuery.isLoading) {
    return <FlashMessageConnectSifChainWalletLoading size="full-page" />;
  }

  if (openPositionsQuery.isLoading || tokenRegistryQuery.isLoading) {
    return <FlashMessageLoading size="full-page" />;
  }

  if (openPositionsQuery.isSuccess && tokenRegistryQuery.isSuccess && walletAddressQuery.isSuccess) {
    const { findBySymbolOrDenom } = tokenRegistryQuery;
    const { results, pagination } = openPositionsQuery.data;
    const pages = Math.ceil(Number(pagination.total) / Number(pagination.limit));

    return (
      <section className="bg-gray-850 flex h-full flex-col">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full table-auto overflow-scroll whitespace-nowrap text-left text-xs">
            <thead className="bg-gray-800">
              <tr className="text-gray-400">
                {headers.map((header) => {
                  if (hideColumns?.includes(header.title)) {
                    return null;
                  }

                  if (header.title === HEADERS_TITLES.CLOSE_POSITION) {
                    return <th key={header.title} />;
                  }

                  const isRightAligned = RIGHT_ALIGNED_COLS.has(header.title);

                  if (header.order_by === "") {
                    return (
                      <th
                        key={header.title}
                        className={clsx("flex flex-row items-center px-4 py-3 font-normal", {
                          "justify-end": isRightAligned,
                        })}
                      >
                        <span className="cursor-not-allowed">{header.title}</span>
                        {header.title === HEADERS_TITLES.NPV ? (
                          <>
                            <div className="mr-1" />
                            <TooltipNpv />
                          </>
                        ) : null}
                      </th>
                    );
                  }

                  const itemActive = pagination.order_by === header.order_by;
                  const { nextOrderBy, nextSortBy } = findNextOrderAndSortBy({
                    itemKey: header.order_by,
                    itemActive,
                    currentSortBy: pagination.sort_by,
                  });
                  const linkTagA = (
                    <a className="flex flex-row items-center">
                      {header.title}
                      {itemActive && (
                        <ChevronDownIcon
                          className={clsx("ml-1 transition-transform", {
                            "-rotate-180": pagination.sort_by === SORT_BY.ASC,
                          })}
                        />
                      )}
                    </a>
                  );
                  const linkNextEl = (
                    <Link
                      href={{
                        query: {
                          ...router.query,
                          orderBy: nextOrderBy,
                          sortBy: nextSortBy,
                        },
                      }}
                      scroll={false}
                    >
                      {linkTagA}
                    </Link>
                  );
                  return (
                    <th key={header.title} className="px-4 py-3 font-normal">
                      <div
                        className={clsx("flex flex-row items-center", {
                          "font-semibold text-white": itemActive,
                          "justify-end": isRightAligned,
                        })}
                      >
                        {linkNextEl}
                        {header.title === HEADERS_TITLES.LIQUIDATION_RATIO ? (
                          <>
                            <div className="mr-1" />
                            <TooltipLiquidationRatio />
                          </>
                        ) : null}
                        {header.title === HEADERS_TITLES.PAID_INTEREST ? (
                          <>
                            <div className="mr-1" />
                            <TooltipInterestPaid />
                          </>
                        ) : null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-gray-850">
              {results.length <= 0 && <NoResultsRow colSpan={headers.length} />}
              {results.map((x) => {
                const item = x as MarginOpenPositionsData;

                let custodyAsset;
                let collateralAsset;
                try {
                  custodyAsset = findBySymbolOrDenom(item.custody_asset);
                  collateralAsset = findBySymbolOrDenom(item.collateral_asset);
                } catch (err) {}

                if (!custodyAsset || !collateralAsset) {
                  console.group("Open Positions Missing Custody or Collateral Asset Error");
                  console.log({ item: x });
                  console.groupEnd();
                  return (
                    <tr>
                      {Array.from({ length: headers.length }, () => {
                        return (
                          <td className="px-4 py-3">
                            <HtmlUnicode name="EmDash" />
                          </td>
                        );
                      })}
                    </tr>
                  );
                }

                const custodyAmount = Number(item.custody_amount ?? "0");
                const currentInterestPaidCustody = Number(item.current_interest_paid_custody ?? "0");

                const unrealizedPnl = Number(item.unrealized_pnl ?? "0");
                const unrealizedPLSign = Math.sign(unrealizedPnl);

                return (
                  <tr
                    key={item.id}
                    data-testid={item.id}
                    className={clsx({
                      "italic text-gray-300": item._optimistic,
                    })}
                  >
                    <td className="px-4 py-3">
                      {isTruthy(item.date_opened) ? (
                        formatDateISO(new Date(item.date_opened))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    {hideColumns?.includes(HEADERS_TITLES.POOL) ? null : (
                      <td className="px-4 py-3">
                        {isTruthy(item.pool) ? (
                          removeFirstCharsUC(item.pool).toUpperCase()
                        ) : (
                          <HtmlUnicode name="EmDash" />
                        )}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      {isTruthy(item.position) ? item.position : <HtmlUnicode name="EmDash" />}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {isTruthy(item.custody_amount) ? (
                        formatNumberAsDecimal(custodyAmount, 4)
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.custody_asset) ? (
                        removeFirstCharsUC(item.custody_asset.toUpperCase())
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {isTruthy(item.leverage) ? (
                        `${formatNumberAsDecimal(Number(item.leverage))}x`
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.unrealized_pnl) && Number.isNaN(unrealizedPnl) === false ? (
                        <div
                          className={clsx("flex flex-row items-center justify-end tabular-nums", {
                            "text-green-400": unrealizedPLSign === 1 && unrealizedPnl > 0,
                            "text-red-400": unrealizedPLSign === -1 && unrealizedPnl < 0,
                          })}
                        >
                          <AssetIcon symbol={item.collateral_asset} network="sifchain" size="sm" />
                          <span className="ml-1">
                            {formatNumberAsDecimal(unrealizedPnl, 6) ?? <HtmlUnicode name="EmDash" />}
                          </span>
                        </div>
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    {hideColumns?.includes(HEADERS_TITLES.INTEREST_RATE) ? null : (
                      <td className="px-4 py-3 text-right tabular-nums">
                        {isTruthy(item.interest_rate) ? (
                          `${formatNumberAsDecimal(Number(item.interest_rate), 8)}%`
                        ) : (
                          <HtmlUnicode name="EmDash" />
                        )}
                      </td>
                    )}
                    {hideColumns?.includes(HEADERS_TITLES.PAID_INTEREST) ? null : (
                      <td className="px-4 py-3">
                        {isTruthy(currentInterestPaidCustody) ? (
                          <div className="flex flex-row items-center justify-end tabular-nums">
                            <AssetIcon symbol={item.custody_asset} network="sifchain" size="sm" />
                            <span className="ml-1">
                              {formatNumberAsDecimal(currentInterestPaidCustody, 6) ?? <HtmlUnicode name="EmDash" />}
                            </span>
                          </div>
                        ) : (
                          <HtmlUnicode name="EmDash" />
                        )}
                      </td>
                    )}
                    <td className="px-4 py-3 text-right tabular-nums">
                      {isTruthy(item.current_health) ? (
                        formatNumberAsDecimal(Number(item.current_health))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.date_opened) ? (
                        createDurationLabel(formatIntervalToDuration(new Date(item.date_opened), new Date()))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4">
                      {isTruthy(item._optimistic) ? null : (
                        <Button
                          variant="secondary"
                          as="button"
                          size="xs"
                          className="rounded font-normal"
                          onClick={() =>
                            setPositionToClose({
                              isOpen: true,
                              value: item,
                            })
                          }
                        >
                          Close
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div
          className={clsx(
            "mt-auto flex flex-col items-center justify-end bg-gray-800 p-2 md:flex-row",
            classNamePaginationContainer,
          )}
        >
          {openPositionsQuery.isRefetching && <PillUpdating />}
          <PaginationShowItems
            limit={Number(pagination.limit)}
            offset={Number(pagination.offset)}
            total={Number(pagination.total)}
          />
          <PaginationButtons
            pages={pages}
            render={(page) => {
              const offset = String(Number(pagination.limit) * page - Number(pagination.limit));
              return (
                <Link href={{ query: { ...router.query, offset } }} scroll={false}>
                  <a
                    className={clsx("inline-grid h-[20px] w-[20px] place-items-center rounded", {
                      "bg-gray-400": pagination.offset === offset,
                    })}
                  >
                    {page}
                  </a>
                </Link>
              );
            }}
          />
        </div>
        {positionToClose.value && (
          <ModalMTPClose
            data={positionToClose.value}
            isOpen={positionToClose.isOpen}
            onClose={onClose}
            onMutationSuccess={onMutationSuccess}
            onTransitionEnd={onTransitionEnd}
          />
        )}
      </section>
    );
  }

  console.group("Open Positions Query Error");
  console.log({ openPositionsQuery, tokenRegistryQuery });
  console.groupEnd();
  return <FlashMessage5xxError size="full-page" />;
};

export default OpenPositionsTable;
