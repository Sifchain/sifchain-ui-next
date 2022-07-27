import { useMemo } from "react";
import { formatDistance, formatRelative } from "date-fns";
import clsx from "clsx";

import { formatNumberAsCurrency } from "@sifchain/ui";

import { NoResultsRow } from "./NoResultsRow";

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
  return (slug.charAt(0).toLowerCase() + slug.slice(1)) as HideColsUnion;
}

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
  hideCols?: HideColsUnion[];
  rows: {
    id: string;
    pool: string;
    side: string;
    asset: string;
    amount: string;
    baseLeverage: string;
    unrealizedPL: string;
    interestRate: string;
    unsettledInterest: string;
    nextPayment: Date;
    paidInterest: string;
    health: string;
    dateOpened: Date;
    timeOpen: Date;
  }[];
};

const OpenPositionsTable = (props: OpenPositionsTableProps) => {
  const { hideCols } = props;
  const headers = useMemo(() => OPEN_POSITIONS_HEADER_ITEMS, []);

  return (
    <div className="overflow-x-auto">
      <table className="table-auto overflow-scroll w-full text-left text-xs whitespace-nowrap">
        <thead className="bg-gray-800">
          <tr className="text-gray-400">
            {headers.map((title) => {
              const itemKey = fromColNameToItemKey(title);
              return (
                <th
                  key={itemKey}
                  data-item-key={itemKey}
                  className="font-normal px-4 py-3"
                  hidden={hideCols?.includes(itemKey)}
                >
                  {title}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="bg-gray-850">
          {props.rows.length <= 0 && (
            <NoResultsRow
              colSpan={headers.length}
              message="You have no open positions."
            />
          )}
          {props.rows.map((item) => {
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
                  hidden={hideCols?.includes("unsettledInterest")}
                >
                  {item.unsettledInterest}
                </td>
                <td
                  className="px-4 py-3"
                  hidden={hideCols?.includes("nextPayment")}
                >
                  {item.nextPayment.toISOString()}
                </td>
                <td
                  className="px-4 py-3"
                  hidden={hideCols?.includes("paidInterest")}
                >
                  {item.paidInterest}
                </td>
                <td className="px-4 py-3">{item.health}</td>
                <td className="px-4 py-3">
                  {formatDateRelative(item.dateOpened)}
                </td>
                <td className="px-4 py-3">
                  {formatDateDistance(item.timeOpen)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OpenPositionsTable;
