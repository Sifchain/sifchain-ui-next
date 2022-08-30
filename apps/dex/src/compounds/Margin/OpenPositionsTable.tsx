import type {
  useOpenPositionsQuery,
  useMarginOpenPositionsBySymbolQuery,
  OpenPositionsQueryData,
} from "~/domains/margin/hooks";

import {
  FlashMessageLoading,
  FlashMessage5xxError,
  FlashMessageConnectSifChainWallet,
  FlashMessageConnectSifChainWalletError,
  FlashMessageConnectSifChainWalletLoading,
  Button,
  ChevronDownIcon,
  formatNumberAsDecimal,
  Tooltip,
} from "@sifchain/ui";
import { isNil } from "rambda";
import { useRouter } from "next/router";
import { forwardRef, useState } from "react";
import clsx from "clsx";
import Link from "next/link";

import { useSifSignerAddress } from "~/hooks/useSifSigner";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import AssetIcon from "~/compounds/AssetIcon";
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

import { findNextOrderAndSortBy, SORT_BY } from "./_tables";
import { formatDateISO, formatIntervalToDuration } from "./_intl";
import { HtmlUnicode, removeFirstCharsUC } from "./_trade";
import { NoResultsRow, PaginationButtons, PaginationShowItems, PillUpdating } from "./_components";

const isTruthy = (target: any) => !isNil(target);

/**
 * ********************************************************************************************
 *
 * OpenPositionsTable Compound
 *
 * ********************************************************************************************
 */
const TooltipIconText = forwardRef<HTMLSpanElement | null>(function TooltipIconText(_props, ref) {
  return (
    <span
      ref={ref}
      className="inline-flex h-[16px] w-[16px] items-center justify-center rounded-full border border-current font-serif text-[10px]"
    >
      i
    </span>
  );
});
const TOOLTIP_LIQUIDATION_RATIO_TITLE = `What does "LR" means?`;
const TOOLTIP_LIQUIDATION_RATIO_CONTENT =
  "Liquidation ratio (LR) is defined by the current value of the position divided by outstanding liabilities. As the liquidation ratio decreases, the position becomes more at risk for liquidation. A safety factor is set for all pools which defines the liquidation ratio level at which positions are automatically closed before the liabilities become greater than the value held.";
const TOOLTIP_NPV_TITLE = `What does "NPV" means?`;
const TOOLTIP_NPV_CONTENT =
  "Net present value (NPV) represents the value of the position given spot prices for each asset involved in the trade. NPV does not represent the final amount you would receive in proceeds if you close the position";
const HEADERS_TITLES = {
  DATE_OPENED: "Date Opened",
  POOL: "Pool",
  SIDE: "Side",
  POSITION: "Position",
  ASSET: "Asset",
  LEVERAGE: "Leverage",
  NPV: "NPV",
  INTEREST_RATE: "Interest Rate",
  INTEREST_PAID: "Interest Paid",
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
  { title: HEADERS_TITLES.INTEREST_PAID, order_by: "interest_paid_custody" },
  { title: HEADERS_TITLES.LIQUIDATION_RATIO, order_by: "health" },
  { title: HEADERS_TITLES.DURATION, order_by: "" },
  { title: HEADERS_TITLES.CLOSE_POSITION, order_by: "" },
];
const createTimeOpenLabel = (timeOpen: Duration) => {
  const { years, months, days, hours, minutes, seconds } = timeOpen;
  const yearsLabel = years ? `${years}y` : null;
  const monthsLabel = months ? `${months}m` : null;
  const daysLabel = days ? `${days}d` : null;
  const hoursLabel = hours ? `${hours}h` : null;
  const minutesLabel = minutes ? `${minutes}min` : null;
  const secondsLabel = seconds ? `${seconds}s` : null;
  const isSeconds = [yearsLabel, monthsLabel, daysLabel, hoursLabel, minutesLabel].every((item) => item === null);
  const maybeSecondsLabel = isSeconds ? secondsLabel : null;
  return [yearsLabel, monthsLabel, daysLabel, hoursLabel, minutesLabel, maybeSecondsLabel]
    .filter((label) => Boolean(label))
    .join(", ");
};

