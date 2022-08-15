import { useRouter } from "next/router";
import clsx from "clsx";
import Link from "next/link";
import { useState, SyntheticEvent, useCallback } from "react";
import Long from "long";

import { Button, formatNumberAsCurrency, ChevronDownIcon, Modal, ArrowDownIcon, toast } from "@sifchain/ui";

import AssetIcon from "~/compounds/AssetIcon";
import { useOpenPositionsQuery } from "~/domains/margin/hooks/useMarginOpenPositionsQuery";
import { useCloseMTPMutation } from "~/domains/margin/hooks";

import { isNil } from "rambda";
const isTruthy = (target: any) => !isNil(target);

/**
 * ********************************************************************************************
 *
 * `_components`: "Dumb Components" used across Margin. They will be moved to a different place.
 * `_mockdata`: To mock React-Query and fake the Data Services reponses
 * `_intl`: Functions to format data used across Margin. They will be moved to a different place.
 * `_tables`: Constant values, functions to abstract logic, and pagination utilities used across Open Positions and History tables. They will be moved to a different place.
 *
 * ********************************************************************************************
 */
import { NoResultsRow, PaginationShowItems, PaginationButtons, PillUpdating } from "./_components";
import { useQueryPositionToClose, useMutationPositionToClose } from "./_mockdata";
import { formatNumberAsDecimal, formatNumberAsPercent, formatDateRelative, formatDateDistance } from "./_intl";
import { findNextOrderAndSortBy, SORT_BY, MARGIN_POSITION, QS_DEFAULTS } from "./_tables";
import { HtmlUnicode } from "./_trade";

/**
 * ********************************************************************************************
 *
 * OpenPositionsTable Compound
 *
 * ********************************************************************************************
 */
const OPEN_POSITIONS_HEADER_ITEMS = [
  { title: "Pool", order_by: "" },
  { title: "Side", order_by: "position" },
  { title: "Position", order_by: "custody_amount" },
  { title: "Asset", order_by: "custody_asset" },
  { title: "Base Leverage", order_by: "leverage" },
  { title: "Unrealized P&L", order_by: "unrealized_pnl" },
  { title: "Interest Rate", order_by: "interest_rate" },
  { title: "Paid Interest", order_by: "paid_interest" },
  { title: "Health", order_by: "health" },
  { title: "Date Opened", order_by: "date_opened" },
  { title: "Time Open", order_by: "" },
  { title: "Close Position", order_by: "" },
];

