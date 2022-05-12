# @sifchain/eth-sdk

```ts
import { getTestnetSdk } from "@sifchain/eth-sdk";
import { ethers } from "ethers";

const testnetProvider = ethers.getDefaultProvider("testnet");
const defaultSigner = ethers.Wallet.createRandom().connect(testnetProvider);

const sdk = getTestnetSdk(defaultSigner);

const lockTransaction = await sdk.peggy.bridgeBank.lock(
  "some_address",
  "token_symbol",
  1_000_000,
);

await lockTransaction.wait();

const burnTransaction = await sdk.peggy.bridgeBank.burn(
  "some_address",
  "token_symbol",
  1_000_000,
);

await burnTransaction.wait();
```
