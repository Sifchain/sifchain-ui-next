import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { ChainStore } from "@keplr-wallet/stores";
import type { ChainInfo } from "@keplr-wallet/types";
import { BaseCosmConnector } from "./base";

export type MnemonicConnectorOptions = {
  chainInfos: ChainInfo[];
  mnemonic?: string;
};

export class MnemonicConnector extends BaseCosmConnector<MnemonicConnectorOptions> {
  readonly id = "directSecp256k1HdWallet";
  readonly name = "Direct Secp256k1 HD Wallet";

  #chainStore = new ChainStore(this.options.chainInfos);

  #mnemonic = this.options.mnemonic;

  get connected() {
    return this.#mnemonic !== undefined;
  }

  async connect() {
    const mnemonic = this.options.mnemonic ?? window.prompt("Enter wallet mnemonic");

    if (mnemonic === null) {
      throw new Error("Invalid mnemonic");
    }

    // testing to see if mnemonic is valid
    await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);

    this.#mnemonic = mnemonic;
    this.emit("connect");
    return Promise.resolve();
  }

  disconnect() {
    this.emit("disconnect");
    return Promise.resolve();
  }

  async getSigner(chainId: string) {
    if (this.#mnemonic === undefined) {
      throw new Error("Invalid mnemonic");
    }

    return DirectSecp256k1HdWallet.fromMnemonic(this.#mnemonic, {
      prefix: this.#chainStore.getChain(chainId).bech32Config.bech32PrefixAccAddr,
    });
  }

  async getStargateClient(chainId: string): Promise<StargateClient> {
    return SigningStargateClient.connect(this.#chainStore.getChain(chainId).rpc);
  }

  async getSigningStargateClient(chainId: string): Promise<SigningStargateClient> {
    return SigningStargateClient.connectWithSigner(
      this.#chainStore.getChain(chainId).rpc,
      await this.getSigner(chainId),
    );
  }
}
