import { create } from "zustand";
import { apiFetch } from "../utils/api";

type Tx = { id: string; amount: number; date: string; status: string };

type TxState = {
  txs: Tx[];
  fetchTxs: (payeeId?: string) => Promise<void>;
};

export const useTransactionStore = create<TxState>((set) => ({
  txs: [],
  fetchTxs: async (payeeId?: string) => {
    try {
      const url = payeeId ? `/api/transactions?payeeId=${encodeURIComponent(payeeId)}` : "/api/transactions";
      const data = await apiFetch(url);
      set({ txs: data });
    } catch (e) {
      console.error("fetchTxs error", e);
      set({ txs: [] });
    }
  },
}));
