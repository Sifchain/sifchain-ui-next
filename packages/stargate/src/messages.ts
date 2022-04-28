import type * as clpTx from "@sifchain/proto-types/sifnode/clp/v1/tx";
import type * as dispensationTx from "@sifchain/proto-types/sifnode/dispensation/v1/tx";
import type * as ethBridgeTx from "@sifchain/proto-types/sifnode/ethbridge/v1/tx";
import type * as tokenRegistryTx from "@sifchain/proto-types/sifnode/tokenregistry/v1/tx";
import type { EncodeObjectRecord } from "./types";

export type SifchainEncodeObjectRecord = EncodeObjectRecord<typeof clpTx> &
  EncodeObjectRecord<typeof dispensationTx> &
  EncodeObjectRecord<typeof ethBridgeTx> &
  EncodeObjectRecord<typeof tokenRegistryTx>;

export type SifchainEncodeObject =
  SifchainEncodeObjectRecord[keyof SifchainEncodeObjectRecord];
