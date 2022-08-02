import { Button } from "@sifchain/ui";
import type { ManageLiquidityModalProps } from "./types";
import { UnlockLiquidityTokenFieldset } from "./UnlockLiquidityTokenFieldset";

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

export default RemoveLiquidityForm;
