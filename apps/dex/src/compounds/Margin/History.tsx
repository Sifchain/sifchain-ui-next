import { Slug } from "~/components/Slug";

const HISTORY_HEADER_ITEMS = [
  "Date closed",
  "Time open",
  "Pool",
  "Side",
  "Asset",
  "Amount",
  "Realized P&L",
];

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
          <tr>
            <td className="px-4 py-3">2022-07-12</td>
            <td className="px-4 py-3">2 days, 5 hrs, 2 mins</td>
            <td className="px-4 py-3">ETH / ROWAN</td>
            <td className="px-4 py-3">
              <Slug color="green" title="Long" />
            </td>
            <td>ETH</td>
            <td className="px-4 py-3">2.5</td>
            <td className="px-4 py-3">
              <Slug color="green" title="$2,000.15" />
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3">2022-07-12</td>
            <td className="px-4 py-3">2 days, 5 hrs, 2 mins</td>
            <td className="px-4 py-3">ETH / ROWAN</td>
            <td className="px-4 py-3">
              <Slug color="red" title="Short" />
            </td>
            <td>ETH</td>
            <td className="px-4 py-3">2.5</td>
            <td className="px-4 py-3">
              <Slug color="red" title="-$2,000.15" />
            </td>
          </tr>
          <NoResultsTr />
        </tbody>
      </table>
    </div>
  );
};

function NoResultsTr() {
  return (
    <tr>
      <td
        colSpan={HISTORY_HEADER_ITEMS.length}
        className="text-gray-400 text-center p-20"
      >
        History not available. Try again later.
      </td>
    </tr>
  );
}

export default HistoryTable;
