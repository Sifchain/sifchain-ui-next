import { NoResultsRow } from "./NoResultsRow";

const HISTORY_HEADER_ITEMS = [
  "Date Closed",
  "Time Open",
  "Pool",
  "Side",
  "Asset",
  "Amount",
  "Realized P&L",
];

const items = Array.from({ length: 200 }, (_, index) => index + 1);
const HistoryTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto overflow-scroll w-full text-left text-xs">
        <thead className="bg-gray-800">
          <tr className="text-gray-400">
            {HISTORY_HEADER_ITEMS.map((title) => {
              return (
                <th key={title} className="font-normal px-4 py-3">
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
                <td className="px-4 py-3">2022-07-12</td>
                <td className="px-4 py-3">2 days, 5 hrs, 2 mins</td>
                <td className="px-4 py-3">ETH</td>
                <td className="px-4 py-3">
                  <span className="text-green-400">Long</span>
                </td>
                <td>ETH</td>
                <td className="px-4 py-3">2.5</td>
                <td className="px-4 py-3">
                  <span className="text-green-400">$2,000.15</span>
                </td>
              </tr>
            );
          })}
          <tr>
            <td className="px-4 py-3">2022-07-12</td>
            <td className="px-4 py-3">2 days, 5 hrs, 2 mins</td>
            <td className="px-4 py-3">ETH</td>
            <td className="px-4 py-3">
              <span className="text-red-400">Short</span>
            </td>
            <td>ETH</td>
            <td className="px-4 py-3">2.5</td>
            <td className="px-4 py-3">
              <span className="text-red-400">-$2,000.15</span>
            </td>
          </tr>
          <NoResultsRow
            colSpan={HISTORY_HEADER_ITEMS.length}
            message="History not available. Try again later."
          />
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
