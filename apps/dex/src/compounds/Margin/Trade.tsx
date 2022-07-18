import type { NextPage } from "next";

import { Button, TwinRadioGroup } from "@sifchain/ui";

import TokenSelector from "~/compounds/TokenSelector";
import OpenPositionsTable from "~/compounds/Margin/OpenPositions";

const Trade: NextPage = () => {
  return (
    <>
      <section className="bg-gray-800 border border-gold-800 rounded p-4 mt-4 grid grid-cols-7 gap-x-5 justify-items-end text-xs">
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
            <span className="text-red-400">(-1.3%)</span>
          </li>
        </ul>
        <ul className="flex flex-col">
          <li className="text-gray-300 pb-2">ROWAN Price</li>
          <li className="flex-1 flex items-center font-semibold">
            <span className="mr-2">$.006</span>
            <span className="text-green-400">(+2.3%)</span>
          </li>
        </ul>
        <ul className="flex flex-col">
          <li className="text-gray-300 pb-2">Pool Health</li>
          <li className="flex-1 flex items-center font-semibold">&ndash;</li>
        </ul>
      </section>
      <section className="mt-4 text-xs grid grid-cols-7 gap-x-2">
        <aside className="bg-gray-800 border border-gold-800 rounded col-span-2 flex flex-col">
          <ul className="border-b border-gold-800 flex flex-col gap-4 p-4">
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
          <ul className="border-b border-gold-800 flex flex-col gap-0 p-4">
            <li className="flex flex-col">
              <span className="text-xs text-gray-300 mb-1">Collateral</span>
              <div className="grid grid-cols-2 gap-2">
                <TokenSelector
                  modalTitle="Collateral"
                  value={"rowan"}
                  onChange={(token) => console.log(token)}
                  size="xs"
                  buttonClassName="border-none rounded"
                />
                <input
                  type="text"
                  defaultValue="100,000"
                  className="text-right text-xs bg-gray-700 rounded border-0"
                />
              </div>
              <span className="text-gray-200 text-right mt-1">
                &#61; $1,000
              </span>
            </li>
            <li className="flex flex-col">
              <span className="text-xs text-gray-300 mb-1">Position</span>
              <div className="grid grid-cols-2 gap-2">
                <TokenSelector
                  modalTitle="Position"
                  value={"ceth"}
                  onChange={(token) => console.log(token)}
                  size="xs"
                  buttonClassName="border-none rounded"
                  readonly
                />
                <input
                  type="text"
                  defaultValue="1"
                  className="text-right text-xs bg-gray-700 rounded border-0"
                />
              </div>
              <span className="text-gray-200 text-right mt-1">
                &#61; $2,000
              </span>
            </li>
            <li className="mt-2 grid grid-cols-6 gap-2">
              <TwinRadioGroup
                className="col-span-3 self-end"
                name="margin-side"
                options={[
                  {
                    title: "Long",
                    value: "long",
                  },
                  {
                    title: "Short",
                    value: "short",
                  },
                ]}
              />
              <div className="col-span-3 flex flex-col">
                <span className="text-xs text-gray-300 mb-1">
                  <span className="mr-1">Leverage</span>
                  <span className="text-gray-400">Up to 2x</span>
                </span>
                <input
                  type="text"
                  defaultValue="2x"
                  className="text-xs bg-gray-700 rounded border-0"
                />
              </div>
            </li>
          </ul>
          <div className="p-4">
            <ul className="bg-gray-850 flex flex-col gap-3 p-4 rounded-lg">
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
                <p className="text-gray-400 text-xs w-full text-right">
                  1.9 ETH
                </p>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-4 gap-2 px-4 pb-4">
            <Button
              variant="tertiary"
              as="button"
              size="sm"
              className="text-gray-300 font-normal self-center"
            >
              Reset
            </Button>
            <Button
              variant="primary"
              as="button"
              size="md"
              className="col-span-3 rounded"
            >
              Place buy order
            </Button>
          </div>
        </aside>
        <section className="col-span-5 rounded border border-gold-800">
          <OpenPositionsTable
            hideCols={["unsettled-interest", "next-payment", "paid-interest"]}
          />
        </section>
      </section>
    </>
  );
};

export default Trade;
