import { formatNumberAsCurrency } from "@sifchain/ui";

const UNICODE_CHARS = {
  AlmostEqualTo: "&#x2248;", // https://www.compart.com/en/unicode/U+2248
  RightwardsArrow: "&rightarrow;", // https://www.compart.com/en/unicode/U+2192
  EqualsSign: "&equals;", // https://www.compart.com/en/unicode/U+003D
  MiddleDot: "&centerdot;", // https://www.compart.com/en/unicode/U+00B7
  MinusSign: "&minus;", // https://www.compart.com/en/unicode/U+2212
  EmDash: "&mdash;", // https://www.compart.com/en/unicode/U+2014
};

/**
 * ********************************************************************************************
 *
 * Utilities for "Margin > Trade" page. Trade Entry sidebar design
 *
 * ********************************************************************************************
 */
type HtmlUnicodeProps = {
  name: keyof typeof UNICODE_CHARS;
};

export function HtmlUnicode({ name }: HtmlUnicodeProps) {
  const entity = UNICODE_CHARS[name] || `MISSING_UNICODE: ${name}`;
  return <span dangerouslySetInnerHTML={{ __html: entity }} />;
}

/**
 * ********************************************************************************************
 *
 * Trade Entry Sidebar: Collateral Input Constants and Form Errors
 *
 * ********************************************************************************************
 */
export const COLLATERAL_MIN_VALUE = 0;
export const COLLATERAL_MAX_VALUE = Number.MAX_SAFE_INTEGER;

/** @TODO Validate error message states with PM */
const COLLATERAL_ERRORS = {
  INVALID_NUMBER: `Enter a value greater than ${formatNumberAsCurrency(0)}`,
  INVALID_RANGE: `Collateral amount must be between ${formatNumberAsCurrency(0)} and ${formatNumberAsCurrency(
    COLLATERAL_MAX_VALUE,
  )}`,
  INSUFFICIENT_BALANCE: "Insufficient balance",
};
export function inputValidatorCollateral($input: HTMLInputElement, event: "blur" | "change") {
  const value = Number($input.value);
  const payload = {
    value: $input.value,
    error: "",
  };

  if ($input.value !== "" && Number.isNaN(value)) {
    payload.error = COLLATERAL_ERRORS.INVALID_NUMBER;
  }

  if ($input.value !== "" && (value > COLLATERAL_MAX_VALUE || value < COLLATERAL_MIN_VALUE)) {
    payload.error = COLLATERAL_ERRORS.INVALID_RANGE;
  }

  if (event === "blur" && $input.value === "") {
    payload.error = COLLATERAL_ERRORS.INVALID_NUMBER;
  }

  if (event === "blur" && Number($input.value) === 0) {
    payload.error = COLLATERAL_ERRORS.INVALID_NUMBER;
  }

  // @TODO If they enter collateral that is greater than their available balance:
  // Return validation for INSUFFICIENT_BALANCE

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
export const POSITION_MAX_VALUE = Number.MAX_SAFE_INTEGER;

/** @TODO Validate error message states with PM */
const POSITION_ERRORS = {
  INVALID_NUMBER: `Enter a value greater than ${formatNumberAsCurrency(0)}`,
  INVALID_RANGE: `Position amount must be between ${formatNumberAsCurrency(0)} and ${formatNumberAsCurrency(
    POSITION_MAX_VALUE,
  )}`,
  POSITION_SIZE_EXCEEDS_LEVERAGE_LIMITS: "Position size exceeds leverage limits",
};
export function inputValidatorPosition($input: HTMLInputElement, event: "blur" | "change") {
  const value = Number($input.value);
  const payload = {
    value: $input.value,
    error: "",
  };

  if ($input.value !== "" && Number.isNaN(value)) {
    payload.error = POSITION_ERRORS.INVALID_NUMBER;
  }

  if ($input.value !== "" && (value > POSITION_MAX_VALUE || value < POSITION_MIN_VALUE)) {
    payload.error = POSITION_ERRORS.INVALID_RANGE;
  }

  if (event === "blur" && $input.value === "") {
    payload.error = POSITION_ERRORS.INVALID_NUMBER;
  }

  if (event === "blur" && Number($input.value) === 0) {
    payload.error = POSITION_ERRORS.INVALID_NUMBER;
  }

  // @TODO If they enter position that amounts to greater than 2x leverage:
  // Return validation for POSITION_SIZE_EXCEEDS_LEVERAGE_LIMITS

  return payload;
}

/**
 * ********************************************************************************************
 *
 * Trade Entry Sidebar: Leverage Input Constants and Form Errors
 *
 * ********************************************************************************************
 */
export const LEVERAGE_MIN_VALUE = "1";

/** @TODO Validate error message states with PM */
const LEVERAGE_ERRORS = {
  INVALID_NUMBER: (min: string, max: string) => `Leverage amount must be greater than ${min} and up to ${max}`,
  INVALID_RANGE: (min: string, max: string) => `Leverage amount must be greater than ${min} and up to ${max}`,
};
export function inputValidatorLeverage($input: HTMLInputElement, event: "blur" | "change", leverageMax: string) {
  const value = Number($input.value);
  const payload = {
    value: $input.value,
    error: "",
  };

  if ($input.value !== "" && Number.isNaN(value)) {
    payload.error = LEVERAGE_ERRORS.INVALID_NUMBER(LEVERAGE_MIN_VALUE, leverageMax);
  }

  if ($input.value !== "" && (value > Number(leverageMax) || value <= Number(LEVERAGE_MIN_VALUE))) {
    payload.error = LEVERAGE_ERRORS.INVALID_RANGE(LEVERAGE_MIN_VALUE, leverageMax);
  }

  if (event === "blur" && $input.value === "") {
    payload.error = LEVERAGE_ERRORS.INVALID_NUMBER(LEVERAGE_MIN_VALUE, leverageMax);
  }

  return payload;
}
