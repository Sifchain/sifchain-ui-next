import type { NextPage } from "next";

import { Button } from "@sifchain/ui";
import { Slug } from "~/components/Slug";
import OpenPositionsTable from "~/compounds/Margin/OpenPositions";

const Trade: NextPage = () => {
  return (
    <>
      <section className="box-golden-border rounded p-4 mt-4 grid grid-cols-7 gap-x-5 justify-items-end text-xs">
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
            <Slug color="red" title={`(-1.3%)`} />
          </li>
        </ul>
        <ul className="flex flex-col">
          <li className="text-gray-300 pb-2">ROWAN Price</li>
          <li className="flex-1 flex items-center font-semibold">
            <span className="mr-2">$.006</span>
            <Slug color="green" title={`(+2.3%)`} />
          </li>
        </ul>
        <ul className="flex flex-col">
          <li className="text-gray-300 pb-2">Pool Health</li>
          <li className="flex-1 flex items-center font-semibold">&ndash;</li>
        </ul>
      </section>
      <section className="mt-4 text-xs grid grid-cols-7 gap-x-2">
        <aside className="box-golden-border rounded p-4 col-span-2 flex flex-col">
          <ul className="box-golden-border-bottom pb-4 flex flex-col gap-4">
            <li>
              <div className="flex flex-row">
                <span className="font-semibold mr-auto min-w-fit">
                  Account Balance
                </span>
                <span>$50,000 &rarr; $49,000</span>
              </div>
            </li>
            <li>
              <div className="flex flex-row">
                <span className="font-semibold mr-auto min-w-fit">
                  Collateral Balance
                </span>
                <span>$5,000 &rarr; $4,000</span>
              </div>
              <p className="text-gray-400 text-xs w-full text-right">
                40,000 ROWAN &rarr; 40,000 ROWAN
              </p>
            </li>
            <li>
              <div className="flex flex-row">
                <span className="font-semibold mr-auto min-w-fit">
                  Total Borrowed
                </span>
                <span>$10,000 &rarr; $11,000</span>
              </div>
              <p className="text-gray-400 text-xs w-full text-right">
                100,000 ROWAN &rarr; 100,000 ROWAN
              </p>
            </li>
          </ul>
          <ul className="box-golden-border-bottom py-4 flex flex-col gap-4">
            <li className="flex flex-col">
              <span className="text-xs text-gray-300 mb-1">Collateral</span>
              <div className="grid grid-cols-2 gap-2">
                <select className="text-xs bg-gray-700 rounded border-0">
                  <option>ROWAN</option>
                </select>
                <input
                  type="text"
                  defaultValue="100,000"
                  className="text-xs bg-gray-700 rounded border-0"
                />
              </div>
              <span className="text-gray-200 text-right mt-1">
                &#61; $1,000
              </span>
            </li>
            <li className="flex flex-col">
              <span className="text-xs text-gray-300 mb-1">Position</span>
              <div className="grid grid-cols-2 gap-2">
                <select className="text-xs bg-gray-700 rounded border-0">
                  <option>ETH</option>
                </select>
                <input
                  type="text"
                  defaultValue="1"
                  className="text-xs bg-gray-700 rounded border-0"
                />
              </div>
              <span className="text-gray-200 text-right mt-1">
                &#61; $2,000
              </span>
            </li>
            <li className="flex flex-col">
              <span className="text-xs text-gray-300 mb-1">
                <span className="mr-1">Leverage</span>
                <span className="text-gray-400">Up to 2x</span>
              </span>
              <div className="grid grid-cols-6 gap-2">
                <input
                  type="text"
                  defaultValue="2x"
                  className="text-xs bg-gray-700 rounded border-0 col-span-3"
                />
                <Button variant="secondary" as="button" size="xs">
                  1x
                </Button>
                <Button variant="secondary" as="button" size="xs">
                  1.5x
                </Button>
                <Button variant="secondary" as="button" size="xs">
                  2x
                </Button>
              </div>
              <div className="grid grid-cols-2 font-semibold mt-2">
                <label
                  htmlFor="inputSideLong"
                  className="flex flex-row cursor-pointer"
                >
                  <input
                    type="radio"
                    id="inputSideLong"
                    name="marginSide"
                    className="sr-only"
                    defaultChecked={true}
                  />
                  <span className="flex-1 text-center p-2 rounded-tl rounded-bl">
                    Long
                  </span>
                </label>
                <label
                  htmlFor="inputSideShort"
                  className="flex flex-row cursor-pointer"
                >
                  <input
                    type="radio"
                    id="inputSideShort"
                    name="marginSide"
                    className="sr-only"
                  />
                  <span className="flex-1 text-center p-2 rounded-tr rounded-br">
                    Short
                  </span>
                </label>
              </div>
            </li>
          </ul>
          <ul className="pt-4 flex flex-col gap-4">
            <li>
              <div className="flex flex-row">
                <span className="font-semibold mr-auto min-w-fit">
                  Collateral Balance
                </span>
                <span>$1,000 </span>
              </div>
              <p className="text-gray-400 text-xs w-full text-right">
                50,000 ROWAN
              </p>
            </li>
            <li>
              <div className="flex flex-row">
                <span className="font-semibold mr-auto min-w-fit">
                  Borrow Amount
                </span>
                <span>$1,000</span>
              </div>
              <p className="text-gray-400 text-xs w-full text-right">
                100,000 ROWAN
              </p>
            </li>
            <li>
              <div className="flex flex-row">
                <span className="font-semibold mr-auto min-w-fit">
                  Overall Position
                </span>
                <span>$2,000</span>
              </div>
              <p className="text-gray-400 text-xs w-full text-right">2ETH</p>
            </li>
            <li>
              <div className="flex flex-row">
                <span className="font-semibold mr-auto min-w-fit">
                  Trade Fees
                </span>
                <span>&minus;$50</span>
              </div>
              <p className="text-gray-400 text-xs w-full text-right">
                .0005 ETH
              </p>
            </li>
            <li>
              <div className="flex flex-row">
                <span className="font-semibold mr-auto min-w-fit">
                  Resulting Position
                </span>
                <span>$1,900</span>
              </div>
              <p className="text-gray-400 text-xs w-full text-right">1.9 ETH</p>
            </li>
            <li className="grid grid-cols-4 gap-2">
              <Button
                variant="primary"
                as="button"
                size="md"
                className="col-span-3 rounded"
              >
                Place buy order
              </Button>
              <Button
                variant="outline"
                as="button"
                size="sm"
                className="ring-1 rounded self-center"
              >
                Clear
              </Button>
            </li>
          </ul>
        </aside>
        <section className="col-span-5 rounded-tl rounded-tr">
          <OpenPositionsTable
            hideCols={["unsettled-interest", "next-payment", "paid-interest"]}
          />
        </section>
      </section>
    </>
  );
};

export default Trade;
