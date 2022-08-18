import type { IndexableKeys } from "./types";

export const toPrefixedProps = <P extends string, T extends Record<string, unknown>, U extends IndexableKeys<T>>(
  prefix: P,
  obj: T,
  filter: U[],
) =>
  Object.entries(obj).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [filter.includes(key as U) ? `${prefix}${key}` : key]: value,
    }),
    {} as { [K in U as `${P}${K}`]: T[K] } & {
      [K in Exclude<keyof T, U>]: T[K];
    },
  );

const pp = toPrefixedProps("$", { foo: 1, bar: 2 }, ["foo"]);
