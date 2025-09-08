import { useEffect } from "react";
import TransactionTable from "../components/TransactionTable";
import { useTransactionStore } from "../store/useTransactionStore";
import { useWalletStore } from "../store/useWalletStore";
import { useWebSocket } from "../hooks/useWebSocket";
import { mistToSui } from "../utils/format";

export default function Transactions() {
  const address = useWalletStore((s) => s.address);
  const txs = useTransactionStore((s) => s.txs);
  const fetchTxs = useTransactionStore((s) => s.fetchTxs);
  
  // Initialize WebSocket connection for real-time updates
  const { isConnected } = useWebSocket();

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

  return (
    <div className="p-4 lg:p-8 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-green-400 bg-clip-text text-transparent">
                Transactions
              </h1>
              <p className="text-gray-400 text-lg mt-1">Track your payment history</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-gray-300 text-sm">{isConnected ? 'Live Updates' : 'Offline'}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalTransactions}</p>
                <p className="text-gray-400 text-sm">Total Transactions</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{successfulTxs}</p>
                <p className="text-gray-400 text-sm">Successful</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{pendingTxs}</p>
                <p className="text-gray-400 text-sm">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {totalVolume.toFixed(2)}
                </p>
                <p className="text-gray-400 text-sm">SUI Volume</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table Section */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M10 11H8m0 4h.01M16 11h.01M16 15h.01" />
          </svg>
          <h2 className="text-xl font-bold text-white">Transaction History</h2>
        </div>
        <TransactionTable txs={txs} />
      </div>
    </div>
  );
}
