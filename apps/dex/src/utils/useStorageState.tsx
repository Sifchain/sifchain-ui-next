import { Maybe } from "@sifchain/ui";
import { useEffect, useState } from "react";

export const useStorageState = <S,>(storage: Storage, key: string, initialState: S | (() => S)) => {
  const [state, setState] = useState(Maybe.of(storage.getItem(key)).mapOr(initialState, JSON.parse));

  useEffect(() => {
    storage.setItem(key, JSON.stringify(state));
  }, [key, state, storage]);

  return [state, setState] as const;
};
