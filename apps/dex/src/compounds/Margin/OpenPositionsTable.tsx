import { useMemo } from "react";
import { formatDistance, formatRelative } from "date-fns";
import clsx from "clsx";
import Link from "next/link";

import { Button, formatNumberAsCurrency, ChevronDownIcon } from "@sifchain/ui";

import { NoResultsRow } from "./NoResultsRow";

import { useQuery } from "react-query";
import { createOpenPositionsRow } from "./mockdata";
import { useRouter } from "next/router";
function useQueryOpenPositions(queryParams: {
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
          () => createOpenPositionsRow(),
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
      results: ReturnType<typeof createOpenPositionsRow>[];
    }>;
  return useQuery(["OpenPositions", queryParams], query, {
    keepPreviousData: true,
  });
}

function formatDateRelative(date: Date): string {
  return formatRelative(date, new Date());
}
function formatDateDistance(date: Date): string {
  return formatDistance(date, new Date(), { addSuffix: true });
}
function formatNumberAsDecimal(number: number, decimals = 2): string {
  const formatter = Intl.NumberFormat(undefined, {
    style: "decimal",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return formatter.format(number);
}
function formatNumberAsPercent(number: number, decimals = 2): string {
  const formatter = Intl.NumberFormat(undefined, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return formatter.format(number);
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
const OPEN_POSITIONS_HEADER_ITEMS = [
  "Pool",
  "Side",
  "Asset",
  "Amount",
  "Base Leverage",
  "Unrealized P&L",
  "Interest Rate",
  "Unsettled Interest",
  "Next Payment",
  "Paid Interest",
  "Health",
  "Date Opened",
  "Time Open",
  "Close Position",
] as const;

type HideColsUnion =
  | "pool"
  | "side"
  | "asset"
  | "amount"
  | "baseLeverage"
  | "unrealizedPL"
  | "interestRate"
  | "unsettledInterest"
  | "nextPayment"
  | "paidInterest"
  | "health"
  | "dateOpened"
  | "timeOpen";
export type OpenPositionsTableProps = {
  queryId: string;
  hideColumns?: HideColsUnion[];
};

const OpenPositionsTable = (props: OpenPositionsTableProps) => {
  const router = useRouter();
  const queryParams = {
    page: (router.query["page"] as string) || "1",
    limit: (router.query["limit"] as string) || "10",
    orderBy: (router.query["orderBy"] as string) || "",
    sortBy: (router.query["sortBy"] as string) || "desc",
  };
  const openPositionsQuery = useQueryOpenPositions(queryParams);
  const { hideColumns } = props;
  const headers = useMemo(() => OPEN_POSITIONS_HEADER_ITEMS, []);

  if (openPositionsQuery.isSuccess) {
    const { results, pagination } = openPositionsQuery.data;
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
          {openPositionsQuery.isRefetching && (
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
                      hidden={hideColumns?.includes(itemKey as HideColsUnion)}
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
                  message="You have no open positions."
                />
              )}
              {results.map((item) => {
                const position = MARGIN_POSITION[item.side];
                const amountSign = Math.sign(Number(item.amount));
                const unrealizedPLSign = Math.sign(Number(item.unrealizedPL));

                return (
                  <tr key={item.id}>
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
                      {formatNumberAsDecimal(Number(item.baseLeverage))}x
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx({
                          "text-green-400": unrealizedPLSign === 1,
                          "text-red-400": unrealizedPLSign === -1,
                        })}
                      >
                        {formatNumberAsCurrency(Number(item.unrealizedPL), 2)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {formatNumberAsPercent(Number(item.interestRate))}
                    </td>
                    <td
                      className="px-4 py-3"
                      hidden={hideColumns?.includes("unsettledInterest")}
                    >
                      {formatNumberAsCurrency(Number(item.unsettledInterest))}
                    </td>
                    <td
                      className="px-4 py-3"
                      hidden={hideColumns?.includes("nextPayment")}
                    >
                      {formatDateRelative(item.nextPayment)}
                    </td>
                    <td
                      className="px-4 py-3"
                      hidden={hideColumns?.includes("paidInterest")}
                    >
                      {formatNumberAsCurrency(Number(item.paidInterest))}
                    </td>
                    <td className="px-4 py-3">{item.health}</td>
                    <td className="px-4 py-3">
                      {formatDateRelative(item.dateOpened)}
                    </td>
                    <td className="px-4 py-3">
                      {formatDateDistance(item.timeOpen)}
                    </td>
                    <td className="px-4">
                      <Button
                        variant="secondary"
                        as="button"
                        size="xs"
                        className="font-normal rounded"
                        onClick={() => alert(`Close ${item.id}`)}
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
      </>
    );
  }

  return (
    <div className="bg-gray-850 p-10 text-center text-gray-100">Loading...</div>
  );
};

export default OpenPositionsTable;
