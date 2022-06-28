# @sifchain/evm

## Installation

```sh
yarn add @sifchain/evm@snapshot
```

## Example usage

```ts
import { getTestnetSdk } from "@sifchain/evm";
import { ethers } from "ethers";

const testnetProvider = ethers.getDefaultProvider("testnet");
const defaultSigner = ethers.Wallet.createRandom().connect(testnetProvider);

const sdk = getTestnetSdk(defaultSigner);

const lockTransaction = await sdk.peggy.bridgeBank.lock(
  "cosmos_recipient_address",
  "erc20_token_address",
  1_000_000,
);

await lockTransaction.wait();

const burnTransaction = await sdk.peggy.bridgeBank.burn(
  "cosmos_recipient_address",
  "erc20_token_address",
  1_000_000,
);

await burnTransaction.wait();

// convenience method for sending tokens to Cosmos
const burnOrLockTransaction = await sdk.peggy.sendTokensToCosmos(
  "cosmos_recipient_address",
  "erc20_token_address",
  ethers.utils.parseEther("1.0"),
);

await burnOrLockTransaction.wait();
```
