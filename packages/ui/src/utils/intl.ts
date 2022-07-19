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
