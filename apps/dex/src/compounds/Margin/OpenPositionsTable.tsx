import { Decimal } from "@cosmjs/math";
import {
  Button,
  ChevronDownIcon,
  FlashMessage5xxError,
  FlashMessageConnectSifChainWallet,
  FlashMessageConnectSifChainWalletError,
  FlashMessageConnectSifChainWalletLoading,
  FlashMessageLoading,
  formatNumberAsDecimal,
} from "@sifchain/ui";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { isNil } from "rambda";
import { MouseEventHandler, useCallback, useState } from "react";

import AssetIcon from "~/compounds/AssetIcon";
import type {
  MarginOpenPositionsData,
  useMarginOpenPositionsBySymbolQuery,
  useMarginOpenPositionsQuery,
} from "~/domains/margin/hooks";
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

import { usePoolQuery } from "~/domains/clp/hooks/usePool";
import type { EnhancedRegistryAsset } from "~/domains/tokenRegistry/hooks/useTokenRegistry";
import { ROWAN } from "~/domains/assets";
import { TooltipInterestPaid, TooltipLiquidationRatio, TooltipNpv } from "./tooltips";
import { NoResultsRow, PaginationContainer, PillUpdating } from "./_components";
import { createDurationLabel, formatDateISO, formatIntervalToDuration } from "./_intl";
import { findNextOrderAndSortBy, SORT_BY } from "./_tables";
import { HtmlUnicode, removeFirstCharsUC } from "./_trade";
import { useEnhancedPoolQuery } from "~/domains/clp";

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
  openPositionsQuery:
    | ReturnType<typeof useMarginOpenPositionsQuery>
    | ReturnType<typeof useMarginOpenPositionsBySymbolQuery>;
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

  const onClickTable = useCallback<MouseEventHandler<HTMLTableElement>>(
    (event) => {
      event.preventDefault();
      const $target = event.target;
      if ($target instanceof HTMLButtonElement && $target.dataset["id"] && openPositionsQuery.data) {
        const item = openPositionsQuery.data.results.find(
          (x) => x.id === $target.dataset["id"],
        ) as MarginOpenPositionsData;
        setPositionToClose({
          isOpen: true,
          value: item,
        });
      }
    },
    [openPositionsQuery.data],
  );
  const onModalClose = useCallback(() => {
    if (positionToClose.isOpen) {
      setPositionToClose((prev) => ({ ...prev, isOpen: false }));
    }
  }, [positionToClose.isOpen]);
  const onModalMutationSuccess = useCallback(() => {
    setPositionToClose({ isOpen: false, value: null });
  }, []);
  const onModalTransitionEnd = useCallback(() => {
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
    const { findBySymbolOrDenom, data: registry } = tokenRegistryQuery;
    const { results, pagination } = openPositionsQuery.data;

    return (
      <section className="bg-gray-850 flex h-full flex-col">
        <div className="flex-1 overflow-x-auto">
          <table
            className="w-full table-auto overflow-scroll whitespace-nowrap text-left text-xs"
            onClick={onClickTable}
          >
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
              {results.map((x) => (
                <OpenPositionRow
                  key={x.id}
                  position={x}
                  custodyAsset={findBySymbolOrDenom(x.custody_asset)}
                  collateralAsset={findBySymbolOrDenom(x.collateral_asset)}
                  headers={headers}
                  hideColumns={hideColumns}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div
          className={clsx(
            "mt-auto flex flex-col items-center justify-end bg-gray-800 p-2 md:flex-row",
            classNamePaginationContainer,
          )}
        >
          {openPositionsQuery.isRefetching ? <PillUpdating /> : null}
          <PaginationContainer pagination={pagination} />
        </div>
        {positionToClose.value && (
          <ModalMTPClose
            data={positionToClose.value}
            isOpen={positionToClose.isOpen}
            onClose={onModalClose}
            onMutationSuccess={onModalMutationSuccess}
            onTransitionEnd={onModalTransitionEnd}
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

type OpenPositionRowProps = {
  position: MarginOpenPositionsData;
  custodyAsset?: EnhancedRegistryAsset;
  collateralAsset?: EnhancedRegistryAsset;
  headers: typeof OPEN_POSITIONS_HEADER_ITEMS;
  hideColumns?: string[];
};

function OpenPositionRow({ position, custodyAsset, collateralAsset, headers, hideColumns }: OpenPositionRowProps) {
  const poolDenom = (position.custody_asset === ROWAN.symbol ? collateralAsset?.denom : custodyAsset?.denom) ?? "";

  const { data: poolData } = usePoolQuery(poolDenom, {
    enabled: Boolean(poolDenom),
    refetchInterval: 60_000,
  });

  const pool = poolData?.pool;

  if (!custodyAsset || !collateralAsset || !pool) {
    // console.group("Open Positions Missing Custody, Collateral asset or pool");
    // console.log({ item: position });
    // console.groupEnd();
    return (
      <tr>
        {Array.from({ length: headers.length }, (_, i) => {
          return (
            <td className="px-4 py-3" key={`col-${i}`}>
              <HtmlUnicode name="EmDash" />
            </td>
          );
        })}
      </tr>
    );
  }

  const currentPriceAsDecimal = Decimal.fromAtomics(
    position.collateral_asset === ROWAN.symbol ? pool?.swapPriceExternal ?? "0" : pool?.swapPriceNative ?? "0",
    ROWAN.decimals,
  );

  const currentPriceAsNumber = currentPriceAsDecimal.toFloatApproximation();

  const currentPositionAsNumber = Number(position.currentCustodyAmount ?? position.openCustodyAmount);

  const openCollateralAmount = Number(position.collateral_amount);
  const openLiabilities = Number(position.liabilities);

  const custodyAmount = Number(position.custody_amount ?? "0");
  const currentInterestPaidCustody = Number(position.current_interest_paid_custody ?? "0");

  const unrealizedPnl = currentPositionAsNumber * currentPriceAsNumber - (openCollateralAmount + openLiabilities);

  const unrealizedPLSign = Math.sign(unrealizedPnl);

  return (
    <tr
      key={position.id}
      data-testid={position.id}
      className={clsx({
        "italic text-gray-300": position._optimistic,
      })}
    >
      <td className="px-4 py-3">
        {isTruthy(position.date_opened) ? formatDateISO(new Date(position.date_opened)) : <HtmlUnicode name="EmDash" />}
      </td>
      {hideColumns?.includes(HEADERS_TITLES.POOL) ? null : (
        <td className="px-4 py-3">
          {isTruthy(position.pool) ? removeFirstCharsUC(position.pool).toUpperCase() : <HtmlUnicode name="EmDash" />}
        </td>
      )}
      <td className="px-4 py-3">{isTruthy(position.position) ? position.position : <HtmlUnicode name="EmDash" />}</td>
      <td className="px-4 py-3 text-right tabular-nums">
        {isTruthy(position.custody_amount) ? formatNumberAsDecimal(custodyAmount, 4) : <HtmlUnicode name="EmDash" />}
      </td>
      <td className="px-4 py-3">
        {isTruthy(position.custody_asset) ? (
          removeFirstCharsUC(position.custody_asset.toUpperCase())
        ) : (
          <HtmlUnicode name="EmDash" />
        )}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {isTruthy(position.leverage) ? (
          `${formatNumberAsDecimal(Number(position.leverage))}x`
        ) : (
          <HtmlUnicode name="EmDash" />
        )}
      </td>
      <td className="px-4 py-3">
        {isTruthy(unrealizedPnl) && Number.isNaN(unrealizedPnl) === false ? (
          <div
            className={clsx("flex flex-row items-center justify-end tabular-nums", {
              "text-green-400": unrealizedPLSign === 1 && unrealizedPnl > 0,
              "text-red-400": unrealizedPLSign === -1 && unrealizedPnl < 0,
            })}
          >
            <span className="mr-1">
              {unrealizedPLSign === 1 ? <HtmlUnicode name="PlusSign" /> : null}
              {formatNumberAsDecimal(unrealizedPnl, 6)}
            </span>
            <AssetIcon symbol={position.collateral_asset} network="sifchain" size="sm" />
          </div>
        ) : (
          <div className="text-right">
            <HtmlUnicode name="EmDash" />
          </div>
        )}
      </td>
      {hideColumns?.includes(HEADERS_TITLES.INTEREST_RATE) ? null : (
        <td className="px-4 py-3 text-right tabular-nums">
          {isTruthy(position.interest_rate) ? (
            `${formatNumberAsDecimal(Number(position.interest_rate) * 100, 8)}%`
          ) : (
            <HtmlUnicode name="EmDash" />
          )}
        </td>
      )}
      {hideColumns?.includes(HEADERS_TITLES.PAID_INTEREST) ? null : (
        <td className="px-4 py-3">
          {isTruthy(currentInterestPaidCustody) ? (
            <div className="flex flex-row items-center justify-end tabular-nums">
              <span className="mr-1">
                {formatNumberAsDecimal(currentInterestPaidCustody, 6) ?? <HtmlUnicode name="EmDash" />}
              </span>
              <AssetIcon symbol={position.custody_asset} network="sifchain" size="sm" />
            </div>
          ) : (
            <HtmlUnicode name="EmDash" />
          )}
        </td>
      )}
      <td className="px-4 py-3 text-right tabular-nums">
        {isTruthy(position.current_health) ? (
          formatNumberAsDecimal(Number(position.current_health), 4)
        ) : (
          <HtmlUnicode name="EmDash" />
        )}
      </td>
      <td className="px-4 py-3">
        {isTruthy(position.date_opened) ? (
          createDurationLabel(formatIntervalToDuration(new Date(position.date_opened), new Date()))
        ) : (
          <HtmlUnicode name="EmDash" />
        )}
      </td>
      <td className="px-4">
        {isTruthy(position._optimistic) ? null : (
          <Button variant="secondary" as="button" size="xs" className="rounded font-normal" data-id={position.id}>
            Close
          </Button>
        )}
      </td>
    </tr>
  );
}

export default OpenPositionsTable;
