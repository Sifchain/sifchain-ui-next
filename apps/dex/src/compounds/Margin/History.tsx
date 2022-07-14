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
            <td className="px-4 py-3">07-05 11:23:51 AM</td>
            <td className="px-4 py-3">ETH / ROWAN</td>
            <td className="px-4 py-3">
              <Slug color="green" title="Long" />
            </td>
            <td className="px-4 py-3">5.00000000</td>
            <td>2x</td>
            <td className="px-4 py-3">
              <Slug color="green" title="0.002 (0.0%)" />
            </td>
            <td className="px-4 py-3">&ndash;</td>
          </tr>
          <tr>
            <td className="px-4 py-3">07-05 11:23:51 AM</td>
            <td className="px-4 py-3">ETH / ROWAN</td>
            <td className="px-4 py-3">
              <Slug color="red" title="Short" />
            </td>
            <td className="px-4 py-3">5.00000000</td>
            <td>2x</td>
            <td className="px-4 py-3">
              <Slug color="red" title="-0.002 (0.0%)" />
            </td>
            <td className="px-4 py-3">&ndash;</td>
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
