export const maskWalletAddress = (account: string) =>
  account.slice(0, 4) + "..." + account.slice(-4);
