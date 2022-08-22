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
          // need this check since some effect hooks has dependencies on chain store & also dispatch action to it at the same time
          // messing up the array order could result in an infinite render
          if (!state.networks.includes(networkId)) {
            state.networks = [...state.networks, networkId];
          }
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
