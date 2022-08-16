export type StringIndexable = {
  [key: string]: any;
};

export type StringIndexed<T> = {
  [key: string]: T;
};

export type IndexableKeys<T extends StringIndexable, K = keyof T> = K extends
  | string
  | number
  ? K
  : never;

export type ValidPaths<
  T extends StringIndexable,
  TKeys = IndexableKeys<T>
> = TKeys extends string
  ? T[TKeys] extends StringIndexable
    ? `${TKeys}.${IndexableKeys<T[TKeys]>}`
    : never
  : never;

export type ArrayType<T> = T extends Array<infer U> ? U : never;
