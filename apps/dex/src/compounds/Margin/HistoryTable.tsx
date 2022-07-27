import { useMemo } from "react";
import { formatDistance, formatRelative } from "date-fns";
import clsx from "clsx";
import Link from "next/link";

import { ChevronDownIcon, formatNumberAsCurrency } from "@sifchain/ui";

import { NoResultsRow } from "./NoResultsRow";

import { useQuery } from "react-query";
import { createHistoryRow } from "./mockdata";
import { useRouter } from "next/router";
function useQueryHistory(queryParams: {
  limit: string;
  page: string;
  orderBy: string;
  sortBy: string;
}) {
  const query = () =>
    new Promise((res) => {
      setTimeout(() => {
        const results = Array.from(
          { length: Number(queryParams.limit) * 5 },
          () => createHistoryRow(),
        );
        res({
          pagination: {
            total: `${results.length}`,
            limit: queryParams.limit,
            page: queryParams.page,
            orderBy: queryParams.orderBy,
            sortBy: queryParams.sortBy,
          },
          results: results.slice(0, Number(queryParams.limit)),
        });
      }, 2000);
    }) as Promise<{
      pagination: {
        total: string;
        limit: string;
        page: string;
        orderBy: string;
        sortBy: string;
      };
      results: ReturnType<typeof createHistoryRow>[];
    }>;
  return useQuery(["History", queryParams], query, {
    keepPreviousData: true,
  });
}

function formatDateRelative(date: Date): string {
  return formatRelative(date, new Date());
}
function formatDateDistance(date: Date): string {
  return formatDistance(date, new Date(), { addSuffix: true });
}
function fromColNameToItemKey(name: string) {
  const slug = name.replace(/\W/g, "");
  return slug.charAt(0).toLowerCase() + slug.slice(1);
}

const SORT_BY = {
  ASC: "asc",
  DESC: "desc",
};
const MARGIN_POSITION: Record<string, string> = {
  "0": "Unspecified",
  "1": "Long",
  "2": "Short",
};
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
    page: (router.query["page"] as string) || "1",
    limit: (router.query["limit"] as string) || "10",
    orderBy: (router.query["orderBy"] as string) || "",
    sortBy: (router.query["sortBy"] as string) || "desc",
  };
  const historyQuery = useQueryHistory(queryParams);
  const headers = useMemo(() => HISTORY_HEADER_ITEMS, []);

  if (historyQuery.isSuccess) {
    const { results, pagination } = historyQuery.data;
    const pages = Math.ceil(
      Number(pagination.total) / Number(pagination.limit),
    );
    return (
      <>
        <div className="flex flex-row bg-gray-800 items-center">
          <span className="text-sm mx-4 py-3">
            <span>Showing</span>
            <span className="mx-1">{pagination.page}</span>
            <span>of</span>
            <span className="mx-1">{pages}</span>
            <span>pages</span>
          </span>
          <ul className="flex flex-row text-sm">
            {Array.from({ length: pages }, (_, index) => {
              const page = ++index;
              return (
                <li key={index} className="flex-1 flex flex-col">
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
                </li>
              );
            })}
          </ul>
          {historyQuery.isRefetching && (
            <span className="bg-yellow-600 text-yellow-200 p-2 text-sm rounded ml-4">
              Updating...
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto overflow-scroll w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-800">
              <tr className="text-gray-400">
                {headers.map((title) => {
                  const itemKey = fromColNameToItemKey(title);
                  const itemActive = pagination.orderBy === itemKey;

                  let nextSortBy = SORT_BY.DESC;
                  let nextOrderBy = itemKey;

                  if (itemActive) {
                    nextSortBy = pagination.sortBy;
                  }

                  if (itemActive && nextSortBy === SORT_BY.ASC) {
                    nextOrderBy = "";
                    nextSortBy = "";
                  }

                  if (itemActive && nextSortBy === SORT_BY.DESC) {
                    nextSortBy = SORT_BY.ASC;
                  }
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
