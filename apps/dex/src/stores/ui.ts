import { createStore } from "zustand-immer-store";

const INITAL_STATE = {
  isNavbarOpen: false,
};

export const useUIStore = createStore(INITAL_STATE, {
  createActions: (set) => ({
    toggleNavbar: () =>
      set(({ state }) => {
        state.isNavbarOpen = !state.isNavbarOpen;
      }),
  }),
});
