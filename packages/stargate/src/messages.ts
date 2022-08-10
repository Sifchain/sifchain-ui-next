import type {
  MsgDelegateEncodeObject,
  MsgDepositEncodeObject,
  MsgSendEncodeObject,
  MsgSubmitProposalEncodeObject,
  MsgTransferEncodeObject,
  MsgUndelegateEncodeObject,
  MsgVoteEncodeObject,
  MsgWithdrawDelegatorRewardEncodeObject,
} from "@cosmjs/stargate";
import type * as clpTx from "@sifchain/proto-types/sifnode/clp/v1/tx";
import type * as dispensationTx from "@sifchain/proto-types/sifnode/dispensation/v1/tx";
import type * as ethBridgeTx from "@sifchain/proto-types/sifnode/ethbridge/v1/tx";
import type * as marginTx from "@sifchain/proto-types/sifnode/margin/v1/tx";
import type * as tokenRegistryTx from "@sifchain/proto-types/sifnode/tokenregistry/v1/tx";

import type { EncodeObjectRecord } from "./types";

export type SifEncodeObjectRecord = EncodeObjectRecord<typeof clpTx> &
  EncodeObjectRecord<typeof dispensationTx> &
  EncodeObjectRecord<typeof ethBridgeTx> &
  EncodeObjectRecord<typeof tokenRegistryTx> &
  EncodeObjectRecord<typeof marginTx>;

export type SifEncodeObject =
  SifEncodeObjectRecord[keyof SifEncodeObjectRecord];

export type CosmosEncodeObject =
  | MsgDelegateEncodeObject
  | MsgDepositEncodeObject
  | MsgSendEncodeObject
  | MsgSubmitProposalEncodeObject
  | MsgTransferEncodeObject
  | MsgUndelegateEncodeObject
  | MsgVoteEncodeObject
  | MsgWithdrawDelegatorRewardEncodeObject;
