import { useEffect, useState } from "react";
import { useWalletStore } from "../store/useWalletStore";
import { useInvoiceStore } from "../store/useInvoiceStore";
import { useWebSocket } from "../hooks/useWebSocket";
import { mistToSui, formatSui } from "../utils/format";

export default function Dashboard() {
  const address = useWalletStore((s) => s.address);
  const invoices = useInvoiceStore((s) => s.invoices);
  const fetchInvoices = useInvoiceStore((s) => s.fetchInvoices);
  
  // Initialize WebSocket connection for real-time updates
  useWebSocket();

  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    if (address) {
      fetchInvoices(address);
    }
  }, [address, fetchInvoices]);

  useEffect(() => {
    const paidInvoices = invoices.filter(inv => inv.status === "paid").length;
    const pendingInvoices = invoices.filter(inv => inv.status === "unpaid").length;
    const totalAmount = invoices.reduce((sum, inv) => sum + mistToSui(inv.amount), 0);

    setStats({
      totalInvoices: invoices.length,
      paidInvoices,
      pendingInvoices,
      totalAmount,
    });
  }, [invoices]);

  return (
    <div className="min-h-screen w-full relative bg-black text-white">
      {/* Emerald Void Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)",
        }}
      />
      {/* Blurred Gradient Accent */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-9/12 h-32 bg-gradient-to-r from-emerald-500/40 via-green-400/30 to-emerald-400/40 rounded-3xl blur-3xl opacity-70 z-0"></div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 pt-24 md:pt-16">
        <div className="flex flex-col items-start gap-3">
          <h1 className="text-white font-bold text-4xl">Dashboard</h1>
          <p className="text-white font-light text-lg">Welcome back! Here's your activity overview.</p>
        </div>
        {address && (
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-xl border border-emerald-400/20">
            <span className="text-emerald-400 font-mono text-sm">{address.slice(0, 8)}...</span>
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Total Invoices */}
          <div className="glass-card bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/60 shadow-lg flex flex-col items-start transition-all duration-300 hover:scale-[1.03] hover:border-emerald-400/30">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalInvoices}</h3>
            <p className="text-gray-400 text-base">Total Invoices</p>
          </div>
          {/* Paid Invoices */}
          <div className="glass-card bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/60 shadow-lg flex flex-col items-start transition-all duration-300 hover:scale-[1.03] hover:border-green-400/30">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.paidInvoices}</h3>
            <p className="text-gray-400 text-base">Paid Invoices</p>
          </div>
          {/* Pending Invoices */}
          <div className="glass-card bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/60 shadow-lg flex flex-col items-start transition-all duration-300 hover:scale-[1.03] hover:border-yellow-400/30">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.pendingInvoices}</h3>
            <p className="text-gray-400 text-base">Pending Invoices</p>
          </div>
        </div>


        {/* Recent Activity */}
        <div className="glass-card bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/60 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl font-bold text-white">Recent Invoices</h2>
          </div>
          <div className="space-y-4">
            {invoices.slice(0, 5).map((invoice) => (
              <div key={invoice._id} className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">Invoice #{invoice.clientId}</p>
                  <p className="text-gray-400 text-sm">{invoice.payer.slice(0, 8)}...</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{formatSui(mistToSui(invoice.amount))}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    invoice.status === 'paid' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
            {invoices.length === 0 && (
              <div className="text-center py-6 lg:py-8">
                <p className="text-gray-400 text-sm lg:text-base">No invoices yet</p>
                <p className="text-gray-500 text-xs lg:text-sm mt-1">Create your first invoice to get started</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}