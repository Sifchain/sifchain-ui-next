import { uniq, without } from "rambda";
import { createStore } from "zustand-immer-store";

export const useEnabledChainsStore = createStore(
  {
    networks: new Array<string>(),
  },
  {
    createActions: (set) => ({
      enableNetwork(networkId: string) {
        set(({ state }) => {
          state.networks = uniq([...state.networks, networkId]);
        });
      },
      disableChain(networkId: string) {
        set(({ state }) => {
          state.networks = without([networkId], state.networks);
        });
      },
    }),
    persist: {
      name: "@sifchain/enabled-chains",
      version: 1,
    },
  },
);
