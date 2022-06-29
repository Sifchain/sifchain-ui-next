export type StringIndexable = { [key: string]: any };

export type IndexableKeys<T extends StringIndexable, K = keyof T> = K extends
  | string
  | number
  ? K
  : never;

export type ValidPaths<
  T extends StringIndexable,
  TKeys = IndexableKeys<T>,
> = TKeys extends string
  ? T[TKeys] extends StringIndexable
    ? `${TKeys}.${IndexableKeys<T[TKeys]>}`
    : never
  : never;