type HideColsUnion = typeof HEADERS_TITLES[keyof typeof HEADERS_TITLES];
export type OpenPositionsTableProps = {
  openPositionsQuery: ReturnType<typeof useOpenPositionsQuery> | ReturnType<typeof useMarginOpenPositionsBySymbolQuery>;
  classNamePaginationContainer?: string;
  hideColumns?: HideColsUnion[];
};
const OpenPositionsTable = (props: OpenPositionsTableProps) => {
  const router = useRouter();
  const tokenRegistryQuery = useTokenRegistryQuery();
  const walletAddress = useSifSignerAddress();
  const { openPositionsQuery } = props;

  const { hideColumns, classNamePaginationContainer } = props;
  const headers = OPEN_POSITIONS_HEADER_ITEMS;

  const [positionToClose, setPositionToClose] = useState<{
    isOpen: boolean;
    value: OpenPositionsQueryData | null;
  }>({
    isOpen: false,
    value: null,
  });

  if (walletAddress.isIdle) {
    return <FlashMessageConnectSifChainWallet size="full-page" />;
  }

  if (walletAddress.isError) {
    return <FlashMessageConnectSifChainWalletError size="full-page" />;
  }

  if (walletAddress.isLoading) {
    return <FlashMessageConnectSifChainWalletLoading size="full-page" />;
  }

  if (openPositionsQuery.isLoading || tokenRegistryQuery.isLoading) {
    return <FlashMessageLoading size="full-page" />;
  }

  if (openPositionsQuery.isSuccess && tokenRegistryQuery.isSuccess) {
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

                  if (header.order_by === "") {
                    return (
                      <th key={header.title} className="flex flex-row items-center px-4 py-3 font-normal">
                        <span className="cursor-not-allowed">{header.title}</span>
                        {header.title === HEADERS_TITLES.NPV ? (
                          <>
                            <div className="mr-1" />
                            <Tooltip title={TOOLTIP_NPV_TITLE} content={TOOLTIP_NPV_CONTENT}>
                              <TooltipIconText />
                            </Tooltip>
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
                        })}
                      >
                        {linkNextEl}
                        {header.title === HEADERS_TITLES.LIQUIDATION_RATIO ? (
                          <>
                            <div className="mr-1" />
                            <Tooltip
                              title={TOOLTIP_LIQUIDATION_RATIO_TITLE}
                              content={TOOLTIP_LIQUIDATION_RATIO_CONTENT}
                            >
                              <TooltipIconText />
                            </Tooltip>
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
                const item = x as OpenPositionsQueryData & { _optimistic: boolean };

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
                    <td className="px-4 py-3">
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
                    <td className="px-4 py-3">
                      {isTruthy(item.leverage) ? (
                        `${formatNumberAsDecimal(Number(item.leverage))}x`
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.unrealized_pnl) && Number.isNaN(unrealizedPnl) === false ? (
                        <div
                          className={clsx("flex flex-row items-center", {
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
                    <td className="px-4 py-3">
                      {isTruthy(item.interest_rate) ? (
                        `${formatNumberAsDecimal(Number(item.interest_rate), 8)}%`
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    {hideColumns?.includes(HEADERS_TITLES.INTEREST_PAID) ? null : (
                      <td className="px-4 py-3">
                        {isTruthy(item.current_interest_paid_custody) ? (
                          <div className="flex flex-row items-center">
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
                    <td className="px-4 py-3">
                      {isTruthy(item.health) ? (
                        formatNumberAsDecimal(Number(item.health))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.date_opened) ? (
                        createTimeOpenLabel(formatIntervalToDuration(new Date(item.date_opened), new Date()))
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
          className={clsx("mt-auto flex flex-row items-center justify-end bg-gray-800", classNamePaginationContainer)}
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
                    className={clsx("rounded px-2 py-1", {
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
            onClose={() => {
              if (positionToClose.isOpen) {
                setPositionToClose((prev) => ({ ...prev, isOpen: false }));
              }
            }}
            onMutationSuccess={() => {
              setPositionToClose({ isOpen: false, value: null });
            }}
            onTransitionEnd={() => {
              if (positionToClose.value !== null) {
                setPositionToClose((prev) => ({ ...prev, value: null }));
              }
            }}
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
