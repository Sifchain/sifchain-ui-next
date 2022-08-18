import type { OfflineSigner } from "@cosmjs/proto-signing";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { ChainStore } from "@keplr-wallet/stores";
import type { ChainInfo, Keplr } from "@keplr-wallet/types";
import { BaseCosmConnector } from "./base";

export type InjectedKeplrConnectorOptions = {
  chainInfos: ChainInfo[];
};

export class InjectedKeplrConnector extends BaseCosmConnector<InjectedKeplrConnectorOptions> {
  readonly id = "keplr";
  readonly name = "Keplr";

  readonly #chainStore = new ChainStore(this.options.chainInfos);

  #keplr: Keplr | undefined = window.keplr;

  get connected() {
    return this.#keplr !== undefined;
  }

  constructor(options: InjectedKeplrConnectorOptions) {
    super(options);
    window.addEventListener("keplr_keystorechange", this.#keystoreChangeListener);
  }

  async connect() {
    const windowKeplr = await this.#getKeplr();

    if (windowKeplr === undefined) {
      throw new Error("Keplr extension not installed");
    }

    this.#keplr = windowKeplr;
    this.emit("connect");

    window.addEventListener("keplr_keystorechange", this.#keystoreChangeListener);
  }

  disconnect() {
    this.#keplr = undefined;
    this.emit("disconnect");

    window.removeEventListener("keplr_keystorechange", this.#keystoreChangeListener);

    return Promise.resolve();
  }

  async getSigner(chainId: string): Promise<OfflineSigner> {
    if (this.#keplr === undefined) {
      throw new Error("Keplr instance is undefined");
    }

    await this.#keplr.experimentalSuggestChain(this.#chainStore.getChain(chainId).raw);
    await this.#keplr.enable(chainId);
    return this.#keplr.getOfflineSignerAuto(chainId);
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

  async #getKeplr() {
    if (window.keplr !== undefined) {
      return window.keplr;
    }

    if (document.readyState === "complete") {
      return window.keplr;
    }

    return new Promise<Keplr | undefined>((resolve) => {
      const documentStateChange = (event: Event) => {
        if ((event.target as Document | null)?.readyState === "complete") {
          resolve(window.keplr);
          document.removeEventListener("readystatechange", documentStateChange);
        }
      };

      document.addEventListener("readystatechange", documentStateChange);
    });
  }

  #keystoreChangeListener = () => {
    this.emit("change");
  };
}
