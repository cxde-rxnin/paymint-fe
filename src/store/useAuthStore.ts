// Re-export from the main wallet store for backward compatibility
import { useWalletStore as walletStore } from "./useWalletStore";

export { useWalletStore } from "./useWalletStore";

// Deprecated: use useWalletStore instead
export const useAuthStore = walletStore;
