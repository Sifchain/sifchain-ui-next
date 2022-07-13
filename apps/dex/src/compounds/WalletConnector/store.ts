import { uniq, without } from "rambda";
import { createStore } from "zustand-immer-store";

export const useEnabledChainsStore = createStore(
  {
    chainIds: new Array<string>(),
  },
  {
    createActions: (set) => ({
      enableChain(chainId: string) {
        set(({ state }) => {
          state.chainIds = uniq([...state.chainIds, chainId]);
        });
      },
      disableChain(chainId: string) {
        set(({ state }) => {
          state.chainIds = without([chainId], state.chainIds);
        });
      },
    }),
    persist: {
      name: "@sifchain/enabled-chains",
      version: 1,
    },
  },
);
