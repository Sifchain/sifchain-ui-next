import { formatDistance, formatRelative } from "date-fns";

export function formatDateRelative(date: Date): string {
  return formatRelative(date, new Date());
}
export function formatDateDistance(date: Date): string {
  return formatDistance(date, new Date(), { addSuffix: true });
}
export function formatNumberAsDecimal(number: number, decimals = 2): string {
  const formatter = Intl.NumberFormat(undefined, {
    style: "decimal",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return formatter.format(number);
}
export function formatNumberAsPercent(number: number, decimals = 2): string {
  const formatter = Intl.NumberFormat(undefined, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return formatter.format(number);
}
