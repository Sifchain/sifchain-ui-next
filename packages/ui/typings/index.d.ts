declare module "walletconnect-qrcode-modal" {
  interface IWallectConnectModal {
    open(uri: string): void;
  }
  const WallectConnectModal: IWallectConnectModal;
  export default WallectConnectModal;
}
