import type { OfflineSigner } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { ChainStore } from "@keplr-wallet/stores";
import type { ChainInfo } from "@keplr-wallet/types";
import { KeplrWalletConnectV1 } from "@keplr-wallet/wc-client";
import { KeplrQRCodeModalV1 } from "@keplr-wallet/wc-qrcode-modal";
import WalletConnect from "@walletconnect/client";
import type { IClientMeta } from "@walletconnect/types";
import { BaseCosmConnector } from "./base";

export type KeplrWalletConnectConnectorOptions = {
  chainInfos: ChainInfo[];
  modalUiOptions?: ConstructorParameters<typeof KeplrQRCodeModalV1>["0"];
  clientMeta: IClientMeta;
};

export class KeplrWalletConnectConnector extends BaseCosmConnector<KeplrWalletConnectConnectorOptions> {
  readonly id = "keplrWalletConnect";
  readonly name = "Wallet Connect";

  readonly #walletConnect = new WalletConnect({
    bridge: "https://bridge.walletconnect.org",
    signingMethods: [
      "keplr_enable_wallet_connect_v1",
      "keplr_sign_amino_wallet_connect_v1",
    ],
    clientMeta: this.options.clientMeta,
    qrCodeModal: new KeplrQRCodeModalV1(this.options.modalUiOptions),
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

  constructor(options: KeplrWalletConnectConnectorOptions) {
    super(options);
    this.#walletConnect.on("connect", (error) => {
      if (error === undefined) this.emit("connect");
    });
    this.#walletConnect.on("disconnect", () => {
      this.emit("disconnect");
    });
  }

  get connected() {
    return this.#walletConnect.connected;
  }

  async connect() {
    if (this.#walletConnect.connected) return;

    await this.#walletConnect.connect();
  }

  async disconnect() {
    await this.#walletConnect.killSession();
    await new Promise<void>((resolve) => {
      this.#walletConnect.on("disconnect", () => resolve());
    });
  }

  async getSigner(chainId: string): Promise<OfflineSigner> {
    await this.#keplr.enable(chainId);
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
