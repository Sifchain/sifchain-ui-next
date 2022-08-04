import { pathOr } from "ramda";
import { useRouter } from "next/router";
import clsx from "clsx";
import Link from "next/link";

import {
  Button,
  formatNumberAsCurrency,
  ChevronDownIcon,
  Modal,
  ArrowDownIcon,
  toast,
} from "@sifchain/ui";
import { useState, SyntheticEvent } from "react";

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
  useQueryOpenPositions,
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
  fromColNameToItemKey,
  findNextOrderAndSortBy,
  SORT_BY,
  MARGIN_POSITION,
  QS_DEFAULTS,
} from "./_tables";

/**
 * ********************************************************************************************
 *
 * OpenPositionsTable Compound
 *
 * ********************************************************************************************
 */
const OPEN_POSITIONS_HEADER_ITEMS = [
  "Pool",
  "Side",
  "Position", // Maps to "amount" field
  "Asset",
  "Base Leverage",
  "Unrealized P&L",
  "Interest Rate",
  "Unsettled Interest",
  "Next Payment",
  "Paid Interest",
  "Health",
  "Date Opened",
  "Time Open",
  "Close Position", // We don't display this text
] as const;

type HideColsUnion =
  | "pool"
  | "side"
  | "amount"
  | "asset"
  | "baseLeverage"
  | "unrealizedPL"
  | "interestRate"
  | "unsettledInterest"
  | "nextPayment"
  | "paidInterest"
  | "health"
  | "dateOpened"
  | "timeOpen";
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
    page: pathOr(QS_DEFAULTS.page, ["page"], router.query),
    limit: pathOr(QS_DEFAULTS.limit, ["limit"], router.query),
    orderBy: pathOr(QS_DEFAULTS.orderBy, ["orderBy"], router.query),
    sortBy: pathOr(QS_DEFAULTS.sortBy, ["sortBy"], router.query),
  };
  const openPositionsQuery = useQueryOpenPositions(queryParams);
  const [positionToClose, setPositionToClose] = useState<{
    isOpen: boolean;
    id: string;
  }>({
    isOpen: false,
    id: "",
  });

  if (openPositionsQuery.isSuccess) {
    const { results, pagination } = openPositionsQuery.data;

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
            page={Number(pagination.page)}
            total={Number(pagination.total)}
          />
          <PaginationButtons
            pages={Number(pagination.pages)}
            render={(page) => {
              return (
                <Link
                  href={{ query: { ...router.query, page } }}
                  scroll={false}
                >
                  <a
                    className={clsx("px-2 py-1 rounded", {
                      "bg-gray-400": Number(pagination.page) === page,
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
                {headers.map((title) => {
                  const itemKey = fromColNameToItemKey(title);
                  const itemActive = pagination.orderBy === itemKey;
                  const { nextOrderBy, nextSortBy } = findNextOrderAndSortBy({
                    itemKey,
                    itemActive,
                    currentSortBy: pagination.sortBy,
                  });
                  return (
                    <th
                      key={itemKey}
                      data-item-key={itemKey}
                      className="font-normal px-4 py-3"
                      hidden={hideColumns?.includes(itemKey as HideColsUnion)}
                    >
                      {itemKey === "closePosition" ? null : (
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
                            {title}
                            {itemActive && (
                              <ChevronDownIcon
                                className={clsx("ml-1 transition-transform", {
                                  "-rotate-180":
                                    pagination.sortBy === SORT_BY.ASC,
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
              {results.map((item) => {
                const position = MARGIN_POSITION[item.side];
                const amountSign = Math.sign(Number(item.amount));
                const unrealizedPLSign = Math.sign(Number(item.unrealizedPL));

                return (
                  <tr key={item.id}>
                    <td
                      className="px-4 py-3"
                      hidden={hideColumns?.includes("pool")}
                    >
                      {item.pool}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx({
                          "text-cyan-400": position === MARGIN_POSITION[0],
                          "text-green-400": position === MARGIN_POSITION[1],
                          "text-red-400": position === MARGIN_POSITION[2],
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
                        {formatNumberAsCurrency(Number(item.amount), 4)}
                      </span>
                    </td>
                    <td className="px-4 py-3">{item.asset}</td>
                    <td className="px-4 py-3">
                      {formatNumberAsDecimal(Number(item.baseLeverage))}x
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx({
                          "text-green-400": unrealizedPLSign === 1,
                          "text-red-400": unrealizedPLSign === -1,
                        })}
                      >
                        {formatNumberAsCurrency(Number(item.unrealizedPL), 2)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {formatNumberAsPercent(Number(item.interestRate))}
                    </td>
                    <td
                      className="px-4 py-3"
                      hidden={hideColumns?.includes("unsettledInterest")}
                    >
                      {formatNumberAsCurrency(Number(item.unsettledInterest))}
                    </td>
                    <td
                      className="px-4 py-3"
                      hidden={hideColumns?.includes("nextPayment")}
                    >
                      {formatDateRelative(item.nextPayment)}
                    </td>
                    <td
                      className="px-4 py-3"
                      hidden={hideColumns?.includes("paidInterest")}
                    >
                      {formatNumberAsCurrency(Number(item.paidInterest))}
                    </td>
                    <td className="px-4 py-3">
                      {formatNumberAsDecimal(Number(item.health))}
                    </td>
                    <td className="px-4 py-3">
                      {formatDateRelative(item.dateOpened)}
                    </td>
                    <td className="px-4 py-3">
                      {formatDateDistance(item.timeOpen)}
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
        <ul className="bg-gray-850 flex flex-col gap-3 p-4 rounded-lg mt-4">
          <li className="text-base font-semibold">ROWAN</li>
          <li>
            <div className="flex flex-row">
              <span className="mr-auto min-w-fit text-gray-300">
                Entry price
              </span>
              <span>$.005</span>
            </div>
          </li>
          <li>
            <div className="flex flex-row">
              <span className="mr-auto min-w-fit text-gray-300">
                Opening position
              </span>
              <span>$399,999 ROWAN</span>
            </div>
          </li>
          <li>
            <div className="flex flex-row">
              <span className="mr-auto min-w-fit text-gray-300">
                Opening value
              </span>
              <span>$1,999.50</span>
            </div>
          </li>
          <li>
            <div className="flex flex-row">
              <span className="mr-auto min-w-fit text-gray-300">
                Total interest paid
              </span>
              <span>100,000 ROWAN</span>
            </div>
          </li>
          <li>
            <div className="flex flex-row">
              <span className="mr-auto min-w-fit text-gray-300">
                Current position
              </span>
              <span>299,900 ROWAN</span>
            </div>
          </li>
          <li>
            <div className="flex flex-row">
              <span className="mr-auto min-w-fit text-gray-300">
                Current price
              </span>
              <span>$.05</span>
            </div>
          </li>
          <li>
            <div className="flex flex-row">
              <span className="mr-auto min-w-fit text-gray-300">
                Current value
              </span>
              <span>$14,995</span>
            </div>
          </li>
        </ul>
        <div className="flex justify-center items-center my-[-1em]">
          <div className="bg-black rounded-full p-3 border-2 border-gray-800">
            <ArrowDownIcon className="text-lg" />
          </div>
        </div>
        <ul className="bg-gray-850 flex flex-col gap-3 p-4 rounded-lg">
          <li className="text-base font-semibold">USDC</li>
          <li>
            <div className="flex flex-row">
              <span className="mr-auto min-w-fit text-gray-300">
                Closing position
              </span>
              <span>14,995 USDC</span>
            </div>
          </li>
          <li>
            <div className="flex flex-row">
              <span className="mr-auto min-w-fit text-gray-300">Fees</span>
              <span>5 USDC</span>
            </div>
          </li>
          <li>
            <div className="flex flex-row">
              <span className="mr-auto min-w-fit text-gray-300">
                Price Impact
              </span>
              <span>10%</span>
            </div>
          </li>
          <li>
            <div className="flex flex-row">
              <span className="mr-auto min-w-fit text-gray-300">
                Resulting amount
              </span>
              <span>14,990 USDC</span>
            </div>
          </li>
          <li>
            <div className="flex flex-row">
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
            Confirm Close
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
