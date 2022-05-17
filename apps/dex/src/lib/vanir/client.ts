import ky from "ky";

export type Response<T = any> = {
  statusCode: number;
  body: T;
};

export type PoolStats = {
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

export type TokenStatsResponseBody = {
  rowanUSD: string;
  pools: PoolStats[];
};

/**
 * Vanit Http Client
 * @param prefixUrl
 * @returns
 */
export function createClient(prefixUrl: string) {
  const baseClient = ky.extend({ prefixUrl });

  return {
    ...baseClient,
    async getTokenStats() {
      try {
        const result = await baseClient
          .get("asset/tokenStats")
          .json<Response<TokenStatsResponseBody>>();

        return result.body;
      } catch (error) {
        throw error;
      }
    },
  };
}
