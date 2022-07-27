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

export type HistoryTableProps = {
  rows: {
    id: string;
    dateClosed: Date;
    timeOpen: Date;
    pool: string;
    side: string;
    asset: string;
    amount: string;
    realizedPL: string;
  }[];
};

const HistoryTable = (props: HistoryTableProps) => {
  const headers = useMemo(() => HISTORY_HEADER_ITEMS, []);

  return (
    <div className="overflow-x-auto">
      <table className="table-auto overflow-scroll w-full text-left text-xs whitespace-nowrap">
        <thead className="bg-gray-800">
          <tr className="text-gray-400">
            {headers.map((title) => {
              return (
                <th key={title} className="font-normal px-4 py-3">
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
              message="History not available. Try again later."
            />
          )}
          {props.rows.map((item) => {
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
                <td>{item.asset}</td>
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
  );
};

export default HistoryTable;
