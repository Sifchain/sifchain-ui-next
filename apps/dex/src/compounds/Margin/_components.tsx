import type { IAsset } from "@sifchain/common";
import type { useEnhancedPoolsQuery } from "~/domains/clp";

import Link from "next/link";
import { useRouter } from "next/router";

import clsx from "clsx";
import {
  ArrowDownIcon,
  ChartIcon,
  ExternalLink,
  formatNumberAsCurrency,
  formatNumberAsDecimal,
  TokenEntry,
  TokenSelector as BaseTokenSelector,
} from "@sifchain/ui";

import { TooltipInterestRate, TooltipLiquidationThreshold, TooltipPoolHealth } from "./tooltips";

import { formatNumberAsPercent } from "./_intl";
import { removeFirstCharsUC, HtmlUnicode } from "./_trade";
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
  page: number;
  renderItem: (page: number) => React.ReactNode;
  renderFirst: () => React.ReactNode;
  renderLast: () => React.ReactNode;
};
export function PaginationButtons({ pages, page, renderItem, renderFirst, renderLast }: PaginationButtonsProps) {
  const buttonsLimit = 3;
  const items = Array.from({ length: pages }, (_, index) => ++index);
  const isAboveLimit = pages > buttonsLimit;

  let head = page === 0 ? 0 : page - 1;
  let tail = head + buttonsLimit;

  const isFirst = head + 2 >= buttonsLimit;
  const isLast = tail >= pages;

  if (tail - 1 === pages) {
    head = head - 1;
  }

  const results = isAboveLimit ? items.slice(head, tail) : items;
  return (
    <ul className="mx-4 flex flex-row place-items-center text-xs">
      {isFirst ? <li className="mr-1 flex flex-1 flex-col">{renderFirst()}</li> : null}
      {results.map((page) => {
        return (
          <li key={page} className="mx-1 flex flex-1 flex-col">
            {renderItem(page)}
          </li>
        );
      })}
      {isAboveLimit && !isLast ? <li className="ml-1 flex flex-1 flex-col">{renderLast()}</li> : null}
    </ul>
  );
}
type PaginationContainerProps = {
  pagination: {
    limit: string;
    offset: string;
    total: string;
  };
};
export function PaginationContainer({ pagination }: PaginationContainerProps) {
  const router = useRouter();
  const paginationLimit = Number(pagination.limit);
  const paginationOffset = Number(pagination.offset);
  const paginationTotal = Number(pagination.total);
  const pages = Math.ceil(paginationTotal / paginationLimit);
  const page = paginationOffset / paginationLimit;
  const classNamePaginationItem = "rounded py-1 px-2";

  return (
    <>
      <PaginationShowItems limit={paginationLimit} offset={paginationOffset} total={paginationTotal} />
      <PaginationButtons
        pages={pages}
        page={page}
        renderFirst={() => (
          <Link href={{ query: { ...router.query, offset: 0 } }} scroll={false}>
            <a className="mr-1">First</a>
          </Link>
        )}
        renderLast={() => (
          <Link
            href={{
              query: { ...router.query, offset: paginationTotal - paginationLimit },
            }}
            scroll={false}
          >
            <a className="ml-1">Last</a>
          </Link>
        )}
        renderItem={(page) => {
          const offset = String(paginationLimit * page - paginationLimit);
          return (
            <Link href={{ query: { ...router.query, offset } }} scroll={false}>
              <a
                className={clsx(classNamePaginationItem, {
                  "bg-gray-400": pagination.offset === offset,
                })}
              >
                {page}
              </a>
            </Link>
          );
        }}
      />
    </>
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
  const marginApr = props.pool.stats.margin_apr;

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
        <ExternalLink href="/margin" className="mt-4 flex flex-row items-center justify-end underline hover:opacity-50">
          <span className="mr-1">Open Charts</span>
          <ChartIcon width={18} height={18} />
        </ExternalLink>
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
          <span className="flex flex-row items-center text-gray-300">Margin APR</span>
          {marginApr ? (
            <span className="text-sm font-semibold">{formatNumberAsDecimal(marginApr)}</span>
          ) : (
            <HtmlUnicode name="EmDash" />
          )}
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
        "flex items-center rounded-lg border border-gray-700 py-2 px-4 text-base font-semibold",
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
      <div className="flex items-center justify-between px-[18px] text-xs">
        <span>{heading[0]}</span>
        <span className="tabular-nums">{heading[1]}</span>
      </div>
      {details && (
        <ul className="border-gray-750 ml-4 grid gap-3 border-l-2 px-4 text-xs">
          {details.map(([label, value], i) => (
            <li key={i} className="flex items-center justify-between text-gray-300">
              <span>{label}</span>
              <span className="tabular-nums">{value}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export const TradeReviewSeparator = ({ className = "" }) => (
  <div className="relative my-[-1em] flex items-center justify-center">
    <div className={clsx("border-gray-750 rounded-full border-2 bg-gray-900 p-3", className)}>
      <ArrowDownIcon className="text-lg" />
    </div>
  </div>
);
