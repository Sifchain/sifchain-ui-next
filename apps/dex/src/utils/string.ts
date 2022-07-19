export const isNilOrWhiteSpace = (value: string | undefined | null) =>
  (value?.trim() ?? "") === "";
