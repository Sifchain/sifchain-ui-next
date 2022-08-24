import type { IAsset } from "@sifchain/common";
import type { useEnhancedPoolsQuery } from "~/domains/clp";

import clsx from "clsx";
import { formatNumberAsCurrency, TokenEntry, TokenSelector as BaseTokenSelector, Tooltip } from "@sifchain/ui";

import { formatNumberAsPercent } from "./_intl";
import { removeFirstCharsUC } from "./_trade";

type NoResultsTrProps = {
  colSpan: number;
};
export function NoResultsRow(props: NoResultsTrProps) {
  return (
    <tr>
      <td colSpan={props.colSpan} className="p-20 text-center text-gray-400">
        No results for your wallet address.
      </td>
    </tr>
  );
}

type PaginationShowItemsProps = {
  limit: number;
  offset: number;
  total: number;
};
export function PaginationShowItems({ limit, offset, total }: PaginationShowItemsProps) {
  const initial = offset + limit;
  return (
    <p className="mx-4 py-3 text-sm">
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
  render: (_page: number) => React.ReactNode;
};
export function PaginationButtons({ pages, render }: PaginationButtonsProps) {
  return (
    <ul className="mx-4 flex flex-row text-sm">
      {Array.from({ length: pages }, (_, index) => {
        const page = ++index;
        return (
          <li key={index} className="flex flex-1 flex-col">
            {render(page)}
          </li>
        );
      })}
    </ul>
  );
}

export function PillUpdating() {
  return <span className="rounded bg-yellow-600 px-4 py-1 text-xs text-yellow-200">Updating...</span>;
}

const TOOLTIP_POOL_HEALTH_TITLE = `What does "Pool health" means?`;
const TOOLTIP_POOL_HEALTH_CONTENT =
  "Pool health is defined by taking total assets divided by all assets + outstanding liabilities. This health equation considers assets and liabilities held for both sides of the pool. The value can range from 0 to 100%. With a value of 100% the pool has no outstanding liabilities.";
type PoolOverviewProps = {
  pool: Exclude<ReturnType<typeof useEnhancedPoolsQuery>["data"], undefined>[0];
  assets: IAsset[];
  rowanPriceUsd: number;
  onChangePoolSelector: (_token: TokenEntry) => void;
};
export function PoolOverview(props: PoolOverviewProps) {
  const poolTVL = props.pool.stats.poolTVL || 0;
  const poolTVL24hChange = props.pool.stats.tvl_24h_change || 0;
  const volume = props.pool.stats.volume || 0;
  const volume24hChange = props.pool.stats.volume_24h_change || 0;
  const health = props.pool.stats.health || 0;
  const rowan24hChange = props.pool.stats.rowan_24h_change || 0;
  const asset24hChange = props.pool.stats.asset_24h_change || 0;

  return (
    <ul className="grid grid-cols-7 gap-5">
      <li className="col-span-2 py-4 pl-4">
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
          <span className="text-sm font-semibold">
            <span className="mr-1">{formatNumberAsCurrency(poolTVL)}</span>
            <Average24hPercent value={poolTVL24hChange} />
          </span>
        </div>
      </li>
      <li className="py-4">
        <div className="flex flex-col">
          <span className="text-gray-300">Pool Volume</span>
          <span className="text-sm font-semibold">
            <span className="mr-1">{formatNumberAsCurrency(volume)}</span>
            <Average24hPercent value={volume24hChange} />
          </span>
        </div>
      </li>
      <li className="py-4">
        <div className="flex flex-col">
          <span className="text-gray-300">ROWAN Price</span>
          <span className="text-sm font-semibold">
            <span className="mr-1">{formatNumberAsCurrency(props.rowanPriceUsd, 4)}</span>
            <Average24hPercent value={rowan24hChange} />
          </span>
        </div>
      </li>
      <li className="py-4">
        <div className="flex flex-col">
          <span className="text-gray-300">{removeFirstCharsUC(props.pool.asset.label as string)} Price</span>
          <span className="text-sm font-semibold">
            <span className="mr-1">
              <span className="mr-1">{formatNumberAsCurrency(Number(props.pool.stats.priceToken))}</span>
            </span>
            <Average24hPercent value={asset24hChange} />
          </span>
        </div>
      </li>
      <li className="py-4">
        <div className="flex flex-col">
          <span className="flex flex-row items-center text-gray-300">
            <span className="mr-1">Pool Health</span>
            <Tooltip title={TOOLTIP_POOL_HEALTH_TITLE} content={TOOLTIP_POOL_HEALTH_CONTENT}>
              <span className="inline-flex h-[16px] w-[16px] items-center justify-center rounded-full border border-current font-serif text-[10px]">
                i
              </span>
            </Tooltip>
          </span>
          <span className="text-sm font-semibold">{formatNumberAsPercent(health)}</span>
        </div>
      </li>
    </ul>
  );
}

function Average24hPercent({ value }: { value: number }) {
  const sign = Math.sign(value);
  const cls = clsx({
    "text-green-400": sign === 1,
    "text-red-400": sign === -1,
    "text-cyan-400": sign === 0,
  });
  return <span className={cls}>({formatNumberAsPercent(value)})</span>;
}
