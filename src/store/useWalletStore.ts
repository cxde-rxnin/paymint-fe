import { create } from "zustand";

interface WalletState {
  address: string | null;
  connected: boolean;
  setAddress: (address: string | null) => void;
  setConnected: (connected: boolean) => void;
  reset: () => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  connected: false,
  setAddress: (address) => set({ address }),
  setConnected: (connected) => set({ connected }),
  reset: () => set({ address: null, connected: false }),
  disconnect: () => {
    set({ address: null, connected: false });
    // Redirect to landing page will be handled by the ProtectedRoute component
  },
}));
