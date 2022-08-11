import { useRouter } from "next/router";
import clsx from "clsx";
import Link from "next/link";

import { ChevronDownIcon, formatNumberAsCurrency } from "@sifchain/ui";
import { useHistoryQuery } from "~/domains/margin/hooks/useHistoryQuery";

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
} from "./_components";
import { formatDateRelative, formatDateDistance } from "./_intl";
import {
  fromColNameToItemKey,
  findNextOrderAndSortBy,
  SORT_BY,
  MARGIN_POSITION,
  QS_DEFAULTS,
} from "./_tables";
import { HtmlUnicode } from "./_trade";

/**
 * ********************************************************************************************
 *
 * HistoryTable Compound
 *
 * ********************************************************************************************
 */
const HEADER_SLUGS = {
  // they match sifApi response object
  address: "address",
  custody_amount: "custody_amount",
  custody_asset: "custody_asset",
  date_opened: "date_opened",
  health: "health",
  id: "id",
  interest_rate: "interest_rate",
  leverage: "leverage",
  next_payment: "next_payment",
  paid_interest: "paid_interest",
  position: "position",
  realized_pnl: "realized_pnl",
  unsettled_interest: "unsettled_interest",
};
const HISTORY_HEADER_ITEMS = [
  { title: "Date Closed", slug: null },
  { title: "Time Open", slug: null },
  { title: "Pool", slug: null },
  { title: "Side", slug: HEADER_SLUGS.position },
  { title: "Asset", slug: HEADER_SLUGS.custody_asset },
  { title: "Amount", slug: HEADER_SLUGS.custody_amount },
  { title: "Realized P&L", slug: HEADER_SLUGS.realized_pnl },
];
export type HistoryTableProps = {
  queryId: string;
  classNamePaginationContainer?: string;
};
const HistoryTable = (props: HistoryTableProps) => {
  const router = useRouter();
  const queryParams = {
    limit: (router.query["limit"] as string) || QS_DEFAULTS.limit,
    offset: (router.query["offset"] as string) || QS_DEFAULTS.offset,
    orderBy: (router.query["orderBy"] as string) || "custody_amount",
    sortBy: (router.query["sortBy"] as string) || QS_DEFAULTS.sortBy,
  };
  const historyQuery = useHistoryQuery({
    ...queryParams,
    address: props.queryId,
  });
  const headers = HISTORY_HEADER_ITEMS;

  if (historyQuery.isSuccess) {
    const { results, pagination } = historyQuery.data;
    const pages = Math.ceil(
      Number(pagination.total) / Number(pagination.limit),
    );

    return (
      <>
        <div
          className={clsx(
            "flex flex-row bg-gray-800 items-center",
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
              const offset = String(
                Number(pagination.limit) * page - Number(pagination.limit),
              );
              return (
                <Link
                  href={{ query: { ...router.query, offset } }}
                  scroll={false}
                >
                  <a
                    className={clsx("px-2 py-1 rounded", {
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
        <div className="overflow-x-auto">
          <table className="table-auto overflow-scroll w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-800">
              <tr className="text-gray-400">
                {headers.map((header) => {
                  const itemActive = pagination.order_by === header.slug;
                  const { nextOrderBy, nextSortBy } = findNextOrderAndSortBy({
                    itemKey: header.slug,
                    itemActive,
                    currentSortBy: pagination.sort_by,
                  });
                  return (
                    <th
                      key={header.slug}
                      data-item-key={header.slug}
                      className="font-normal px-4 py-3"
                    >
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
                            "text-white font-semibold": itemActive,
                          })}
                        >
                          {header.title}
                          {itemActive && (
                            <ChevronDownIcon
                              className={clsx("ml-1 transition-transform", {
                                "-rotate-180":
                                  pagination.sortBy === SORT_BY.ASC,
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
                <NoResultsRow
                  colSpan={headers.length}
                  message="History not available. Try again later."
                />
              )}
              {results.map((item: any) => {
                const position = item.position;
                const amountSign = Math.sign(Number(item.custody_amount));
                const realizedPLSign = Math.sign(Number(item.realized_pnl));

                return (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      {item.date_closed ? (
                        formatDateRelative(item.date_closed)
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {item.date_opened ? (
                        formatDateDistance(new Date(item.date_opened))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {item.pool ? item.pool : <HtmlUnicode name="EmDash" />}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx({
                          "text-cyan-400":
                            position === MARGIN_POSITION.UNSPECIFIED,
                          "text-green-400": position === MARGIN_POSITION.LONG,
                          "text-red-400": position === MARGIN_POSITION.SHORT,
                        })}
                      >
                        {position}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.custody_asset.toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx({
                          "text-green-400": amountSign === 1,
                          "text-red-400": amountSign === -1,
                        })}
                      >
                        {formatNumberAsCurrency(Number(item.custody_amount), 4)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-green-400">
                        <span
                          className={clsx({
                            "text-green-400": realizedPLSign === 1,
                            "text-red-400": realizedPLSign === -1,
                          })}
                        >
                          {item.realized_pnl ? (
                            formatNumberAsCurrency(Number(item.realized_pnl), 2)
                          ) : (
                            <HtmlUnicode name="EmDash" />
                          )}
                        </span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  if (historyQuery.isError) {
    return (
      <div className="bg-gray-850 p-10 text-center text-gray-100">
        Try again later.
      </div>
    );
  }

  return (
    <div className="bg-gray-850 p-10 text-center text-gray-100">Loading...</div>
  );
};

export default HistoryTable;
