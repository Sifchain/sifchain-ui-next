import { Button, ButtonGroup, Modal, ModalProps, PlusIcon } from "@sifchain/ui";
import { useCallback, useMemo } from "react";
import TokenAmountFieldset from "../TokenAmountFieldset";
import { UnlockLiquidityTokenFieldset } from "./UnlockLiquidityTokenFieldset";

type Action = "add" | "unlock";

export type ManageLiquidityModalProps = ModalProps & {
  action?: Action;
  denom: string;
  onRequestDenomChange: (denom: string) => unknown;
  onRequestActionChange: (action: Action) => unknown;
};

const AddLiquidityForm = (props: ManageLiquidityModalProps) => (
  <form>
    <TokenAmountFieldset
      label="Token 1"
      denom={props.denom}
      onChangeDenom={() => {}}
      onChangeAmount={() => {}}
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
      onChangeDenom={() => {}}
      onChangeAmount={() => {}}
      responsive={false}
    />
    <dl className="flex flex-col gap-2 p-4 [&>div]:flex [&>div]:justify-between">
      <div>
        <dt>Est pool share</dt>
        <dd>0.4%</dd>
      </div>
      <div>
        <dt>Price impact</dt>
        <dd>0.01%</dd>
      </div>
    </dl>
    <Button className="w-full">Add liquidity</Button>
  </form>
);

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
      <Button className="w-full">Add liquidity</Button>
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
                props.onRequestActionChange(option.value);
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
      {useMemo(() => {
        switch (selectedTabIndex) {
          default:
          case 0:
            return <AddLiquidityForm {...props} />;
          case 1:
            return <RemoveLiquidityForm {...props} />;
        }
      }, [props, selectedTabIndex])}
    </Modal>
  );
};

export default ManageLiquidityModal;
