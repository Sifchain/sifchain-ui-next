export const getFirstQueryValue = (query: string | string[] | undefined) =>
  query === undefined
    ? undefined
    : typeof query === "string"
    ? query
    : query[0];
