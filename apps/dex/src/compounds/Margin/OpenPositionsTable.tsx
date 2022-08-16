import { Button, ChevronDownIcon, formatNumberAsCurrency } from "@sifchain/ui";
import { Decimal } from "@cosmjs/math";
import { isNil } from "rambda";
import { useRouter } from "next/router";
import { useState } from "react";
import clsx from "clsx";
import Link from "next/link";

import { OpenPositionsQueryData, useOpenPositionsQuery } from "~/domains/margin/hooks/useMarginOpenPositionsQuery";
import { useSifSignerAddress } from "~/hooks/useSifSigner";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";

import { ModalClosePosition } from "./ModalClosePosition";

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

import { findNextOrderAndSortBy, MARGIN_POSITION, QS_DEFAULTS, SORT_BY } from "./_tables";
import { formatDateDistance, formatDateRelative, formatNumberAsDecimal, formatNumberAsPercent } from "./_intl";
import { HtmlUnicode } from "./_trade";
import {
  NoResultsRow,
  PaginationButtons,
  PaginationShowItems,
  PillUpdating,
  FlashMessageLoading,
  FlashMessage5xxError,
  FlashMessageConnectSifChainWallet,
  FlashMessageConnectSifChainWalletError,
  FlashMessageConnectSifChainWalletLoading,
} from "./_components";

const isTruthy = (target: any) => !isNil(target);

/**
 * ********************************************************************************************
 *
 * OpenPositionsTable Compound
 *
 * ********************************************************************************************
 */
const OPEN_POSITIONS_HEADER_ITEMS = [
  { title: "Pool", order_by: "" },
  { title: "Side", order_by: "position" },
  { title: "Position", order_by: "custody_amount" },
  { title: "Asset", order_by: "custody_asset" },
  { title: "Base Leverage", order_by: "leverage" },
  { title: "Unrealized P&L", order_by: "unrealized_pnl" },
  { title: "Interest Rate", order_by: "interest_rate" },
  { title: "Paid Interest", order_by: "paid_interest" },
  { title: "Health", order_by: "health" },
  { title: "Date Opened", order_by: "date_opened" },
  { title: "Time Open", order_by: "" },
  { title: "Close Position", order_by: "" },
];

