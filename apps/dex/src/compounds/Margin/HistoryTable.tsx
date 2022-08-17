import { useRouter } from "next/router";
import clsx from "clsx";
import Link from "next/link";

import { ChevronDownIcon, formatNumberAsCurrency } from "@sifchain/ui";
import { useHistoryQuery } from "~/domains/margin/hooks/useMarginHistoryQuery";

import { isNil } from "rambda";
const isTruthy = (target: any) => !isNil(target);

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
import {
  NoResultsRow,
  PaginationShowItems,
  PaginationButtons,
  PillUpdating,
  FlashMessageLoading,
  FlashMessage5xxError,
  FlashMessageConnectSifChainWallet,
  FlashMessageConnectSifChainWalletError,
  FlashMessageConnectSifChainWalletLoading,
} from "./_components";
import { formatDateRelative, formatDateDistance } from "./_intl";
import { findNextOrderAndSortBy, SORT_BY, MARGIN_POSITION, QS_DEFAULTS } from "./_tables";
import { HtmlUnicode } from "./_trade";
import { useSifSignerAddress } from "~/hooks/useSifSigner";

/**
 * ********************************************************************************************
 *
 * HistoryTable Compound
 *
 * ********************************************************************************************
 */
const HISTORY_HEADER_ITEMS = [
  { title: "Date Closed", order_by: "" },
  { title: "Time Open", order_by: "open_date_time" },
  { title: "Pool", order_by: "" },
  { title: "Side", order_by: "position" },
  { title: "Asset", order_by: "open_custody_asset" },
  { title: "Amount", order_by: "open_custody_amount" },
  { title: "Realized P&L", order_by: "" },
];
export type HistoryTableProps = {
  classNamePaginationContainer?: string;
};
const HistoryTable = (props: HistoryTableProps) => {
  const router = useRouter();
  const walletAddress = useSifSignerAddress();
  const queryParams = {
    limit: (router.query["limit"] as string) || QS_DEFAULTS.limit,
    offset: (router.query["offset"] as string) || QS_DEFAULTS.offset,
    orderBy: (router.query["orderBy"] as string) || "address",
    sortBy: (router.query["sortBy"] as string) || QS_DEFAULTS.sortBy,
  };
  const historyQuery = useHistoryQuery({
    ...queryParams,
    walletAddress: walletAddress.data ?? "",
  });
  const headers = HISTORY_HEADER_ITEMS;

  if (walletAddress.isIdle) {
    return <FlashMessageConnectSifChainWallet />;
  }
  if (walletAddress.isError) {
    return <FlashMessageConnectSifChainWalletError />;
  }
  if (walletAddress.isLoading) {
    return <FlashMessageConnectSifChainWalletLoading />;
  }

  if (historyQuery.isLoading) {
    return <FlashMessageLoading />;
  }

  if (historyQuery.isSuccess) {
    const { results, pagination } = historyQuery.data;
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
                    <th key={header.title} className="px-4 py-3 font-normal">
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
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-gray-850">
              {results.length <= 0 && (
                <NoResultsRow colSpan={headers.length} message="History not available. Try again later." />
              )}
              {results.map((item) => {
                const amountSign = Math.sign(Number(item.open_custody_amount));
                const realizedPLSign = Math.sign(Number(item.realized_pnl));

                return (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      {isTruthy(item.closed_date_time) ? (
                        formatDateRelative(new Date(item.closed_date_time))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.open_date_time) ? (
                        formatDateDistance(new Date(item.open_date_time))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.open_custody_asset) ? (
                        item.open_custody_asset.toUpperCase()
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
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
                      {isTruthy(item.open_custody_asset) ? (
                        item.open_custody_asset.toUpperCase()
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.open_custody_amount) ? (
                        <span
                          className={clsx({
                            "text-green-400": amountSign === 1,
                            "text-red-400": amountSign === -1,
                          })}
                        >
                          {formatNumberAsCurrency(Number(item.open_custody_amount), 4)}
                        </span>
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.realized_pnl) ? (
                        <span className="text-green-400">
                          <span
                            className={clsx({
                              "text-green-400": realizedPLSign === 1,
                              "text-red-400": realizedPLSign === -1,
                            })}
                          >
                            {formatNumberAsCurrency(Number(item.realized_pnl), 2)}
                          </span>
                        </span>
                      ) : (
                        <HtmlUnicode name="EmDash" />
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
            "mt-auto flex flex-row items-center justify-end bg-gray-800",
            props.classNamePaginationContainer,
          )}
        >
          {historyQuery.isRefetching && <PillUpdating />}
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
      </section>
    );
  }

  return <FlashMessage5xxError />;
};

export default HistoryTable;
