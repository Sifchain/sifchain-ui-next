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

// approval is needed for erc 20 token
if (IS_ERC_20_TOKEN) {
  const erc20Abi = ["function approve(address _spender, uint256 _value) public returns (bool success)"];
  const contract = new ethers.Contract("erc_20_token_address", erc20Abi, signer);

  const approveTransaction = await contract["approve"](sdk.peggy.bridgeBank.address, 1_000_000);

  await approveTransaction.wait();
}

const lockTransaction = await sdk.peggy.bridgeBank.lock(
  ethers.utils.toUtf8Bytes("cosmos_recipient_address"),
  "erc20_token_address",
  1_000_000,
);

await lockTransaction.wait();

const burnTransaction = await sdk.peggy.bridgeBank.burn(
  ethers.utils.toUtf8Bytes("cosmos_recipient_address"),
  "erc20_token_address",
  1_000_000,
);

await burnTransaction.wait();

// convenience method for sending tokens to Cosmos
const burnOrLockTransaction = await sdk.peggy.sendTokensToCosmos(
  ethers.utils.toUtf8Bytes("cosmos_recipient_address"),
  "erc20_token_address",
  ethers.utils.parseEther("1.0"),
);

await burnOrLockTransaction.wait();
```
