import { describe, expect, test } from "vitest";
import { Asset } from "./Asset";
import { AssetAmount } from "./AssetAmount";

import { Pair } from "./Pair";

describe("Pair", () => {
  const ATK = Asset({
    decimals: 6,
    symbol: "atk",
    label: "ATK",
    displaySymbol: "ATK",
    name: "AppleToken",
    address: "123",
    network: "ethereum",
    homeNetwork: "ethereum",
  });
  const BTK = Asset({
    decimals: 18,
    symbol: "btk",
    label: "BTK",
    displaySymbol: "BTK",
    name: "BananaToken",
    address: "1234",
    network: "ethereum",
    homeNetwork: "ethereum",
  });
  const ETH = Asset({
    decimals: 18,
    symbol: "eth",
    displaySymbol: "ETH",
    label: "ETH",
    name: "Ethereum",
    network: "ethereum",
    homeNetwork: "ethereum",
  });
  const ROWAN = Asset({
    decimals: 18,
    symbol: "rowan",
    displaySymbol: "ROWAN",
    label: "ROWAN",
    name: "Rowan",
    network: "sifchain",
    homeNetwork: "ethereum",
  });

  test("contains()", () => {
    const pair = new Pair(AssetAmount(ATK, "10"), AssetAmount(BTK, "10"));

    expect(pair.contains(ATK)).toBe(true);
    expect(pair.contains(BTK)).toBe(true);
    expect(pair.contains(ROWAN)).toBe(false);
  });
  test("other asset", () => {
    const pair = new Pair(AssetAmount(ATK, "10"), AssetAmount(BTK, "10"));
    expect(pair.otherAsset(ATK).symbol).toBe("btk");
  });
  describe("when half", () => {
    const pair = new Pair(AssetAmount(ATK, "5"), AssetAmount(BTK, "10"));

    test("pair has symbol", () => {
      expect(pair.symbol()).toEqual("atk_btk");
    });
  });
});