type HideColsUnion = typeof OPEN_POSITIONS_HEADER_ITEMS[number]["title"];
export type OpenPositionsTableProps = {
  classNamePaginationContainer?: string;
  walletAddress: string;
  hideColumns?: HideColsUnion[];
};
const OpenPositionsTable = (props: OpenPositionsTableProps) => {
  const { hideColumns, classNamePaginationContainer } = props;
  const headers = OPEN_POSITIONS_HEADER_ITEMS;
  const router = useRouter();
  const queryParams = {
    limit: (router.query["limit"] as string) || QS_DEFAULTS.limit,
    offset: (router.query["offset"] as string) || QS_DEFAULTS.offset,
    orderBy: (router.query["orderBy"] as string) || "custody_amount",
    sortBy: (router.query["sortBy"] as string) || QS_DEFAULTS.sortBy,
  };

  const openPositionsQuery = useOpenPositionsQuery({
    ...queryParams,
    walletAddress: props.walletAddress,
  });

  const [positionToClose, setPositionToClose] = useState<{
    isOpen: boolean;
    id: string;
  }>({
    isOpen: false,
    id: "",
  });

  if (openPositionsQuery.isSuccess) {
    const { results, pagination } = openPositionsQuery.data;
    const pages = Math.ceil(Number(pagination.total) / Number(pagination.limit));

    return (
      <>
        <div className={clsx("flex flex-row items-center bg-gray-800", classNamePaginationContainer)}>
          {openPositionsQuery.isRefetching && <PillUpdating />}
          <PaginationShowItems
            limit={Number(pagination.limit)}
            offset={Number(pagination.offset)}
            total={Number(pagination.total)}
          />
          <PaginationButtons
            pages={pages}
            render={(page) => {
              const offset = String(Number(pagination.limit) * page - Number(pagination.limit));
              return (
                <Link href={{ query: { ...router.query, offset } }} scroll={false}>
                  <a
                    className={clsx("rounded px-2 py-1", {
                      "bg-gray-400": pagination.offset === offset,
                    })}
                  >
                    {page}
                  </a>
                </Link>
              );
            }}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto overflow-scroll whitespace-nowrap text-left text-xs">
            <thead className="bg-gray-800">
              <tr className="text-gray-400">
                {headers.map((header) => {
                  const itemActive = pagination.order_by === header.order_by;
                  const { nextOrderBy, nextSortBy } = findNextOrderAndSortBy({
                    itemKey: header.order_by,
                    itemActive,
                    currentSortBy: pagination.sort_by,
                  });
                  return (
                    <th
                      key={header.title}
                      className="px-4 py-3 font-normal"
                      hidden={hideColumns?.includes(header.title)}
                    >
                      {header.title === "Close Position" ? null : (
                        <Link
                          href={{
                            query: {
                              ...router.query,
                              orderBy: nextOrderBy,
                              sortBy: nextSortBy,
                            },
                          }}
                          scroll={false}
                        >
                          <a
                            className={clsx("flex flex-row items-center", {
                              "font-semibold text-white": itemActive,
                              "cursor-not-allowed": header.order_by === "",
                            })}
                          >
                            {header.title}
                            {itemActive && (
                              <ChevronDownIcon
                                className={clsx("ml-1 transition-transform", {
                                  "-rotate-180": pagination.sort_by === SORT_BY.ASC,
                                })}
                              />
                            )}
                          </a>
                        </Link>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-gray-850">
              {results.length <= 0 && <NoResultsRow colSpan={headers.length} message="You have no open positions." />}
              {results.map((item) => {
                const amountSign = Math.sign(Number(item.custody_amount));
                const unrealizedPLSign = Math.sign(Number(item.unrealized_pnl));

                return (
                  <tr key={item.id}>
                    <td className="px-4 py-3" hidden={hideColumns?.includes("Pool")}>
                      {isTruthy(item.pool) ? item.pool : <HtmlUnicode name="EmDash" />}
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.position) ? (
                        <span
                          className={clsx({
                            "text-cyan-400": item.position === MARGIN_POSITION.UNSPECIFIED,
                            "text-green-400": item.position === MARGIN_POSITION.LONG,
                            "text-red-400": item.position === MARGIN_POSITION.SHORT,
                          })}
                        >
                          {item.position}
                        </span>
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx({
                          "text-green-400": amountSign === 1,
                          "text-red-400": amountSign === -1,
                        })}
                      >
                        {isTruthy(item.custody_amount) ? (
                          formatNumberAsCurrency(Number(item.custody_amount), 4)
                        ) : (
                          <HtmlUnicode name="EmDash" />
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.custody_asset) ? item.custody_asset.toUpperCase() : <HtmlUnicode name="EmDash" />}
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.leverage) ? (
                        `${formatNumberAsDecimal(Number(item.leverage))}x`
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx({
                          "text-green-400": unrealizedPLSign === 1,
                          "text-red-400": unrealizedPLSign === -1,
                        })}
                      >
                        {isTruthy(item.unrealized_pnl) ? (
                          formatNumberAsCurrency(Number(item.unrealized_pnl), 2)
                        ) : (
                          <HtmlUnicode name="EmDash" />
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.interest_rate) ? (
                        formatNumberAsPercent(Number(item.interest_rate))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3" hidden={hideColumns?.includes("Paid Interest")}>
                      {isTruthy(item.paid_interest) ? (
                        formatNumberAsCurrency(Number(item.paid_interest))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.health) ? (
                        formatNumberAsPercent(Number(item.health))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.date_opened) ? (
                        formatDateRelative(new Date(item.date_opened))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isTruthy(item.time_open) ? (
                        formatDateDistance(new Date(item.time_open))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4">
                      <Button
                        variant="secondary"
                        as="button"
                        size="xs"
                        className="rounded font-normal"
                        onClick={() =>
                          setPositionToClose({
                            isOpen: true,
                            id: item.id,
                          })
                        }
                      >
                        Close
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <PositionToCloseModal
          id={positionToClose.id}
          isOpen={positionToClose.isOpen}
          onTransitionEnd={() => {
            if (positionToClose.id !== "") {
              setPositionToClose((prev) => ({ ...prev, id: "" }));
            }
          }}
          onClose={() => {
            if (positionToClose.isOpen) {
              setPositionToClose((prev) => ({ ...prev, isOpen: false }));
            }
          }}
          onMutationSuccess={() => {
            setPositionToClose({ id: "", isOpen: false });
          }}
        />
      </>
    );
  }

  if (openPositionsQuery.isError) {
    return <div className="bg-gray-850 p-10 text-center text-gray-100">Try again later.</div>;
  }

  return <div className="bg-gray-850 p-10 text-center text-gray-100">Loading...</div>;
};

export default OpenPositionsTable;

type PositionToCloseModalProps = {
  id: string;
  isOpen: boolean;
  onTransitionEnd: () => void;
  onClose: () => void;
  onMutationSuccess: () => void;
  onMutationError?: (error: Error) => void;
};
function PositionToCloseModal(props: PositionToCloseModalProps) {
  const positionToCloseQuery = useQueryPositionToClose({ id: props.id });
  const positionToCloseMutation = useCloseMTPMutation();
  const onClickConfirmClose = async (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await positionToCloseMutation.mutateAsync({
        id: Long.fromNumber(Number(props.id)),
      });
      props.onMutationSuccess();
    } catch (err) {
      if (props.onMutationError) {
        props.onMutationError(err as Error);
      }
    }
  };
  const onTransitionEnd = useCallback(() => {
    props.onTransitionEnd();
    positionToCloseMutation.reset();
  }, [positionToCloseMutation, props]);

  let content = null;

  if (positionToCloseQuery.isLoading) {
    content = <p className="rounded bg-slate-200 p-4 text-center text-slate-800">Loading...</p>;
  }

  if (positionToCloseQuery.isError) {
    const error = positionToCloseQuery.error as Error;
    content = <p className="rounded bg-red-200 p-4 text-center text-red-800">Error: {error.message}</p>;
  }

  if (positionToCloseQuery.isSuccess) {
    content = (
      <>
        <h1 className="text-center text-lg font-bold">Review closing trade</h1>
        <ul className="mt-4 flex flex-col gap-3">
          <li className="bg-gray-850 flex flex-row items-center rounded-lg py-2 px-4 text-base font-semibold">
            <AssetIcon symbol="usdc" network="sifchain" size="sm" />
            <span className="ml-1">USDC</span>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Entry price</span>
              <span>$.005</span>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Opening position</span>
              <div className="flex flex-row items-center">
                <span className="mr-1">$399,999</span>
                <AssetIcon symbol="usdc" network="sifchain" size="sm" />
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Opening value</span>
              <span>$1,999.50</span>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Total interest paid</span>
              <div className="flex flex-row items-center">
                <span className="mr-1">$399,999</span>
                <AssetIcon symbol="usdc" network="sifchain" size="sm" />
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Current position</span>
              <span>299,900 ROWAN</span>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Current price</span>
              <span>$.05</span>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Current value</span>
              <span>$14,995</span>
            </div>
          </li>
        </ul>
        <div className="relative my-[-1em] flex items-center justify-center">
          <div className="rounded-full border-2 border-gray-800 bg-gray-900 p-3">
            <ArrowDownIcon className="text-lg" />
          </div>
        </div>
        <ul className="flex flex-col gap-3">
          <li className="bg-gray-850 flex flex-row items-center rounded-lg py-2 px-4 text-base font-semibold">
            <AssetIcon symbol="rowan" network="sifchain" size="sm" />
            <span className="ml-1">ROWAN</span>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Closing position</span>
              <div className="flex flex-row items-center">
                <span className="mr-1">$14,995</span>
                <AssetIcon symbol="rowan" network="sifchain" size="sm" />
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Fees</span>
              <div className="flex flex-row items-center">
                <span className="mr-1">$5,00</span>
                <AssetIcon symbol="rowan" network="sifchain" size="sm" />
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Price Impact</span>
              <span>10%</span>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Resulting amount</span>
              <div className="flex flex-row items-center">
                <span className="mr-1">$14,990</span>
                <AssetIcon symbol="rowan" network="sifchain" size="sm" />
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">PnL</span>
              <span>$12,990.50</span>
            </div>
          </li>
        </ul>
        {positionToCloseMutation.isLoading ? (
          <p className="mt-4 rounded bg-indigo-200 py-3 px-4 text-center text-indigo-800">Closing position...</p>
        ) : (
          <Button variant="primary" as="button" size="md" className="mt-4 w-full rounded" onClick={onClickConfirmClose}>
            Confirm close
          </Button>
        )}
        {positionToCloseMutation.isError ? (
          <p className="mt-4 rounded bg-red-200 p-4 text-center text-red-800">
            <b className="mr-1">Failed to open margin position:</b>
            <span>{(positionToCloseMutation.error as Error).message}</span>
          </p>
        ) : null}
      </>
    );
  }

  return (
    <Modal className="text-sm" isOpen={props.isOpen} onTransitionEnd={onTransitionEnd} onClose={props.onClose}>
      {content}
    </Modal>
  );
}
