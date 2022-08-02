import {
  Button,
  ButtonGroup,
  Modal,
  ModalProps,
  PlusIcon,
  RacetrackSpinnerIcon,
} from "@sifchain/ui";
import { FormEventHandler, useCallback, useMemo } from "react";
import useAddLiquidity from "~/domains/clp/hooks/useAddLiquidity";
import useAddLiquidityMutation from "~/domains/clp/hooks/useAddLiquidityMutation";
import TokenAmountFieldset from "../TokenAmountFieldset";
import { UnlockLiquidityTokenFieldset } from "./UnlockLiquidityTokenFieldset";

type Action = "add" | "unlock";

export type ManageLiquidityModalProps = ModalProps & {
  action?: Action;
  denom: string;
  onChangeDenom: (denom: string) => unknown;
  onChangeAction: (action: Action) => unknown;
};

const AddLiquidityForm = (props: ManageLiquidityModalProps) => {
  const {
    nativeAmountState: [nativeAmount, setNativeAmount],
    externalAmountState: [externalAmount, setExternalAmount],
    nativeAmountDecimal,
    externalAmountDecimal,
    poolShare,
  } = useAddLiquidity(props.denom);
  const addLiquidityMutation = useAddLiquidityMutation();

  const buttonMessage = useMemo(() => {
    if (addLiquidityMutation.isError || addLiquidityMutation.isSuccess) {
      return "Close";
    }

    return [
      addLiquidityMutation.isLoading && <RacetrackSpinnerIcon key="1" />,
      "Add liquidity",
    ];
  }, [
    addLiquidityMutation.isError,
    addLiquidityMutation.isLoading,
    addLiquidityMutation.isSuccess,
  ]);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();

      if (addLiquidityMutation.isError || addLiquidityMutation.isSuccess) {
        return props.onClose(false);
      }

      if (
        nativeAmountDecimal !== undefined &&
        externalAmountDecimal !== undefined
      ) {
        addLiquidityMutation.mutate({
          nativeAmount: nativeAmountDecimal.atomics,
          externalAmount: externalAmountDecimal.atomics,
        });
      }
    },
    [addLiquidityMutation, externalAmountDecimal, nativeAmountDecimal, props],
  );

  return (
    <form onSubmit={onSubmit}>
      <TokenAmountFieldset
        label="Token 1"
        denom={props.denom}
        amount={externalAmount}
        onChangeDenom={() => {}}
        onChangeAmount={setExternalAmount}
        responsive={false}
      />
      <div className="flex justify-center items-center my-[-1em]">
        <div className="bg-black rounded-full p-3 border-2 border-gray-800">
          <PlusIcon />
        </div>
      </div>
      <TokenAmountFieldset
        label="Token 2"
        denom="rowan"
        amount={nativeAmount}
        onChangeDenom={() => {}}
        onChangeAmount={setNativeAmount}
        responsive={false}
        tokenSelectionDisabled
      />
      <dl className="flex flex-col gap-2 p-4 [&>div]:flex [&>div]:justify-between">
        <div>
          <dt>Est pool share</dt>
          <dd>
            {poolShare?.toLocaleString(undefined, {
              style: "percent",
              maximumFractionDigits: 2,
            })}
          </dd>
        </div>
      </dl>
      <Button className="w-full" disabled={addLiquidityMutation.isLoading}>
        {buttonMessage}
      </Button>
    </form>
  );
};

const RemoveLiquidityForm = (props: ManageLiquidityModalProps) => {
  return (
    <form>
      <UnlockLiquidityTokenFieldset
        label="From"
        coinLeft={{ denom: props.denom, amount: "" }}
        coinRight={{ denom: "rowan", amount: "" }}
      />
      <section className="p-4">
        <header className="mb-2">Est. amount you will receive:</header>
        <dl className="flex flex-col gap-2 [&_dt]:font-semibold [&_dt]:uppercase [&>div]:flex [&>div]:justify-between">
          <div>
            <dt>{props.denom}</dt>
            <dd>0($0)</dd>
          </div>
          <div>
            <dt>ROWAN</dt>
            <dd>0($0)</dd>
          </div>
        </dl>
      </section>
      <Button className="w-full">Unbond liquidity</Button>
    </form>
  );
};

const ManageLiquidityModal = (props: ManageLiquidityModalProps) => {
  const tabOptions = useMemo<Array<{ label: string; value: Action }>>(
    () => [
      { label: "Add liquidity", value: "add" },
      { label: "Remove liquidity", value: "unlock" },
    ],
    [],
  );

  const selectedTabIndex = useMemo(
    () => Object.values(tabOptions).findIndex((x) => x.value === props.action),
    [props.action, tabOptions],
  );

  const form = useMemo(() => {
    switch (selectedTabIndex) {
      default:
      case 0:
        return <AddLiquidityForm {...props} />;
      case 1:
        return <RemoveLiquidityForm {...props} />;
    }
  }, [props, selectedTabIndex]);

  return (
    <Modal {...props} title="Pool">
      <div className="flex justify-between items-center gap-4 pb-4">
        <ButtonGroup
          className="flex-1 bg-black"
          options={tabOptions}
          selectedIndex={selectedTabIndex}
          onChange={useCallback(
            (index) => {
              const option = Object.values(tabOptions)[index];
              if (option !== undefined) {
                props.onChangeAction(option.value);
              }
            },
            [props, tabOptions],
          )}
        />
        <dl className="flex flex-col gap-1 uppercase [&>div]:flex [&>div]:justify-between [&>div]:gap-4">
          <div>
            <dt>1Inch</dt>
            <dd>0%</dd>
          </div>
          <div>
            <dt>ROWAN</dt>
            <dd>0%</dd>
          </div>
        </dl>
      </div>
      {form}
    </Modal>
  );
};

export default ManageLiquidityModal;
