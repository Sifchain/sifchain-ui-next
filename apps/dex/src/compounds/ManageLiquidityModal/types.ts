import type { ModalProps } from "@sifchain/ui";

export type ManageLiquidityAction = "add" | "unlock";

export type ManageLiquidityModalProps = ModalProps & {
  action?: ManageLiquidityAction;
  denom: string;
  onChangeDenom: (denom: string) => unknown;
  onChangeAction: (action: ManageLiquidityAction) => unknown;
};
