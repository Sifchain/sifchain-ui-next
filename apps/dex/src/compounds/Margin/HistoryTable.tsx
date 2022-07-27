import { pathOr } from "ramda";
import { useMemo } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import Link from "next/link";

import { ChevronDownIcon, formatNumberAsCurrency } from "@sifchain/ui";

/**
 * ********************************************************************************************
 *
 * - "components" should be moved to src/components or ui
 * - "mockdata" should be replaced by Data Services endpoint
 * - "intl" could be moved to the domain folder or packages/
 * - "constants" could be moved to the domain folder or packages/
 *
 * ********************************************************************************************
 */
import {
  NoResultsRow,
  PaginationShowItems,
  PaginationShowPages,
  PaginationButtons,
  PillUpdating,
} from "./_components";
import { useQueryHistory } from "./_mockdata";
import { formatDateRelative, formatDateDistance } from "./_intl";
import {
  fromColNameToItemKey,
  findNextOrderAndSortBy,
  SORT_BY,
  MARGIN_POSITION,
  QS_DEFAULTS,
} from "./_constants";

/**
 * ********************************************************************************************
 *
 * HistoryTable Compound
 *
 * ********************************************************************************************
 */
const HISTORY_HEADER_ITEMS = [
  "Date Closed",
  "Time Open",
  "Pool",
  "Side",
  "Asset",
  "Amount",
  "Realized P&L",
];
const HistoryTable = () => {
  const router = useRouter();
  const queryParams = {
    page: pathOr(QS_DEFAULTS.page, ["page"], router.query),
    limit: pathOr(QS_DEFAULTS.limit, ["limit"], router.query),
    orderBy: pathOr(QS_DEFAULTS.orderBy, ["orderBy"], router.query),
    sortBy: pathOr(QS_DEFAULTS.sortBy, ["sortBy"], router.query),
  };
  const historyQuery = useQueryHistory(queryParams);
  const headers = useMemo(() => HISTORY_HEADER_ITEMS, []);

  if (historyQuery.isSuccess) {
    const { results, pagination } = historyQuery.data;

    return (
      <>
        <div className="flex flex-row bg-gray-800 items-center">
          <PaginationShowItems
            limit={Number(pagination.limit)}
            page={Number(pagination.page)}
            total={Number(pagination.total)}
          />
          <PaginationShowPages
            page={Number(pagination.page)}
            pages={Number(pagination.pages)}
          />
          <PaginationButtons
            pages={Number(pagination.pages)}
            render={(page) => {
              return (
                <Link
                  href={{ query: { ...router.query, page } }}
                  scroll={false}
                >
                  <a
                    className={clsx("px-2 py-1 rounded", {
                      "bg-gray-400": Number(pagination.page) === page,
                    })}
                  >
                    {page}
                  </a>
                </Link>
              );
            }}
          />
          {historyQuery.isRefetching && <PillUpdating />}
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto overflow-scroll w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-800">
              <tr className="text-gray-400">
                {headers.map((title) => {
                  const itemKey = fromColNameToItemKey(title);
                  const itemActive = pagination.orderBy === itemKey;
                  const { nextOrderBy, nextSortBy } = findNextOrderAndSortBy({
                    itemKey,
                    itemActive,
                    currentSortBy: pagination.sortBy,
                  });
                  return (
                    <th
                      key={itemKey}
                      data-item-key={itemKey}
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
                          {title}
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
              {results.map((item) => {
                const position = MARGIN_POSITION[item.side];
                const amountSign = Math.sign(Number(item.amount));
                const realizedPLSign = Math.sign(Number(item.realizedPL));

                return (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      {formatDateRelative(item.dateClosed)}
                    </td>
                    <td className="px-4 py-3">
                      {formatDateDistance(item.timeOpen)}
                    </td>
                    <td className="px-4 py-3">{item.pool}</td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx({
                          "text-cyan-400": position === MARGIN_POSITION[0],
                          "text-green-400": position === MARGIN_POSITION[1],
                          "text-red-400": position === MARGIN_POSITION[2],
                        })}
                      >
                        {position}
                      </span>
                    </td>
                    <td className="px-4 py-3">{item.asset}</td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx({
                          "text-green-400": amountSign === 1,
                          "text-red-400": amountSign === -1,
                        })}
                      >
                        {formatNumberAsCurrency(Number(item.amount), 4)}
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
                          {formatNumberAsCurrency(Number(item.realizedPL), 2)}
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

  return (
    <div className="bg-gray-850 p-10 text-center text-gray-100">Loading...</div>
  );
};

export default HistoryTable;
