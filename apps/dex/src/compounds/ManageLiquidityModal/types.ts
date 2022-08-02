import type { ModalProps } from "@sifchain/ui";

export type Action = "add" | "unlock";

export type ManageLiquidityModalProps = ModalProps & {
  action?: Action;
  denom: string;
  onChangeDenom: (denom: string) => unknown;
  onChangeAction: (action: Action) => unknown;
};
