export const getFirstQueryValue = <T extends string = string>(
  query: T | T[] | undefined
) =>
  query === undefined
    ? undefined
    : typeof query === "string"
    ? query
    : query[0];
