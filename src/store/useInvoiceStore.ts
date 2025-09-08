import { create } from "zustand";
import { apiFetch } from "../utils/api";

type Invoice = {
  _id: string;
  payeeId: string;
  clientId: number;
  payer: string;
  amount: number;
  surchargeBps: number;
  status: string;
  service: string;
  description?: string;
  dueDate: number;
  objectId?: string;
};

type InvoiceState = {
  invoices: Invoice[];
  fetchInvoices: (payeeId?: string) => Promise<void>;
};

export const useInvoiceStore = create<InvoiceState>((set) => ({
  invoices: [],
  fetchInvoices: async (payeeId?: string) => {
    try {
      const url = payeeId ? `/api/invoices?payeeId=${encodeURIComponent(payeeId)}` : "/api/invoices";
      const data = await apiFetch(url);
      set({ invoices: data });
    } catch (e) {
      console.error("fetchInvoices error", e);
      set({ invoices: [] });
    }
  },
}));
