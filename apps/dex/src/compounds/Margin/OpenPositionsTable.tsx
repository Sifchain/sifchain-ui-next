import { useRouter } from "next/router";
import clsx from "clsx";
import Link from "next/link";
import { useState, SyntheticEvent } from "react";

import {
  Button,
  formatNumberAsCurrency,
  ChevronDownIcon,
  Modal,
  ArrowDownIcon,
  toast,
} from "@sifchain/ui";

import AssetIcon from "~/compounds/AssetIcon";
import { useOpenPositionsQuery } from "~/domains/margin/hooks/useOpenPositionsQuery";

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
import {
  NoResultsRow,
  PaginationShowItems,
  PaginationButtons,
  PillUpdating,
} from "./_components";
import {
  useQueryPositionToClose,
  useMutationPositionToClose,
} from "./_mockdata";
import {
  formatNumberAsDecimal,
  formatNumberAsPercent,
  formatDateRelative,
  formatDateDistance,
} from "./_intl";
import {
  findNextOrderAndSortBy,
  SORT_BY,
  MARGIN_POSITION,
  QS_DEFAULTS,
} from "./_tables";
import { HtmlUnicode } from "./_trade";

/**
 * ********************************************************************************************
 *
 * OpenPositionsTable Compound
 *
 * ********************************************************************************************
 */
const HEADER_SLUGS = {
  // they match sifApi response object
  pool: "pool", // sifApi breaks if you send column that doesn't exist
  position: "position",
  custody_amount: "custody_amount",
  custody_asset: "custody_asset",
  leverage: "leverage",
  unrealized_pnl: "unrealized_pnl",
  interest_rate: "interest_rate",
  unsettled_interest: "unsettled_interest",
  next_payment: "next_payment",
  paid_interest: "paid_interest",
  health: "health",
  date_opened: "date_opened",
  time_open: "time_open",
  close_position: "close_position",
};
const OPEN_POSITIONS_HEADER_ITEMS = [
  { title: "Pool", slug: HEADER_SLUGS.pool, sortBy: false },
  { title: "Side", slug: HEADER_SLUGS.position, sortBy: true },
  { title: "Position", slug: HEADER_SLUGS.custody_amount, sortBy: true }, // Maps to "custody_amount" field
  { title: "Asset", slug: HEADER_SLUGS.custody_asset, sortBy: true },
  { title: "Base Leverage", slug: HEADER_SLUGS.leverage, sortBy: true },
  { title: "Unrealized P&L", slug: HEADER_SLUGS.unrealized_pnl, sortBy: true },
  { title: "Interest Rate", slug: HEADER_SLUGS.interest_rate, sortBy: true },
  {
    title: "Unsettled Interest",
    slug: HEADER_SLUGS.unsettled_interest,
    sortBy: true,
  },
  { title: "Next Payment", slug: HEADER_SLUGS.next_payment, sortBy: true },
  { title: "Paid Interest", slug: HEADER_SLUGS.paid_interest, sortBy: true },
  { title: "Health", slug: HEADER_SLUGS.health, sortBy: true },
  { title: "Date Opened", slug: HEADER_SLUGS.date_opened, sortBy: true },
  { title: "Time Open", slug: HEADER_SLUGS.time_open, sortBy: true },
  { title: "Close Position", slug: HEADER_SLUGS.close_position, sortBy: false }, // We don't display this text
] as const;

