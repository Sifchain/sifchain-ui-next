export const currencyFormatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formats a number as currency.
 *
 * @param number - number to format
 * @returns formatted currency
 */
export function formatNumberAsCurrency(number: number): string {
  return currencyFormatter.format(number);
}
