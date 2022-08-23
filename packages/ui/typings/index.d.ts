declare module "walletconnect-qrcode-modal" {
  interface IWalletConnectModal {
    open(uri: string): void;
  }
  const WalletConnectModal: IWalletConnectModal;
  export default WalletConnectModal;
}