type HideColsUnion = keyof typeof HEADER_SLUGS;
export type OpenPositionsTableProps = {
  classNamePaginationContainer?: string;
  queryId: string;
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
    address: props.queryId,
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
    const pages = Math.ceil(
      Number(pagination.total) / Number(pagination.limit),
    );

    return (
      <>
        <div
          className={clsx(
            "flex flex-row bg-gray-800 items-center",
            classNamePaginationContainer,
          )}
        >
          {openPositionsQuery.isRefetching && <PillUpdating />}
          <PaginationShowItems
            limit={Number(pagination.limit)}
            offset={Number(pagination.offset)}
            total={Number(pagination.total)}
          />
          <PaginationButtons
            pages={pages}
            render={(page) => {
              const offset = String(
                Number(pagination.limit) * page - Number(pagination.limit),
              );
              return (
                <Link
                  href={{ query: { ...router.query, offset } }}
                  scroll={false}
                >
                  <a
                    className={clsx("px-2 py-1 rounded", {
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
          <table className="table-auto overflow-scroll w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-800">
              <tr className="text-gray-400">
                {headers.map((header) => {
                  const itemActive = pagination.order_by === header.slug;
                  const { nextOrderBy, nextSortBy } = findNextOrderAndSortBy({
                    itemKey: header.slug,
                    itemActive,
                    currentSortBy: pagination.sort_by,
                  });
                  return (
                    <th
                      key={header.slug}
                      data-item-key={header.slug}
                      className="font-normal px-4 py-3"
                      hidden={hideColumns?.includes(
                        header.slug as HideColsUnion,
                      )}
                    >
                      {header.slug === "close_position" ? null : (
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
                              "text-white font-semibold": itemActive,
                            })}
                          >
                            {header.title}
                            {itemActive && (
                              <ChevronDownIcon
                                className={clsx("ml-1 transition-transform", {
                                  "-rotate-180":
                                    pagination.sort_by === SORT_BY.ASC,
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
              {results.length <= 0 && (
                <NoResultsRow
                  colSpan={headers.length}
                  message="You have no open positions."
                />
              )}
              {results.map((item: any) => {
                const position = item.position;
                const amountSign = Math.sign(Number(item.custody_amount));
                const unrealizedPLSign = Math.sign(Number(item.unrealized_pnl));

                return (
                  <tr key={item.id}>
                    <td
                      className="px-4 py-3"
                      hidden={hideColumns?.includes("pool")}
                    >
                      {item.pool ? item.pool : <HtmlUnicode name="EmDash" />}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx({
                          "text-cyan-400":
                            position === MARGIN_POSITION.UNSPECIFIED,
                          "text-green-400": position === MARGIN_POSITION.LONG,
                          "text-red-400": position === MARGIN_POSITION.SHORT,
                        })}
                      >
                        {position}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={clsx({
                          "text-green-400": amountSign === 1,
                          "text-red-400": amountSign === -1,
                        })}
                      >
                        {formatNumberAsCurrency(Number(item.custody_amount), 4)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.custody_asset.toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      {formatNumberAsDecimal(Number(item.leverage))}x
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx({
                          "text-green-400": unrealizedPLSign === 1,
                          "text-red-400": unrealizedPLSign === -1,
                        })}
                      >
                        {item.unrealized_pnl ? (
                          formatNumberAsCurrency(Number(item.unrealized_pnl), 2)
                        ) : (
                          <HtmlUnicode name="EmDash" />
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.interest_rate ? (
                        formatNumberAsPercent(Number(item.interest_rate))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td
                      className="px-4 py-3"
                      hidden={hideColumns?.includes("unsettled_interest")}
                    >
                      {item.unsettled_interest ? (
                        formatNumberAsCurrency(Number(item.unsettled_interest))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td
                      className="px-4 py-3"
                      hidden={hideColumns?.includes("next_payment")}
                    >
                      {item.next_payment ? (
                        formatDateRelative(item.next_payment)
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td
                      className="px-4 py-3"
                      hidden={hideColumns?.includes("paid_interest")}
                    >
                      {item.paid_interest ? (
                        formatNumberAsCurrency(Number(item.paid_interest))
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {formatNumberAsDecimal(Number(item.health))}
                    </td>
                    <td className="px-4 py-3">
                      {formatDateRelative(new Date(item.date_opened))}
                    </td>
                    <td className="px-4 py-3">
                      {item.time_open ? (
                        formatDateDistance(item.time_open)
                      ) : (
                        <HtmlUnicode name="EmDash" />
                      )}
                    </td>
                    <td className="px-4">
                      <Button
                        variant="secondary"
                        as="button"
                        size="xs"
                        className="font-normal rounded"
                        onClick={() =>
                          setPositionToClose({
                            isOpen: true,
                            id: item.address,
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
          onMutationSuccess={(position) => {
            toast.success(
              `Position closed successfully! Position ID: ${position.id}`,
            );
            setPositionToClose({ id: "", isOpen: false });
          }}
        />
      </>
    );
  }

  if (openPositionsQuery.isError) {
    return (
      <div className="bg-gray-850 p-10 text-center text-gray-100">
        Try again later.
      </div>
    );
  }

  return (
    <div className="bg-gray-850 p-10 text-center text-gray-100">Loading...</div>
  );
};

export default OpenPositionsTable;

type PositionToCloseModalProps = {
  id: string;
  isOpen: boolean;
  onTransitionEnd: () => void;
  onClose: () => void;
  onMutationSuccess: (position: { id: string }) => void;
  onMutationError?: (error: Error) => void;
};
function PositionToCloseModal(props: PositionToCloseModalProps) {
  const positionToCloseQuery = useQueryPositionToClose({ id: props.id });
  const positionToCloseMutation = useMutationPositionToClose();
  const onClickConfirmClose = async (
    event: SyntheticEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    try {
      const position = await positionToCloseMutation.mutateAsync({
        id: props.id,
      });
      props.onMutationSuccess(position as { id: string });
    } catch (err) {
      if (props.onMutationError) {
        props.onMutationError(err as Error);
      }
    }
  };

  let content = null;

  if (positionToCloseQuery.isLoading) {
    content = (
      <p className="text-center p-4 rounded bg-slate-200 text-slate-800">
        Loading...
      </p>
    );
  }

  if (positionToCloseQuery.isError) {
    const error = positionToCloseQuery.error as Error;
    content = (
      <p className="text-center p-4 rounded bg-red-200 text-red-800">
        Error: {error.message}
      </p>
    );
  }

  if (positionToCloseQuery.isSuccess) {
    content = (
      <>
        <h1 className="text-lg font-bold text-center">Review closing trade</h1>
        <ul className="flex flex-col gap-3 mt-4">
          <li className="bg-gray-850 text-base font-semibold py-2 px-4 rounded-lg flex flex-row items-center">
            <AssetIcon symbol="rowan" network="sifchain" size="sm" />
            <span className="ml-1">ROWAN</span>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">
                Entry price
              </span>
              <span>$.005</span>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">
                Opening position
              </span>
              <div className="flex flex-row items-center">
                <span className="mr-1">$399,999</span>
                <AssetIcon symbol="rowan" network="sifchain" size="sm" />
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">
                Opening value
              </span>
              <span>$1,999.50</span>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">
                Total interest paid
              </span>
              <div className="flex flex-row items-center">
                <span className="mr-1">$399,999</span>
                <AssetIcon symbol="rowan" network="sifchain" size="sm" />
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">
                Current position
              </span>
              <span>299,900 ROWAN</span>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">
                Current price
              </span>
              <span>$.05</span>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">
                Current value
              </span>
              <span>$14,995</span>
            </div>
          </li>
        </ul>
        <div className="flex justify-center items-center my-[-1em] relative">
          <div className="bg-gray-900 rounded-full p-3 border-2 border-gray-800">
            <ArrowDownIcon className="text-lg" />
          </div>
        </div>
        <ul className="flex flex-col gap-3">
          <li className="bg-gray-850 text-base font-semibold py-2 px-4 rounded-lg flex flex-row items-center">
            <AssetIcon symbol="usdc" network="sifchain" size="sm" />
            <span className="ml-1">USDC</span>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">
                Closing position
              </span>
              <div className="flex flex-row items-center">
                <span className="mr-1">$14,995</span>
                <AssetIcon symbol="usdc" network="sifchain" size="sm" />
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">Fees</span>
              <div className="flex flex-row items-center">
                <span className="mr-1">$5,00</span>
                <AssetIcon symbol="usdc" network="sifchain" size="sm" />
              </div>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">
                Price Impact
              </span>
              <span>10%</span>
            </div>
          </li>
          <li className="px-4">
            <div className="flex flex-row items-center">
              <span className="mr-auto min-w-fit text-gray-300">
                Resulting amount
              </span>
              <div className="flex flex-row items-center">
                <span className="mr-1">$14,990</span>
                <AssetIcon symbol="usdc" network="sifchain" size="sm" />
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
          <p className="text-center rounded py-3 px-4 mt-4 bg-indigo-200 text-indigo-800">
            Closing position...
          </p>
        ) : (
          <Button
            variant="primary"
            as="button"
            size="md"
            className="rounded w-full mt-4"
            onClick={onClickConfirmClose}
          >
            Confirm close
          </Button>
        )}
        {positionToCloseMutation.isError ? (
          <p className="text-center p-4 mt-4 rounded bg-red-200 text-red-800">
            <span className="mr-1">An error occurred:</span>
            <span>{(positionToCloseMutation.error as Error).message}</span>
          </p>
        ) : null}
      </>
    );
  }

  return (
    <Modal
      className="text-sm"
      isOpen={props.isOpen}
      onTransitionEnd={props.onTransitionEnd}
      onClose={props.onClose}
    >
      {content}
    </Modal>
  );
}
