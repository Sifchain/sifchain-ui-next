import { addMilliseconds } from "date-fns";

export const getLiquidityUnlockStatus = (
  requestHeight: number,
  lockDuration: number,
  cancelDuration: number,
  currentHeight: number,
  estimatedBlockTimeMs: number,
) => {
  const unlockedAtHeight = requestHeight + lockDuration;
  const expiredAtHeight = unlockedAtHeight + cancelDuration;
  const expired = currentHeight >= expiredAtHeight;
  const ready = currentHeight >= unlockedAtHeight && !expired;

  const blocksUntilUnlock = unlockedAtHeight - currentHeight;
  const blockUntilExpiration = expiredAtHeight - currentHeight;

  const unlockDate =
    blocksUntilUnlock <= 0
      ? undefined
      : addMilliseconds(new Date(), estimatedBlockTimeMs * blocksUntilUnlock);

  const expiration =
    blockUntilExpiration <= 0
      ? undefined
      : addMilliseconds(
          new Date(),
          estimatedBlockTimeMs * blockUntilExpiration,
        );

  return {
    ready,
    expired,
    unlockedAtHeight,
    expiredAtHeight,
    unlockDate,
    expiration,
  };
};
