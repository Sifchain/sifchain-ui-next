import type { IAsset } from "@sifchain/common";
import type { useEnhancedPoolsQuery } from "~/domains/clp";

import clsx from "clsx";
import {
  ArrowDownIcon,
  formatNumberAsCurrency,
  formatNumberAsDecimal,
  TokenEntry,
  TokenSelector as BaseTokenSelector,
} from "@sifchain/ui";

import { TooltipInterestRate, TooltipLiquidationThreshold, TooltipPoolHealth } from "./tooltips";

import { formatNumberAsPercent } from "./_intl";
import { removeFirstCharsUC } from "./_trade";
import type { FC, ReactNode } from "react";
import AssetIcon from "../AssetIcon";

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
    <p className="mx-4 py-2 text-xs">
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
    <ul className="mx-4 flex flex-row text-xs">
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

type PoolOverviewProps = {
  pool: Exclude<ReturnType<typeof useEnhancedPoolsQuery>["data"], undefined>[0];
  assets: IAsset[];
  rowanPriceUsd: number;
  onChangePoolSelector: (_token: TokenEntry) => void;
  safetyFactor: number;
  interestRate: string;
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
    <ul className="py-4 lg:grid lg:grid-cols-7 lg:gap-5">
      <li className="2xl:place-self-normal mb-4 px-4 lg:col-span-2 lg:mb-0 lg:w-full lg:place-self-center">
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
      <li className="grid gap-4 px-4 md:grid-cols-3 lg:col-span-5 xl:grid-cols-4">
        <div className="flex flex-col">
          <span className="text-gray-300">Pool TVL</span>
          <span className="text-sm font-semibold">
            <span className="mr-1">{formatNumberAsCurrency(poolTVL)}</span>
            <Average24hPercent value={poolTVL24hChange} />
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-300">24h Trading Volume</span>
          <span className="text-sm font-semibold">
            <span className="mr-1">{formatNumberAsCurrency(volume)}</span>
            <Average24hPercent value={volume24hChange} />
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-300">ROWAN Price</span>
          <span className="text-sm font-semibold">
            <span className="mr-1">{formatNumberAsCurrency(props.rowanPriceUsd, 4)}</span>
            <Average24hPercent value={rowan24hChange} />
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-300">{removeFirstCharsUC(props.pool.asset.label as string)} Price</span>
          <span className="text-sm font-semibold">
            <span className="mr-1">
              <span className="mr-1">{formatNumberAsCurrency(Number(props.pool.stats.priceToken))}</span>
            </span>
            <Average24hPercent value={asset24hChange} />
          </span>
        </div>
        <div className="flex flex-col">
          <span className="flex flex-row items-center text-gray-300">
            <span className="mr-1">Pool Health</span>
            <TooltipPoolHealth />
          </span>
          <span className="text-sm font-semibold">{formatNumberAsPercent(health)}</span>
        </div>
        <div className="flex flex-col">
          <span className="flex flex-row items-center text-gray-300">
            <span className="mr-1">Liquidation Threshold</span>
            <TooltipLiquidationThreshold />
          </span>
          <span className="text-sm font-semibold">{formatNumberAsDecimal(props.safetyFactor)}</span>
        </div>
        <div className="flex flex-col">
          <span className="flex flex-row items-center text-gray-300">
            <span className="mr-1">Interest rate</span>
            <TooltipInterestRate />
          </span>
          <span className="text-sm font-semibold">{props.interestRate}</span>
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

export const TokenDisplaySymbol = ({ symbol = "", className = "" }) => {
  return <span className={clsx("uppercase", className)}>{removeFirstCharsUC(symbol)}</span>;
};

export const AssetHeading: FC<{ symbol: string; className?: string }> = ({ symbol, className }) => {
  return (
    <header
      className={clsx(
        "flex items-center rounded-lg border border-gray-600 py-2 px-4 text-base font-semibold",
        className,
      )}
    >
      <AssetIcon symbol={symbol} network="sifchain" size="sm" />
      <TokenDisplaySymbol symbol={symbol} className="ml-1" />
    </header>
  );
};

type TradeDetailsProps = {
  heading: [ReactNode, ReactNode];
  details?: [ReactNode, ReactNode][];
};

export const TradeDetails: FC<TradeDetailsProps> = ({ heading, details }) => {
  return (
    <>
      <div className="flex items-center justify-between pl-[18px] text-xs">
        <span>{heading[0]}</span>
        <span>{heading[1]}</span>
      </div>
      {details && (
        <ul className="grid gap-3 border-l-2 border-gray-600 pl-4 text-xs">
          {details.map(([label, value], i) => (
            <li key={i} className="flex items-center justify-between text-gray-300">
              <span>{label}</span>
              <span>{value}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export const TradeReviewSeparator: FC = () => (
  <div className="relative my-[-1em] flex items-center justify-center">
    <div className="rounded-full border-2 border-gray-600 bg-gray-900 p-3">
      <ArrowDownIcon className="text-lg" />
    </div>
  </div>
);
