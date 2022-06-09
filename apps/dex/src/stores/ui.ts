import { createStore } from "zustand-immer-store";

const INITAL_STATE = {
  isSidebarOpen: true,
};

export const useUIStore = createStore(INITAL_STATE, {
  createActions: (set) => ({
    toggleSidebar: () =>
      set(({ state }) => {
        state.isSidebarOpen = !state.isSidebarOpen;
      }),
  }),
});
