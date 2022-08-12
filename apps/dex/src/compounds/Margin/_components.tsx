import type { IAsset } from "@sifchain/common";
import type { useEnhancedPoolsQuery } from "~/domains/clp";

import {
  formatNumberAsCurrency,
  TokenEntry,
  TokenSelector as BaseTokenSelector,
} from "@sifchain/ui";

import { formatNumberAsDecimal } from "./_intl";

type NoResultsTrProps = {
  colSpan: number;
  message: string;
};
export function NoResultsRow(props: NoResultsTrProps) {
  return (
    <tr>
      <td colSpan={props.colSpan} className="text-gray-400 text-center p-20">
        {props.message}
      </td>
    </tr>
  );
}

type PaginationShowItemsProps = {
  limit: number;
  offset: number;
  total: number;
};
export function PaginationShowItems({
  limit,
  offset,
  total,
}: PaginationShowItemsProps) {
  const initial = offset + limit;
  return (
    <p className="text-sm mx-4 py-3">
      <span>Showing</span>
      <span className="mx-1">{initial > total ? total : initial}</span>
      <span>of</span>
      <span className="mx-1">{total}</span>
      <span>items</span>
    </p>
  );
}

type PaginationButtonsProps = {
  pages: number;
  render: (page: number) => React.ReactNode;
};
export function PaginationButtons({ pages, render }: PaginationButtonsProps) {
  return (
    <ul className="mx-4 flex flex-row text-sm">
      {Array.from({ length: pages }, (_, index) => {
        const page = ++index;
        return (
          <li key={index} className="flex-1 flex flex-col">
            {render(page)}
          </li>
        );
      })}
    </ul>
  );
}

export function PillUpdating() {
  return (
    <span className="bg-yellow-600 text-yellow-200 px-4 py-2 text-xs rounded">
      Updating...
    </span>
  );
}

type PoolOverviewProps = {
  pool: Exclude<ReturnType<typeof useEnhancedPoolsQuery>["data"], undefined>[0];
  assets: IAsset[];
  rowanPriceUsd: number;
  onChangePoolSelector: (token: TokenEntry) => void;
};
export function PoolOverview(props: PoolOverviewProps) {
  const poolTVL = props.pool.stats.poolTVL || 0;
  const volume = props.pool.stats.volume || 0;
  const health = props.pool.stats.health || 0;

  return (
    <ul className="grid grid-cols-7 gap-5">
      <li className="col-span-2 pl-4 py-4">
        <BaseTokenSelector
          textPlaceholder="Search pools"
          modalTitle="Select Pool"
          value={props.pool.asset}
          tokens={props.assets}
          buttonClassName="overflow-hidden text-base h-10 font-semibold"
          hideColumns={["balance"]}
          onChange={props.onChangePoolSelector}
        />
      </li>
      <li className="py-4">
        <div className="flex flex-col">
          <span className="text-gray-300">Pool TVL</span>
          <span className="font-semibold text-sm">
            <span className="mr-1">{formatNumberAsCurrency(poolTVL)}</span>
            <span className="text-green-400">(+2.8%)</span>
          </span>
        </div>
      </li>
      <li className="py-4">
        <div className="flex flex-col">
          <span className="text-gray-300">Pool Volume</span>
          <span className="font-semibold text-sm">
            <span className="mr-1">{formatNumberAsCurrency(volume)}</span>
            <span className="text-green-400">(+2.8%)</span>
          </span>
        </div>
      </li>
      <li className="py-4">
        <div className="flex flex-col">
          <span className="text-gray-300">ROWAN Price</span>
          <span className="font-semibold text-sm">
            <span className="mr-1">
              {formatNumberAsCurrency(props.rowanPriceUsd, 4)}
            </span>
            <span className="text-red-400">(-2.8%)</span>
          </span>
        </div>
      </li>
      <li className="py-4">
        <div className="flex flex-col">
          <span className="text-gray-300">{props.pool.asset.label} Price</span>
          <span className="font-semibold text-sm">
            <span className="mr-1">
              <span className="mr-1">
                {formatNumberAsCurrency(Number(props.pool.stats.priceToken))}
              </span>
            </span>
            <span className="text-red-400">(-1.3%)</span>
          </span>
        </div>
      </li>
      <li className="py-4">
        <div className="flex flex-col">
          <span className="text-gray-300">Pool Health</span>
          <span className="font-semibold text-sm">
            {formatNumberAsDecimal(Number(health))}
          </span>
        </div>
      </li>
    </ul>
  );
}
