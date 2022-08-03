import { ButtonGroup, Modal } from "@sifchain/ui";
import { useCallback, useMemo } from "react";
import AddLiquidityForm from "./AddLiquidityForm";
import RemoveLiquidityForm from "./RemoveLiquidityForm";
import type { Action, ManageLiquidityModalProps } from "./types";

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
