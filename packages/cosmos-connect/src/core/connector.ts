import type { OfflineSigner } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { ChainStore } from "@keplr-wallet/stores";
import type { ChainInfo, Keplr } from "@keplr-wallet/types";
import { KeplrWalletConnectV1 } from "@keplr-wallet/wc-client";
import WalletConnect from "@walletconnect/client";
import EventEmitter from "eventemitter3";
import { KeplrQRCodeModalV1 } from "@keplr-wallet/wc-qrcode-modal";

export type ConnectorEvents = {
  connect(): void;
  disconnect(): void;
};

export abstract class BaseCosmConnector<
  Options = any,
> extends EventEmitter<ConnectorEvents> {
  /** Unique connector id */
  abstract readonly id: string;
  /** Connector name */
  abstract readonly name: string;
  /** Options to use with connector */
  readonly options: Options;

  constructor(options: Options) {
    super();
    this.options = options;
  }

  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract getSigner(chainId: string): Promise<OfflineSigner>;
  abstract getSigningStargateClient(
    chainId: string,
  ): Promise<SigningStargateClient>;
}

export class InjectedKeplrConnector extends BaseCosmConnector<{
  chainInfos: ChainInfo[];
}> {
  readonly id = "keplr";
  readonly name = "Keplr";

  #keplr: Keplr | undefined;
  readonly #chainStore = new ChainStore(this.options.chainInfos);

  async connect() {
    this.#keplr = await this.#getKeplr();
    this.emit("connect");
  }

  async disconnect() {
    this.emit("disconnect");
  }

  async getSigner(chainId: string): Promise<OfflineSigner> {
    await this.#keplr?.experimentalSuggestChain(
      this.#chainStore.getChain(chainId),
    );
    await this.#keplr?.enable(chainId);
    return this.#keplr!.getOfflineSignerAuto(chainId);
  }

  async getSigningStargateClient(
    chainId: string,
  ): Promise<SigningStargateClient> {
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
}

export class KeplrWalletConnectConnector extends BaseCosmConnector<{
  chainInfos: ChainInfo[];
}> {
  readonly id = "keplrWalletConnect";
  readonly name = "Wallet Connect";

  readonly #walletConnect = new WalletConnect({
    bridge: "https://bridge.walletconnect.org",
    signingMethods: [
      "keplr_enable_wallet_connect_v1",
      "keplr_sign_amino_wallet_connect_v1",
    ],
    qrcodeModal: new KeplrQRCodeModalV1(),
  });

  readonly #keplr = new KeplrWalletConnectV1(this.#walletConnect, {
    sendTx: async (chainId, tx, mode) => {
      const chainInfo = this.#chainStore.getChain(chainId);

      const url = new URL("txs", chainInfo?.rpc);
      url.searchParams.append("tx", JSON.stringify(tx));
      url.searchParams.append("mode", JSON.stringify(mode));

      const result = await fetch(url.toString(), {
        method: "post",
      }).then((x) => x.json());

      return Buffer.from(result.txhash, "hex");
    },
  });

  readonly #chainStore = new ChainStore(this.options.chainInfos);

  constructor(options: { chainInfos: ChainInfo[] }) {
    super(options);
    this.#walletConnect.on("connect", (error) => {
      if (error === undefined) this.emit("connect");
    });
    this.#walletConnect.on("disconnect", () => {
      this.emit("disconnect");
    });
  }

  async connect() {
    if (this.#walletConnect.connected) return;

    try {
      await this.#walletConnect.connect();
    } catch (error) {
      console.error(error);
    }
  }

  async disconnect() {
    await this.#walletConnect.killSession();
    await new Promise<void>((resolve) => {
      this.#walletConnect.on("disconnect", () => resolve());
    });
  }

  async getSigner(chainId: string): Promise<OfflineSigner> {
    await this.#keplr?.enable(chainId);
    return this.#keplr.getOfflineSignerOnlyAmino(chainId);
  }

  async getSigningStargateClient(
    chainId: string,
  ): Promise<SigningStargateClient> {
    return SigningStargateClient.connectWithSigner(
      this.#chainStore.getChain(chainId).rpc,
      await this.getSigner(chainId),
    );
  }
}
