import { formatNumberAsCurrency } from "@sifchain/ui";

/**
 * ********************************************************************************************
 *
 * Utilities for "Margin > Trade" page. Trade Entry sidebar design
 *
 * ********************************************************************************************
 */
export function HtmlUnicode({ name }: { name: string }) {
  const unicodes: Record<string, string | string> = {
    AlmostEqualTo: "&#x2248;", // https://www.compart.com/en/unicode/U+2248
    RightwardsArrow: "&rightarrow;", // https://www.compart.com/en/unicode/U+2192
    EqualsSign: "&equals;", // https://www.compart.com/en/unicode/U+003D
  };
  const entity = unicodes[name] || `MISSING_UNICODE: ${name}`;
  return <span dangerouslySetInnerHTML={{ __html: entity }} />;
}

export function ValueFromTo({
  from,
  to,
  almostEqual,
  className,
}: {
  from: string;
  to: string;
  almostEqual?: boolean;
  className?: string;
}) {
  return (
    <span className={className}>
      {almostEqual ? <HtmlUnicode name="AlmostEqualTo" /> : null}
      <span className="ml-1 mr-1">{from}</span>
      <HtmlUnicode name="RightwardsArrow" />
      <span className="ml-1">{to}</span>
    </span>
  );
}

/**
 * ********************************************************************************************
 *
 * Trade Entry Sidebar: Collateral Input Constants and Form Errors
 *
 * ********************************************************************************************
 */
export const COLLATERAL_MIN_VALUE = 0;
export const COLLATERAL_MAX_VALUE = 1000000;

/** @TODO Validate error message states with PM */
const COLLATERAL_ERRORS = {
  INVALID_NUMBER: `Collateral amount must be between ${formatNumberAsCurrency(
    0,
  )} and ${formatNumberAsCurrency(COLLATERAL_MAX_VALUE)}`,
  INVALID_RANGE: `Collateral amount must be between ${formatNumberAsCurrency(
    0,
  )} and ${formatNumberAsCurrency(COLLATERAL_MAX_VALUE)}`,
};
export function inputValidatorCollateral(
  $input: HTMLInputElement,
  event: "blur" | "change",
) {
  const value = Number($input.value);
  const payload = {
    value: $input.value,
    error: "",
  };

  if ($input.value !== "" && Number.isNaN(value)) {
    payload.error = COLLATERAL_ERRORS.INVALID_NUMBER;
  }

  if (
    $input.value !== "" &&
    (value > COLLATERAL_MAX_VALUE || value < COLLATERAL_MIN_VALUE)
  ) {
    payload.error = COLLATERAL_ERRORS.INVALID_RANGE;
  }

  if (event === "blur" && $input.value === "") {
    payload.error = COLLATERAL_ERRORS.INVALID_NUMBER;
  }

  return payload;
}

/**
 * ********************************************************************************************
 *
 * Trade Entry Sidebar: Position Input Constants and Form Errors
 *
 * ********************************************************************************************
 */
export const POSITION_MIN_VALUE = 0;
export const POSITION_MAX_VALUE = 1000000;

/** @TODO Validate error message states with PM */
const POSITION_ERRORS = {
  INVALID_NUMBER: `Position amount must be between ${formatNumberAsCurrency(
    0,
  )} and ${formatNumberAsCurrency(POSITION_MAX_VALUE)}`,
  INVALID_RANGE: `Position amount must be between ${formatNumberAsCurrency(
    0,
  )} and ${formatNumberAsCurrency(POSITION_MAX_VALUE)}`,
};
export function inputValidatorPosition(
  $input: HTMLInputElement,
  event: "blur" | "change",
) {
  const value = Number($input.value);
  const payload = {
    value: $input.value,
    error: "",
  };

  if ($input.value !== "" && Number.isNaN(value)) {
    payload.error = POSITION_ERRORS.INVALID_NUMBER;
  }

  if (
    $input.value !== "" &&
    (value > POSITION_MAX_VALUE || value < POSITION_MIN_VALUE)
  ) {
    payload.error = POSITION_ERRORS.INVALID_RANGE;
  }

  if (event === "blur" && $input.value === "") {
    payload.error = POSITION_ERRORS.INVALID_NUMBER;
  }

  return payload;
}

/**
 * ********************************************************************************************
 *
 * Trade Entry Sidebar: Leverage Input Constants and Form Errors
 *
 * ********************************************************************************************
 */
export const LEVERAGE_MIN_VALUE = 0;
export const LEVERAGE_MAX_VALUE = 2;

/** @TODO Validate error message states with PM */
const LEVERAGE_ERRORS = {
  INVALID_NUMBER: "Leverage amount must be between 0 and 2",
  INVALID_RANGE: "Leverage amount must be between 0 and 2",
};
export function inputValidatorLeverage(
  $input: HTMLInputElement,
  event: "blur" | "change",
) {
  const value = Number($input.value);
  const payload = {
    value: $input.value,
    error: "",
  };

  if ($input.value !== "" && Number.isNaN(value)) {
    payload.error = LEVERAGE_ERRORS.INVALID_NUMBER;
  }

  if (
    $input.value !== "" &&
    (value > LEVERAGE_MAX_VALUE || value < LEVERAGE_MIN_VALUE)
  ) {
    payload.error = LEVERAGE_ERRORS.INVALID_RANGE;
  }

  if (event === "blur" && $input.value === "") {
    payload.error = LEVERAGE_ERRORS.INVALID_NUMBER;
  }

  return payload;
}
