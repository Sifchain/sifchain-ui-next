export const isNilOrWhiteSpace = (
  value: string | undefined | null,
): value is undefined | null => (value?.trim() ?? "") === "";
