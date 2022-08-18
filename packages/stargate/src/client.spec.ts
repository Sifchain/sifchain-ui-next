import { Decimal } from "@cosmjs/math";
import type { OfflineSigner } from "@cosmjs/proto-signing";
import { assertIsDeliverTxSuccess } from "@cosmjs/stargate";
import { PoolsReq } from "@sifchain/proto-types/sifnode/clp/v1/querier";
import { createQueryClient } from "./queryClient";
import { SifSigningStargateClient } from "./signingStargateClient";

describe("Sifchain's client", () => {
  test("query client", async () => {
    const queryClients = await createQueryClient("https://rpc-testnet.sifchain.finance");

    expect(() => queryClients.clp.getPools(PoolsReq.fromPartial({}))).not.toThrowError();
  });

  // TODO: setup integration test
  test.skip("signing client", async () => {
    const queryClients = await createQueryClient("https://rpc-testnet.sifchain.finance");
    const tokenEntries = await queryClients.tokenRegistry.entries({}).then((x) => x.registry?.entries);

    const rowan = tokenEntries?.find((x) => x.denom === "rowan")!;
    const juno = tokenEntries?.find(
      (x) => x.denom === "ibc/330D65554F859FB20E13413C88951CFE774DD2D83F593417A0552C0607C92225",
    )!;

    const client = await SifSigningStargateClient.connectWithSigner(
      "https://rpc-testnet.sifchain.finance",
      {} as OfflineSigner, // i.e. from Keplr
    );

    const broadcastResponse = await client.signAndBroadcast(
      "someAddress",
      [
        {
          typeUrl: "/sifnode.clp.v1.MsgAddLiquidity",
          value: {
            signer: "signerAddress",
            nativeAssetAmount: Decimal.fromUserInput("44", rowan.decimals.toNumber()).toString(),
            externalAssetAmount: Decimal.fromUserInput("68.5464", juno.decimals.toNumber()).toString(),
          },
        },
      ],
      "auto",
    );

    assertIsDeliverTxSuccess(broadcastResponse);
  });
});
