
import { mistToSui, formatSui } from "../utils/format";

type Tx = {
  id: string;
  amount: number;
  date: string;
  status: string;
  memo?: string;
};

export default function TransactionTable({ txs }: { txs: Tx[] }) {
  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide";
    
    switch (status.toLowerCase()) {
      case "success":
        return `${baseClasses} bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm`;
      case "pending":
        return `${baseClasses} bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm`;
      case "failed":
        return `${baseClasses} bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm`;
    }
  };

  if (txs.length === 0) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-lg flex items-center justify-center shadow-xl shadow-emerald-500/25">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mb-4">
          No transactions yet
        </h3>
        <p className="text-gray-400 text-lg mb-6">Your transaction history will appear here</p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Transactions will appear when invoices are paid</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-b border-gray-700/50">
              <th className="px-6 py-5 text-left text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Transaction ID
                </div>
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Amount
                </div>
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 12v-4m0 0a4 4 0 01-4-4V9a1 1 0 011-1h6a1 1 0 011 1v6a4 4 0 01-4 4z" />
                  </svg>
                  Date
                </div>
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Status
                </div>
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Details
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/30">
            {txs.map((tx) => (
              <tr 
                key={tx.id} 
                className="hover:bg-gray-700/20 transition-all duration-300 group"
              >
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Transaction</div>
                      <div className="text-xs text-gray-400 font-mono">{tx.id.slice(0, 8)}...{tx.id.slice(-6)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{formatSui(mistToSui(tx.amount))}</div>
                      <div className="text-xs text-gray-400">SUI</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 12v-4m0 0a4 4 0 01-4-4V9a1 1 0 011-1h6a1 1 0 011 1v6a4 4 0 01-4 4z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-white font-medium">{new Date(tx.date).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">{new Date(tx.date).toLocaleTimeString()}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className={getStatusBadge(tx.status)}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {tx.memo ? (
                      <div className="max-w-xs">
                        <div className="text-sm text-white truncate">{tx.memo}</div>
                        <div className="text-xs text-gray-400">Memo</div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">No memo</div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
