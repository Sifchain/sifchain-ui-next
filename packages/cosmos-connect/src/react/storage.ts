export type BaseStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type StorageOptions = {
  storage?: BaseStorage;
  prefix?: string;
};

export const noopStorage: BaseStorage = {
  getItem: (_key) => "",
  setItem: (_key, _value) => null,
  removeItem: (_key) => null,
};
