import { formatNumberAsCurrency, formatNumberAsDecimal } from "@sifchain/ui";

const UNICODE_CHARS = {
  AlmostEqualTo: "&#x2248;", // https://www.compart.com/en/unicode/U+2248
  Ampersand: "&amp;", // https://www.compart.com/en/unicode/U+0026
  EmDash: "&mdash;", // https://www.compart.com/en/unicode/U+2014
  EqualsSign: "&equals;", // https://www.compart.com/en/unicode/U+003D
  MiddleDot: "&centerdot;", // https://www.compart.com/en/unicode/U+00B7
  MinusSign: "&minus;", // https://www.compart.com/en/unicode/U+2212
  PlusSign: "&#x2B;", // https://www.compart.com/en/unicode/U+002B
  RightwardsArrow: "&rightarrow;", // https://www.compart.com/en/unicode/U+2192
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
  className?: string;
};

export function HtmlUnicode({ name, className }: HtmlUnicodeProps) {
  const entity = UNICODE_CHARS[name] || `MISSING_UNICODE: ${name}`;
  return <span dangerouslySetInnerHTML={{ __html: entity }} className={className} />;
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
const COLLATERAL_ERRORS = {
  INVALID_NUMBER: `Enter a value greater than ${formatNumberAsCurrency(0)}`,
  INVALID_RANGE: `Collateral amount must be between ${formatNumberAsCurrency(0)} and ${formatNumberAsCurrency(
    COLLATERAL_MAX_VALUE,
  )}`,
  INSUFFICIENT_BALANCE: (value: number, balance: number) =>
    `Insufficient collateral balance: ${formatNumberAsDecimal(value)} is greater than ${formatNumberAsDecimal(
      balance,
    )}.`,
};
export function inputValidatorCollateral($input: HTMLInputElement, collateralBalance: number) {
  const valueAsNumber = Number($input.value);
  const payload = {
    value: $input.value,
    error: "",
  };

  if ($input.value !== "" && Number.isNaN(valueAsNumber)) {
    payload.error = COLLATERAL_ERRORS.INVALID_NUMBER;
  }

  if ($input.value !== "" && (valueAsNumber > COLLATERAL_MAX_VALUE || valueAsNumber < COLLATERAL_MIN_VALUE)) {
    payload.error = COLLATERAL_ERRORS.INVALID_RANGE;
  }

  if ($input.value === "") {
    payload.error = COLLATERAL_ERRORS.INVALID_NUMBER;
  }

  if (valueAsNumber === 0) {
    payload.error = COLLATERAL_ERRORS.INVALID_NUMBER;
  }

  if (valueAsNumber > collateralBalance) {
    payload.error = COLLATERAL_ERRORS.INSUFFICIENT_BALANCE(valueAsNumber, collateralBalance);
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
export const POSITION_MAX_VALUE = Number.MAX_SAFE_INTEGER;
const POSITION_ERRORS = {
  INVALID_NUMBER: `Enter a value greater than ${formatNumberAsCurrency(0)}`,
  INVALID_RANGE: `Position amount must be between ${formatNumberAsCurrency(0)} and ${formatNumberAsCurrency(
    POSITION_MAX_VALUE,
  )}`,
};
export function inputValidatorPosition($input: HTMLInputElement) {
  const valueAsNumber = Number($input.value);
  const payload = {
    value: $input.value,
    error: "",
  };

  if ($input.value !== "" && Number.isNaN(valueAsNumber)) {
    payload.error = POSITION_ERRORS.INVALID_NUMBER;
  }

  if ($input.value !== "" && (valueAsNumber > POSITION_MAX_VALUE || valueAsNumber < POSITION_MIN_VALUE)) {
    payload.error = POSITION_ERRORS.INVALID_RANGE;
  }

  if ($input.value === "") {
    payload.error = POSITION_ERRORS.INVALID_NUMBER;
  }

  if (valueAsNumber === 0) {
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
export const LEVERAGE_MIN_VALUE = "1";
const LEVERAGE_ERRORS = {
  INVALID_NUMBER: (min: string, max: string) => `Leverage amount must be greater than ${min} and up to ${max}`,
  INVALID_RANGE: (min: string, max: string) => `Leverage amount must be greater than ${min} and up to ${max}`,
};
export function inputValidatorLeverage($input: HTMLInputElement, leverageMax: string) {
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

  if ($input.value === "") {
    payload.error = LEVERAGE_ERRORS.INVALID_NUMBER(LEVERAGE_MIN_VALUE, leverageMax);
  }

  return payload;
}

export function removeFirstCharsUC(param: string) {
  const isFirstU = param.charAt(0).toLowerCase() === "u";
  const isFirstC = param.charAt(0).toLowerCase() === "c";
  if (isFirstU || isFirstC) {
    return param.slice(1);
  }
  return param;
}
