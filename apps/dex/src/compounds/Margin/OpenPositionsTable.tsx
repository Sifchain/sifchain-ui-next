import { NoResultsRow } from "./NoResultsRow";

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

export type HideColsUnion =
  | "pool"
  | "side"
  | "asset"
  | "amount"
  | "base-leverage"
  | "unrealized-p-l"
  | "interest-rate"
  | "unsettled-interest"
  | "next-payment"
  | "paid-interest"
  | "health"
  | "date-opened"
  | "time-open";
type OpenPositionsTableProps = {
  hideCols?: HideColsUnion[];
};

const items = Array.from({ length: 200 }, (_, index) => index + 1);
const OpenPositionsTable = (props: OpenPositionsTableProps) => {
  const { hideCols } = props;
  let cols = [...OPEN_POSITIONS_HEADER_ITEMS];

  if (typeof hideCols !== "undefined") {
    cols = cols.filter((col) => {
      const itemKey = fromColNameToItemKey(col);
      if (hideCols.includes(itemKey)) {
        return false;
      }
      return true;
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-auto overflow-scroll w-full text-left text-xs">
        <thead className="bg-gray-800">
          <tr className="text-gray-400">
            {cols.map((title) => {
              const itemKey = fromColNameToItemKey(title);
              return (
                <th
                  key={itemKey}
                  data-item-key={itemKey}
                  className="font-normal px-4 py-3"
                >
                  {title}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="bg-gray-850">
          {items.map((item) => {
            return (
              <tr key={item}>
                <td className="px-4 py-3">ETH</td>
                <td className="px-4 py-3">
                  <span className="text-green-400">Long</span>
                </td>
                <td className="px-4 py-3">ETH</td>
                <td className="px-4 py-3">2.5</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-2 bg-gray-800 rounded">1.9x</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-green-400">$2,000.15</span>
                </td>
                <td className="px-4 py-3">18.52%</td>
                <td className="px-4 py-3">$10.25</td>
                <td className="px-4 py-3">2 hrs, 5 mins</td>
                <td className="px-4 py-3">$80.15</td>
                <td className="px-4 py-3" hidden={Boolean(hideCols)}>
                  &ndash;
                </td>
                <td className="px-4 py-3" hidden={Boolean(hideCols)}>
                  2022-07-12
                </td>
                <td className="px-4 py-3" hidden={Boolean(hideCols)}>
                  5 hrs
                </td>
              </tr>
            );
          })}
          <tr>
            <td className="px-4 py-3">ETH</td>
            <td className="px-4 py-3">
              <span className="text-red-400">Short</span>
            </td>
            <td className="px-4 py-3">ETH</td>
            <td className="px-4 py-3">2.5</td>
            <td className="px-4 py-3">
              <span className="px-2 py-2 bg-gray-800 rounded">1.9x</span>
            </td>
            <td className="px-4 py-3">
              <span className="text-red-400">-$2,000.15</span>
            </td>
            <td className="px-4 py-3">18.52%</td>
            <td className="px-4 py-3">$10.25</td>
            <td className="px-4 py-3">2 hrs, 5 mins</td>
            <td className="px-4 py-3">$80.15</td>
            <td className="px-4 py-3" hidden={Boolean(hideCols)}>
              &ndash;
            </td>
            <td className="px-4 py-3" hidden={Boolean(hideCols)}>
              2022-07-12
            </td>
            <td className="px-4 py-3" hidden={Boolean(hideCols)}>
              5 hrs
            </td>
          </tr>
          <NoResultsRow
            colSpan={cols.length}
            message="You have no open positions."
          />
        </tbody>
      </table>
    </div>
  );
};

function fromColNameToItemKey(name: string) {
  return name.toLocaleLowerCase().replace(/[^a-z]+/g, "-") as HideColsUnion;
}

export default OpenPositionsTable;
