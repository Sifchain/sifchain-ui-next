import { pathOr } from "ramda";
import { useRouter } from "next/router";
import clsx from "clsx";
import Link from "next/link";

import { Button, formatNumberAsCurrency, ChevronDownIcon } from "@sifchain/ui";

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
import { useQueryOpenPositions } from "./_mockdata";
import {
  formatNumberAsDecimal,
  formatNumberAsPercent,
  formatDateRelative,
  formatDateDistance,
} from "./_intl";
import {
  fromColNameToItemKey,
  findNextOrderAndSortBy,
  SORT_BY,
  MARGIN_POSITION,
  QS_DEFAULTS,
} from "./_tables";

/**
 * ********************************************************************************************
 *
 * OpenPositionsTable Compound
 *
 * ********************************************************************************************
 */
const OPEN_POSITIONS_HEADER_ITEMS = [
  "Pool",
  "Side",
  "Position", // Maps to "amount" field
  "Asset",
  "Base Leverage",
  "Unrealized P&L",
  "Interest Rate",
  "Unsettled Interest",
  "Next Payment",
  "Paid Interest",
  "Health",
  "Date Opened",
  "Time Open",
  "Close Position", // We don't display this text
] as const;

type HideColsUnion =
  | "pool"
  | "side"
  | "amount"
  | "asset"
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
  classNamePaginationContainer?: string;
  queryId: string;
  hideColumns?: HideColsUnion[];
};
const OpenPositionsTable = (props: OpenPositionsTableProps) => {
  const router = useRouter();
  const queryParams = {
    page: pathOr(QS_DEFAULTS.page, ["page"], router.query),
    limit: pathOr(QS_DEFAULTS.limit, ["limit"], router.query),
    orderBy: pathOr(QS_DEFAULTS.orderBy, ["orderBy"], router.query),
    sortBy: pathOr(QS_DEFAULTS.sortBy, ["sortBy"], router.query),
  };
  const openPositionsQuery = useQueryOpenPositions(queryParams);
  const { hideColumns } = props;
  const headers = OPEN_POSITIONS_HEADER_ITEMS;

  if (openPositionsQuery.isSuccess) {
    const { results, pagination } = openPositionsQuery.data;

    return (
      <>
        <div
          className={clsx(
            "flex flex-row bg-gray-800 items-center",
            props.classNamePaginationContainer,
          )}
        >
          {openPositionsQuery.isRefetching && <PillUpdating />}
          <PaginationShowItems
            limit={Number(pagination.limit)}
            page={Number(pagination.page)}
            total={Number(pagination.total)}
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
                      hidden={hideColumns?.includes(itemKey as HideColsUnion)}
                    >
                      {itemKey === "closePosition" ? null : (
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
                      )}
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
                    <td
                      className="px-4 py-3"
                      hidden={hideColumns?.includes("pool")}
                    >
                      {item.pool}
                    </td>
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
                    <td className="px-4 py-3">{item.asset}</td>
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
                    <td className="px-4 py-3">
                      {formatNumberAsDecimal(Number(item.health))}
                    </td>
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
