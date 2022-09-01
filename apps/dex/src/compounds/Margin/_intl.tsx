import { formatDistance, formatRelative, intervalToDuration, formatISO9075 } from "date-fns";

export const createDurationLabel = (timeOpen: Duration) => {
  const { years, months, days, hours, minutes, seconds } = timeOpen;
  const yearsLabel = years ? `${years}y` : null;
  const monthsLabel = months ? `${months}m` : null;
  const daysLabel = days ? `${days}d` : null;
  const hoursLabel = hours ? `${hours}h` : null;
  const minutesLabel = minutes ? `${minutes}min` : null;
  const secondsLabel = seconds ? `${seconds}s` : null;
  const isSeconds = [yearsLabel, monthsLabel, daysLabel, hoursLabel, minutesLabel].every((item) => item === null);
  const maybeSecondsLabel = isSeconds ? secondsLabel : null;
  return [yearsLabel, monthsLabel, daysLabel, hoursLabel, minutesLabel, maybeSecondsLabel]
    .filter((label) => Boolean(label))
    .join(", ");
};

export function formatDateISO(date: Date) {
  return formatISO9075(date, { representation: "date" });
}

export function formatIntervalToDuration(start: Date, end: Date) {
  return intervalToDuration({
    start,
    end,
  });
}

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
