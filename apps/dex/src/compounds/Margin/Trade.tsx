import type { NextPage } from "next";

import { Slug } from "~/components/Slug";

const Trade: NextPage = () => {
  return (
    <>
      <section className="p-4 grid grid-cols-7 gap-x-5 justify-items-end text-xs">
        <ul className="col-span-2 w-full flex flex-col">
          <li className="text-gray-300 pb-2">Pool Overview</li>
          <li className="flex-1 flex items-center">
            <select className="flex-1 text-xs bg-gray-700 rounded border-0">
              <option>ETH / ROWAN</option>
            </select>
          </li>
        </ul>
        <ul className="flex flex-col">
          <li className="text-gray-300 pb-2">Pool</li>
          <li className="flex-1 flex items-center font-semibold">
            $100,000,000
          </li>
        </ul>
        <ul className="flex flex-col">
          <li className="text-gray-300 pb-2">ETH/ROWAN Volume</li>
          <li className="flex-1 flex items-center font-semibold">$2,000,000</li>
        </ul>
        <ul className="flex flex-col">
          <li className="text-gray-300 pb-2">ETH Price</li>
          <li className="flex-1 flex items-center font-semibold">
            <span className="mr-2">$1,000</span>
            <Slug color="green" title={`(-1.3%)`} />
          </li>
        </ul>
        <ul className="flex flex-col">
          <li className="text-gray-300 pb-2">ROWAN Price</li>
          <li className="flex-1 flex items-center font-semibold">
            <span className="mr-2">$.006</span>
            <Slug color="red" title={`(+2.3%)`} />
          </li>
        </ul>
        <ul className="flex flex-col">
          <li className="text-gray-300 pb-2">Pool Health</li>
          <li className="flex-1 flex items-center font-semibold">&ndash;</li>
        </ul>
      </section>
      <section className="p-4 grid grid-cols-2 gap-x-6 text-xs"></section>
    </>
  );
};

export default Trade;
