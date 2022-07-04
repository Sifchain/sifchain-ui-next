import { Coin } from "@cosmjs/stargate";

export const isEvmBridgedCoin = (coin: Coin | string) => {
  const denom = typeof coin === "string" ? coin : coin.denom;
  return (
    denom !== "rowan" &&
    !denom.startsWith("ibc/") &&
    (denom.startsWith("c") || denom.startsWith("sifBridge"))
  );
};
