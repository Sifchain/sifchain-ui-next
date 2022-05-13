# @sifchain/stargate

Provide a Stargate client that extends [@cosmjs/stargate](https://github.com/cosmos/cosmjs/tree/main/packages/stargate) with added type definitions and helpers

## Installation

```sh
yarn add @sifchain/stargate@snapshot
```

## Example usage

```ts
import {
  createQueryClient,
  DEFAULT_FEE,
  SifSigningStargateClient,
} from "@sifchain/stargate";
import { Decimal } from "@cosmjs/math";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

const queryClients = await createQueryClient(
  "https://rpc-testnet.sifchain.finance",
);

const response = await queryClients.clp.getPools({});

response.pools.forEach((pool) => console.log(pool));

const tokenEntries = await queryClients.tokenRegistry
  .entries({})
  .then((x) => x.registry?.entries);

const rowan = tokenEntries?.find((x) => x.baseDenom === "rowan")!;
const juno = tokenEntries?.find((x) => x.baseDenom === "ujuno")!;

const mnemonic = "some 24 words mnemonic";
const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
const [firstAccount, secondAccount] = await wallet.getAccounts();

const signingClient = await SifSigningStargateClient.connectWithSigner(
  "https://rpc-testnet.sifchain.finance",
  wallet,
);

signingClient.signAndBroadcast(
  firstAccount!.address,
  [
    {
      typeUrl: "/sifnode.clp.v1.MsgAddLiquidity",
      value: {
        signer: firstAccount!.address,
        nativeAssetAmount: Decimal.fromUserInput(
          "100",
          rowan.decimals.toNumber(),
        ).toString(),
        externalAssetAmount: Decimal.fromUserInput(
          "100",
          juno.decimals.toNumber(),
        ).toString(),
      },
    },
    {
      typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      value: {
        fromAddress: firstAccount!.address,
        toAddress: secondAccount!.address,
        amount: [
          {
            denom: rowan.denom,
            amount: Decimal.fromUserInput(
              "100",
              rowan.decimals.toNumber(),
            ).toString(),
          },
        ],
      },
    },
  ],
  DEFAULT_FEE,
);
```
