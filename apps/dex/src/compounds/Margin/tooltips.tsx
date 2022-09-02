import { forwardRef } from "react";

import { InfoIcon, Tooltip } from "@sifchain/ui";

export const InfoIconForwardRef = forwardRef<HTMLSpanElement | null>((props, ref) => (
  <span ref={ref}>
    <InfoIcon width="16px" height="16px" {...props} />
  </span>
));
InfoIconForwardRef.displayName = "InfoIconForwardRef";

export const TooltipInterestPaid = () => {
  return (
    <Tooltip content="Interest payments are taken from the open position and paid automatically to the pool.">
      <InfoIconForwardRef />
    </Tooltip>
  );
};

export const TooltipInterestRate = () => {
  return (
    <Tooltip content="Interest rates are re-calculated per block based on pool health.">
      <InfoIconForwardRef />
    </Tooltip>
  );
};

export const TooltipPoolHealth = () => {
  const TOOLTIP_POOL_HEALTH_TITLE = `What does "Pool health" mean?`;
  const TOOLTIP_POOL_HEALTH_CONTENT =
    "Pool health is defined by taking total assets divided by all assets + outstanding liabilities. This health equation considers assets and liabilities held for both sides of the pool. The value can range from 0 to 100%. With a value of 100% the pool has no outstanding liabilities.";
  return (
    <Tooltip title={TOOLTIP_POOL_HEALTH_TITLE} content={TOOLTIP_POOL_HEALTH_CONTENT}>
      <InfoIconForwardRef />
    </Tooltip>
  );
};

export const TooltipLiquidationThreshold = () => {
  const TOOLTIP_LIQUIDATION_THRESHOLD_TITLE = `What does "Liquidation Threshold" mean?`;
  const TOOLTIP_LIQUIDATION_THRESHOLD_CONTENT =
    "In order to protect liquidity within each pool, a liquidation threshold is used to automatically close positions when liquidation ratios reach the liquidation threshold.";
  return (
    <Tooltip title={TOOLTIP_LIQUIDATION_THRESHOLD_TITLE} content={TOOLTIP_LIQUIDATION_THRESHOLD_CONTENT}>
      <InfoIconForwardRef />
    </Tooltip>
  );
};

export const TooltipNpv = () => {
  const TOOLTIP_NPV_TITLE = `What does "NPV" mean?`;
  const TOOLTIP_NPV_CONTENT =
    "Net present value (NPV) represents the value of the position given spot prices for each asset involved in the trade. NPV does not represent the final amount you would receive if you close the position.";
  return (
    <Tooltip title={TOOLTIP_NPV_TITLE} content={TOOLTIP_NPV_CONTENT}>
      <InfoIconForwardRef />
    </Tooltip>
  );
};

export const TooltipLiquidationRatio = () => {
  const TOOLTIP_LIQUIDATION_RATIO_TITLE = `What does "LR" means?`;
  const TOOLTIP_LIQUIDATION_RATIO_CONTENT =
    "Liquidation ratio (LR) is defined by the current value of the position divided by outstanding liabilities. As the liquidation ratio decreases, the position becomes more at risk for liquidation. A safety factor is set for all pools which defines the liquidation ratio level at which positions are automatically closed before the liabilities become greater than the value held.";
  return (
    <Tooltip title={TOOLTIP_LIQUIDATION_RATIO_TITLE} content={TOOLTIP_LIQUIDATION_RATIO_CONTENT}>
      <InfoIconForwardRef />
    </Tooltip>
  );
};
