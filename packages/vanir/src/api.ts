import ky from "ky";
import { ENDPOINTS, EvnKind } from "./config";

export type Response<T = any> = {
  statusCode: number;
  body: T;
};

export type PoolStat = {
  symbol: string;
  priceToken: number;
  poolDepth: number;
  poolTVL: number;
  volume: number;
  arb: number;
  dailySwapFees: number;
  poolBalance: number;
  poolBalanceInRowan: number;
  accruedNumBlocksRewards: number;
  rewardPeriodNativeDistributed: number;
  blocksPerYear: number;
  rewardApr: number;
  poolApr: number;
};

export type TokenStatsResponse = {
  rowanUSD: string;
  pools: PoolStat[];
};

export default function createClient(env: EvnKind) {
  const prefixUrl = ENDPOINTS[env];

  const baseClient = ky.extend({ prefixUrl });

  return {
    ...baseClient,
    async getTokenStats() {
      try {
        const result = await baseClient
          .get("/asset/tokenStats")
          .json<Response<{}>>();
      } catch (error) {
        throw error;
      }
    },
  };
}
