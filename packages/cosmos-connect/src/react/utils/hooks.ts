import { DependencyList, useCallback, useState } from "react";
import type { BaseStorage } from "../storage";

export const useAsyncFunc = <TParams extends Array<unknown>, TResult>(
  asyncFunc: (...args: TParams) => TResult | Promise<TResult>,
  deps?: DependencyList,
) => {
  const [data, setData] = useState<TResult | undefined>();
  const [dataUpdatedAt, setDataUpdatedAt] = useState<Date>();
  const [error, setError] = useState<unknown>();
  const [errorUpdatedAt, setErrorUpdatedAt] = useState<Date>();
  const [status, setStatus] = useState<"idle" | "pending" | "resolved" | "rejected">("idle");

  const fetch = useCallback(
    async (...args: TParams) => {
      setStatus("pending");
      try {
        const result = await asyncFunc(...args);

        setData(result);
        setDataUpdatedAt(new Date());
        setStatus("resolved");
        return result;
      } catch (error) {
        setError(error);
        setErrorUpdatedAt(new Date());
        setStatus("rejected");
        throw error;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps ?? [],
  );

  return {
    dataUpdatedAt,
    data,
    error,
    errorUpdatedAt,
    fetch,
    status,
  };
};

export const useStorageState = <T>(key: string, initialValue: T, storage?: BaseStorage) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = storage?.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);

    storage?.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
};
