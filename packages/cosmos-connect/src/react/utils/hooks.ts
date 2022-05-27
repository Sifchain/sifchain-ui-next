import { DependencyList, useCallback, useState } from "react";
import type { BaseStorage } from "../storage";

export const useAsyncFunc = <T extends Function>(
  asyncFunc: T,
  deps?: DependencyList,
) => {
  type TReturn = T extends (...args: any[]) => Promise<infer R> ? R : unknown;
  const [data, setData] = useState<TReturn | undefined>();
  const [error, setError] = useState<any>();
  const [status, setStatus] = useState<
    "idle" | "pending" | "resolved" | "rejected"
  >("idle");

  const fetch = useCallback<T>(
    // @ts-ignore
    async (...args: any[]) => {
      setStatus("pending");
      try {
        const result = await asyncFunc(...args);
        setData(result);
        setStatus("resolved");
        return result;
      } catch (error) {
        setError(error);
        setStatus("rejected");
        throw error;
      }
    },
    deps,
  );

  return {
    data,
    error,
    fetch,
    status,
  };
};

export const useStorageState = <T>(
  key: string,
  initialValue: T,
  storage?: BaseStorage,
) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = storage?.getItem(key);
      return item ? JSON.parse(item) : initialValue;
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
