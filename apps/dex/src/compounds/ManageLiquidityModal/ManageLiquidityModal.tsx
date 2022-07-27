import { Button, ButtonGroup, Modal, ModalProps, PlusIcon } from "@sifchain/ui";
import { useCallback } from "react";
import { SwapFieldset } from "../Swap";

export type ManageLiquidityModalProps = ModalProps & {
  denom: string;
  onRequestDenomChange: (denom: string) => unknown;
};

const ManageLiquidityModal = (props: ManageLiquidityModalProps) => {
  return (
    <Modal {...props} title="Pool">
      <div className="flex justify-between items-center gap-4 pb-4">
        <ButtonGroup
          className="flex-1 bg-black"
          options={[
            { label: "Add liquidity", value: "add" },
            { label: "Remove liquidity", value: "remove" },
          ]}
          selectedIndex={0}
          onChange={useCallback(() => {}, [])}
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
      <form>
        <SwapFieldset
          label="Token 1"
          denom={props.denom}
          onDenomChange={() => {}}
          onAmountChange={() => {}}
          responsive={false}
        />
        <div className="flex justify-center items-center my-[-1em]">
          <div className="bg-black rounded-full p-3 border-2 border-gray-800">
            <PlusIcon />
          </div>
        </div>
        <SwapFieldset
          label="Token 2"
          denom="rowan"
          onDenomChange={() => {}}
          onAmountChange={() => {}}
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
    </Modal>
  );
};

export default ManageLiquidityModal;