type HideColsUnion = typeof OPEN_POSITIONS_HEADER_ITEMS[number]["title"];
export type OpenPositionsTableProps = {
  classNamePaginationContainer?: string;
  hideColumns?: HideColsUnion[];
};
const OpenPositionsTable = (props: OpenPositionsTableProps) => {
  const router = useRouter();
  const walletAddress = useSifSignerAddress();

  const { hideColumns, classNamePaginationContainer } = props;
  const headers = OPEN_POSITIONS_HEADER_ITEMS;
  const queryParams = {
    limit: (router.query["limit"] as string) || QS_DEFAULTS.limit,
    offset: (router.query["offset"] as string) || QS_DEFAULTS.offset,
    orderBy: (router.query["orderBy"] as string) || "custody_amount",
    sortBy: (router.query["sortBy"] as string) || QS_DEFAULTS.sortBy,
  };

  const { findBySymbolOrDenom } = useTokenRegistryQuery();

  const openPositionsQuery = useOpenPositionsQuery({
    ...queryParams,
    walletAddress: walletAddress.data ?? "",
  });

  const [positionToClose, setPositionToClose] = useState<{
    isOpen: boolean;
    value: OpenPositionsQueryData | null;
  }>({
    isOpen: false,
    value: null,
  });

  if (walletAddress.isIdle) {
    return <FlashMessageConnectSifChainWallet />;
  }
  if (walletAddress.isError) {
    return <FlashMessageConnectSifChainWalletError />;
  }
  if (walletAddress.isLoading) {
    return <FlashMessageConnectSifChainWalletLoading />;
  }

  if (openPositionsQuery.isLoading) {
    return <FlashMessageLoading />;
  }

  if (openPositionsQuery.isSuccess) {
    const { results, pagination } = openPositionsQuery.data;
    const pages = Math.ceil(Number(pagination.total) / Number(pagination.limit));

    return (
      <section className="flex h-full flex-col">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full table-auto overflow-scroll whitespace-nowrap text-left text-xs">
            <thead className="bg-gray-800">
              <tr className="text-gray-400">
                {headers.map((header) => {
                  const itemActive = pagination.order_by === header.order_by;
                  const { nextOrderBy, nextSortBy } = findNextOrderAndSortBy({
                    itemKey: header.order_by,
                    itemActive,
                    currentSortBy: pagination.sort_by,
                  });
                  return (
                    <th
                      key={header.title}
                      className="px-4 py-3 font-normal"
                      hidden={hideColumns?.includes(header.title)}
                    >
                      {header.title === "Close Position" ? null : (
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
                          <a
                            className={clsx("flex flex-row items-center", {
                              "font-semibold text-white": itemActive,
                              "cursor-not-allowed": header.order_by === "",
                            })}
                          >
                            {header.title}
                            {itemActive && (
                              <ChevronDownIcon
                                className={clsx("ml-1 transition-transform", {
                                  "-rotate-180": pagination.sort_by === SORT_BY.ASC,
                                })}
                              />
                            )}
                          </a>
                        </Link>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-gray-850">
              {results.length <= 0 && <NoResultsRow colSpan={headers.length} message="You have no open positions." />}
              {results.map((item) => {
                const custodyAsset = findBySymbolOrDenom(item.custody_asset);
                const collateralAsset = findBySymbolOrDenom(item.collateral_asset);

                if (!custodyAsset || !collateralAsset) {
                  throw new Error("Asset not found");
                }

                const custodyAmount = Decimal.fromAtomics(
                  item.custody_amount,
                  custodyAsset.decimals,
                ).toFloatApproximation();

                // this is slightly hacky, only doing it bexause we're getting a float returned here
                const unrealizedPnl = Number(item.unrealized_pnl) / 10 ** custodyAsset.decimals;

                const amountSign = Math.sign(custodyAmount);
                const unrealizedPLSign = Math.sign(unrealizedPnl);

                return (
                  <tr key={item.id}>
                    <td className="px-4 py-3" hidden={hideColumns?.includes("Pool")}>
                      {isTruthy(item.pool) ? item.pool : <HtmlUnicode name="EmDash" />}
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.position) ? (
                        <span
                          className={clsx({
                            "text-cyan-400": item.position === MARGIN_POSITION.UNSPECIFIED,
                            "text-green-400": item.position === MARGIN_POSITION.LONG,
                            "text-red-400": item.position === MARGIN_POSITION.SHORT,
                          })}
                        >
                          {item.position}
                        </span>
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx({
                          "text-green-400": amountSign === 1,
                          "text-red-400": amountSign === -1,
                        })}
                      >
                        {isTruthy(item.custody_amount) ? (
                          formatNumberAsDecimal(custodyAmount, 6)
                        ) : (
                          <HtmlUnicode name="EmDash" />
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.custody_asset) ? item.custody_asset.toUpperCase() : <HtmlUnicode name="EmDash" />}
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.leverage) ? (
                        `${formatNumberAsDecimal(Number(item.leverage))}x`
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx({
                          "text-green-400": unrealizedPLSign === 1,
                          "text-red-400": unrealizedPLSign === -1,
                        })}
                      >
                        {isTruthy(item.unrealized_pnl) ? (
                          formatNumberAsCurrency(unrealizedPnl, 6)
                        ) : (
                          <HtmlUnicode name="EmDash" />
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.interest_rate) ? (
                        formatNumberAsPercent(Number(item.interest_rate))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3" hidden={hideColumns?.includes("Paid Interest")}>
                      {isTruthy(item.paid_interest) ? (
                        formatNumberAsCurrency(Number(item.paid_interest))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.health) ? (
                        formatNumberAsPercent(Number(item.health))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.date_opened) ? (
                        formatDateRelative(new Date(item.date_opened))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.time_open) ? (
                        formatDateDistance(new Date(item.time_open))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4">
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
          <ModalClosePosition
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

  return <FlashMessage5xxError />;
};

export default OpenPositionsTable;
