# @sifchain/stargate

Provide a Stargate client that extends [@cosmjs/stargate](https://github.com/cosmos/cosmjs/tree/main/packages/stargate) with added type definitions and helpers

## Installation

```sh
yarn add @sifchain/stargate@snapshot
```

## Example usage

### Query the blockchain

```ts
const queryClients = await createQueryClient(
  "https://rpc-testnet.sifchain.finance"
);

const response = await queryClients.clp.getPools({});

response.pools.forEach((pool) => console.log(pool));
```

### Sign and broadcast transactions

```ts
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
  wallet
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
          rowan.decimals.toNumber()
        ).toString(),
        externalAssetAmount: Decimal.fromUserInput(
          "100",
          juno.decimals.toNumber()
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
              rowan.decimals.toNumber()
            ).toString(),
          },
        ],
      },
    },
  ],
  DEFAULT_FEE
);
```

### Import & export tokens

```ts
const sifClient = await SifSigningStargateClient.connectWithSigner(
  "https://rpc-testnet.sifchain.finance",
  wallet
);

const junoClient = await SigningStargateClient.connectWithSigner(
  "juno_rpc",
  wallet
);

await sifClient.importIBCTokens(
  junoClient,
  "from_juno_address",
  "to_sif_address",
  {
    denom: "ujuno",
    amount: Decimal.fromUserInput("1.0", 6).toString(),
  },
  "transfer",
  undefined,
  undefined,
  DEFAULT_FEE
);

await sifClient.exportIBCTokens(
  "from_sif_address",
  "to_juno_address",
  {
    denom: "ibc/some_hash_from_token_registry",
    amount: Decimal.fromUserInput("1.0", 6).toString(),
  },
  "transfer",
  undefined,
  undefined,
  DEFAULT_FEE
);

await sifClient.sendTokensToEth(
  "from_sif_address",
  "to_eth_address",
  {
    denom: "rowan",
    amount: Decimal.fromUserInput("1.0", 18).toString(),
  },
  // ropsten chain id
  0x3,
  undefined,
  DEFAULT_FEE
);
```
