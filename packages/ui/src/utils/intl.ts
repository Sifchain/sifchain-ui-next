/**
 * Formats a number as currency.
 *
 * @param number - number to format
 * @returns formatted currency
 */
export function formatNumberAsCurrency(number: number, decimals = 2): string {
  const formatter = Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(number);
}

/**
 * Formats a number as decimal.
 *
 * @param number - number to format
 * @returns formatted currency
 */
export function formatNumberAsDecimal(number: number, decimals = 2): string {
  const formatter = Intl.NumberFormat(undefined, {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });

  return formatter.format(number);
}
