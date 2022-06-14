export type IndexableKeys<T extends {}, K = keyof T> = K extends string | number
  ? K
  : never;
