import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { ChainStore } from "@keplr-wallet/stores";
import type { ChainInfo } from "@keplr-wallet/types";
import { BaseCosmConnector } from "./base";

export type MnemonicConnectorOptions = {
  mnemonic: string;
  chainInfos: ChainInfo[];
  // useful for e2e testing
  simulateDisconnect: boolean;
};

export class MnemonicConnector extends BaseCosmConnector<MnemonicConnectorOptions> {
  readonly id = "directSecp256k1HdWallet";
  readonly name = "Direct Secp256k1 HD Wallet";

  #chainStore = new ChainStore(this.options.chainInfos);

  #connectedSim = false;

  get connected() {
    return this.options.simulateDisconnect ? this.#connectedSim : true;
  }

  connect() {
    this.#connectedSim = true;
    this.emit("connect");
    return Promise.resolve();
  }

  disconnect() {
    this.#connectedSim = false;
    this.emit("disconnect");
    return Promise.resolve();
  }

  async getSigner(chainId: string) {
    return DirectSecp256k1HdWallet.fromMnemonic(this.options.mnemonic, {
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
