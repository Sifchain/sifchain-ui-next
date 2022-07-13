import type { NextPage } from "next";

import { Slug } from "~/components/Slug";

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
];

const Trade: NextPage = () => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto overflow-scroll w-full text-left text-xs">
        <thead className="bg-gray-800">
          <tr className="text-gray-400">
            {OPEN_POSITIONS_HEADER_ITEMS.map((title) => {
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
            <td className="px-4 py-3">ETH / ROWAN</td>
            <td className="px-4 py-3">
              <Slug color="green" title="Long" />
            </td>
            <td className="px-4 py-3">5.00000000</td>
            <td className="px-4 py-3">2x</td>
            <td className="px-4 py-3">&ndash;</td>
            <td className="px-4 py-3">
              <Slug color="green" title="0.002 (0.0%)" />
            </td>
            <td className="px-4 py-3">&ndash;</td>
            <td className="px-4 py-3">&ndash;</td>
            <td className="px-4 py-3">&ndash;</td>
            <td className="px-4 py-3">Close</td>
            <td className="px-4 py-3">&ndash;</td>
            <td className="px-4 py-3">&ndash;</td>
            <td className="px-4 py-3">&ndash;</td>
          </tr>
          <tr>
            <td className="px-4 py-3">ETH / ROWAN</td>
            <td className="px-4 py-3">
              <Slug color="red" title="Short" />
            </td>
            <td className="px-4 py-3">5.00000000</td>
            <td className="px-4 py-3">2x</td>
            <td className="px-4 py-3">&ndash;</td>
            <td className="px-4 py-3">
              <Slug color="red" title="-0.002 (0.0%)" />
            </td>
            <td className="px-4 py-3">&ndash;</td>
            <td className="px-4 py-3">&ndash;</td>
            <td className="px-4 py-3">&ndash;</td>
            <td className="px-4 py-3">Close</td>
            <td className="px-4 py-3">&ndash;</td>
            <td className="px-4 py-3">&ndash;</td>
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
        colSpan={OPEN_POSITIONS_HEADER_ITEMS.length}
        className="text-gray-400 text-center p-20"
      >
        You have no open positions.
      </td>
    </tr>
  );
}

export default Trade;
