import { useEffect, useState } from "react";
import TransactionTable from "../components/TransactionTable";
import { useTransactionStore } from "../store/useTransactionStore";
import { useWalletStore } from "../store/useWalletStore";
import { useWebSocket } from "../hooks/useWebSocket";
import { mistToSui, formatSui } from "../utils/format";

export default function Transactions() {
  const address = useWalletStore((s) => s.address);
  const txs = useTransactionStore((s) => s.txs);
  const fetchTxs = useTransactionStore((s) => s.fetchTxs);
  
  // Initialize WebSocket connection for real-time updates
  useWebSocket();

  useEffect(() => {
    if (address) {
      fetchTxs(address);
    }
  }, [address, fetchTxs]);

  // Calculate transaction statistics
  const totalTransactions = txs.length;
  const successfulTxs = txs.filter(tx => tx.status === "Success").length;
  const pendingTxs = txs.filter(tx => tx.status !== "Success").length;
  const totalVolume = txs.filter(tx => tx.status === "Success").reduce((sum, tx) => sum + mistToSui(tx.amount), 0);

  // Responsive: show summary card on mobile, table on desktop
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen w-full relative bg-black text-white overflow-x-hidden">
      {/* Emerald Void Background */}
      <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)" }} />
      {/* Blurred Gradient Accent - Fixed width constraints */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-4xl h-32 bg-gradient-to-r from-emerald-500/40 via-green-400/30 to-emerald-400/40 rounded-3xl blur-3xl opacity-70 z-0"></div>
      
      <header className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between px-4 sm:px-6 lg:px-8 py-6 pt-24 md:pt-16 w-full gap-4 md:gap-0">
        <div className="flex flex-col items-start gap-2 min-w-0 flex-shrink">
          <h1 className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl">Transactions</h1>
          <p className="text-white font-light text-sm sm:text-base lg:text-lg">Track your payments and activity.</p>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats Grid - Improved responsive behavior */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <div className="glass-card bg-black/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-800/60 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-white">{totalTransactions}</p>
                <p className="text-gray-400 text-xs sm:text-sm">Total Transactions</p>
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
                <p className="text-xl sm:text-2xl font-bold text-white">{successfulTxs}</p>
                <p className="text-gray-400 text-xs sm:text-sm">Successful</p>
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
                <p className="text-xl sm:text-2xl font-bold text-white">{pendingTxs}</p>
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
                <p className="text-xl sm:text-2xl font-bold text-white truncate">
                  {formatSui ? formatSui(totalVolume) : totalVolume.toFixed(4)} SUI
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">SUI Volume</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Table Section - Improved container */}
        {isMobile ? (
          <div className="glass-card bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/60 shadow-lg flex flex-col gap-4 items-center text-center">
            <h2 className="text-lg font-bold text-white mb-2">Transaction Summary</h2>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex justify-between w-full">
                <span className="text-gray-400">Total</span>
                <span className="text-white font-semibold">{totalTransactions}</span>
              </div>
              <div className="flex justify-between w-full">
                <span className="text-gray-400">Successful</span>
                <span className="text-emerald-400 font-semibold">{successfulTxs}</span>
              </div>
              <div className="flex justify-between w-full">
                <span className="text-gray-400">Pending</span>
                <span className="text-yellow-400 font-semibold">{pendingTxs}</span>
              </div>
              <div className="flex justify-between w-full">
                <span className="text-gray-400">SUI Volume</span>
                <span className="text-purple-400 font-semibold">{formatSui ? formatSui(totalVolume) : totalVolume.toFixed(4)} SUI</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <TransactionTable txs={txs} />
          </div>
        )}
      </main>
    </div>
  );
}