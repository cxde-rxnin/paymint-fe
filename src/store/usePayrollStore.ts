import { create } from "zustand";
import { apiFetch } from "../utils/api";

export type PayrollRecipient = {
  wallet: string;
  amount: number;
};

export type Payroll = {
  _id: string;
  issuer: string;
  clientEmail: string;
  recipients: PayrollRecipient[];
  totalAmount: number;
  surchargeBps: number;
  metadataHash: string;
  dueDate: number;
  createdAt: number;
  status: "unpaid" | "paid" | "overdue";
  projectName: string;
  description?: string;
  txDigest?: string;
  objectId?: string;
  paymentTx?: string;
  paidAt?: string;
};

export type CreatePayrollData = {
  issuer: string;
  clientEmail: string;
  recipients: PayrollRecipient[];
  surchargeBps: number;
  metadataHash: string;
  dueDate: number;
  projectName: string;
  description?: string;
};

type PayrollState = {
  payrolls: Payroll[];
  activePayroll: Payroll | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchPayrolls: (issuer?: string) => Promise<void>;
  fetchPayrollsByClient: (email: string) => Promise<void>;
  fetchPayroll: (id: string) => Promise<void>;
  createPayroll: (data: CreatePayrollData) => Promise<Payroll>;
  payPayroll: (id: string, walletAddress: string) => Promise<Payroll>;
  setActivePayroll: (payroll: Payroll | null) => void;
  clearError: () => void;
};

export const usePayrollStore = create<PayrollState>((set, get) => ({
  payrolls: [],
  activePayroll: null,
  loading: false,
  error: null,

  fetchPayrolls: async (issuer?: string) => {
    set({ loading: true, error: null });
    try {
      const url = issuer ? `/api/payrolls?issuer=${encodeURIComponent(issuer)}` : "/api/payrolls";
      const data = await apiFetch(url);
      set({ payrolls: data, loading: false });
    } catch (error) {
      console.error("fetchPayrolls error", error);
      set({ 
        payrolls: [], 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch payrolls" 
      });
    }
  },

  fetchPayrollsByClient: async (email: string) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch(`/api/payrolls/client/${encodeURIComponent(email)}`);
      set({ payrolls: data, loading: false });
    } catch (error) {
      console.error("fetchPayrollsByClient error", error);
      set({ 
        payrolls: [], 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch payrolls" 
      });
    }
  },

  fetchPayroll: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch(`/api/payrolls/${id}`);
      set({ activePayroll: data, loading: false });
    } catch (error) {
      console.error("fetchPayroll error", error);
      set({ 
        activePayroll: null, 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch payroll" 
      });
    }
  },

  createPayroll: async (data: CreatePayrollData) => {
    set({ loading: true, error: null });
    try {
      const payroll = await apiFetch("/api/payrolls", {
        method: "POST",
        body: data,
      });
      
      // Add to payrolls list
      const { payrolls } = get();
      set({ 
        payrolls: [payroll, ...payrolls], 
        loading: false 
      });
      
      return payroll;
    } catch (error) {
      console.error("createPayroll error", error);
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to create payroll" 
      });
      throw error;
    }
  },

  payPayroll: async (id: string, walletAddress: string) => {
    set({ loading: true, error: null });
    try {
      const payroll = await apiFetch(`/api/payrolls/${id}/pay`, {
        method: "POST",
        body: { walletAddress },
      });
      
      // Update payrolls list
      const { payrolls } = get();
      const updatedPayrolls = payrolls.map(p => 
        p._id === id ? { ...p, ...payroll } : p
      );
      
      set({ 
        payrolls: updatedPayrolls, 
        activePayroll: payroll,
        loading: false 
      });
      
      return payroll;
    } catch (error) {
      console.error("payPayroll error", error);
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to pay payroll" 
      });
      throw error;
    }
  },

  setActivePayroll: (payroll: Payroll | null) => {
    set({ activePayroll: payroll });
  },

  clearError: () => {
    set({ error: null });
  },
}));
