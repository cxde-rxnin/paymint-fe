import React, { useEffect, useState } from "react";
import { PayrollTable } from "../components/PayrollTable";
import { CreatePayrollModal } from "../components/CreatePayrollModal";
import { usePayrollStore } from "../store/usePayrollStore";
import { useWalletStore } from "../store/useWalletStore";
import { mistToSui, formatSui } from "../utils/format";

export const Payrolls: React.FC = () => {
  const { address } = useWalletStore();
  const { payrolls, loading, fetchPayrolls } = usePayrollStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (address) {
      fetchPayrolls(address);
    }
  }, [address, fetchPayrolls]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const stats = {
    totalPayrolls: payrolls.length,
    paidPayrolls: payrolls.filter(p => p.status === "paid").length,
    pendingPayrolls: payrolls.filter(p => p.status === "unpaid").length,
    totalAmount: payrolls.reduce((sum, p) => sum + mistToSui(p.totalAmount), 0),
  };

  return (
    <div className="min-h-screen w-full relative bg-black text-white">
      {/* Emerald Void Background */}
      <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)" }} />
      {/* Blurred Gradient Accent */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-9/12 h-32 bg-gradient-to-r from-emerald-500/40 via-green-400/30 to-emerald-400/40 rounded-3xl blur-3xl opacity-70 z-0"></div>
      <header className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between px-4 sm:px-6 lg:px-8 py-6 pt-24 md:pt-16 w-full gap-4 md:gap-0">
        <div className="flex flex-col items-start gap-2 min-w-0 flex-shrink">
          <h1 className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl">Payrolls</h1>
          <p className="text-white font-light text-sm sm:text-base lg:text-lg">Manage your payrolls and payouts.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="z-20 bg-white shadow-lg rounded-xl px-4 sm:px-6 py-3 flex items-center gap-2 text-black font-bold text-sm sm:text-base lg:text-lg hover:bg-white/75 transition-all duration-300 whitespace-nowrap flex-shrink-0"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Payroll
        </button>
      </header>
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats Grid - Improved responsive behavior */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <div className="glass-card bg-black/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-800/60 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-white">{payrolls.length}</p>
                <p className="text-gray-400 text-xs sm:text-sm">Total Payrolls</p>
              </div>
            </div>
          </div>
          <div className="glass-card bg-black/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-800/60 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-white">{payrolls.filter(p => p.status === "paid").length}</p>
                <p className="text-gray-400 text-xs sm:text-sm">Paid</p>
              </div>
            </div>
          </div>
          <div className="glass-card bg-black/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-800/60 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-white">{payrolls.filter(p => p.status === "unpaid").length}</p>
                <p className="text-gray-400 text-xs sm:text-sm">Pending</p>
              </div>
            </div>
          </div>
          <div className="glass-card bg-black/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-800/60 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-white truncate">{formatSui(stats.totalAmount)}</p>
                <p className="text-gray-400 text-xs sm:text-sm">SUI Paid</p>
              </div>
            </div>
          </div>
        </div>
        {/* Payroll Table Section - Improved container */}
        <div className="glass-card bg-black/60 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden">
          <PayrollTable payrolls={payrolls} />
        </div>
        <CreatePayrollModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      </main>
    </div>
  );
};
