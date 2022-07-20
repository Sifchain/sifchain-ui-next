import { NetworkKind } from "./Network";

export function Token(p: {
  address: string;
  decimals: number;
  imageUrl?: string;
  name: string;
  network: NetworkKind;
  symbol: string;
}) {
  return p;
}

export type Token = ReturnType<typeof Token>;
