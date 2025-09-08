import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { mistToSui, formatSui } from "../utils/format";

export default function InvoiceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await apiFetch(`/api/invoices/${id}`);
        setInvoice(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchInvoice();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950/20 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mb-2">
              Loading Invoice
            </h3>
            <p className="text-gray-400 text-lg">Please wait while we fetch the details...</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (!invoice) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950/20 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-500 to-red-400 rounded-lg flex items-center justify-center shadow-xl shadow-red-500/25">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent mb-4">
              Invoice Not Found
            </h3>
            <p className="text-gray-400 text-lg mb-8">The requested invoice could not be found or may have been deleted.</p>
            <button
              onClick={() => navigate('/invoices')}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:transform hover:-translate-y-1"
            >
              Back to Invoices
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const surcharge = (mistToSui(invoice.amount) * invoice.surchargeBps) / 10000;
  const total = mistToSui(invoice.amount) + surcharge;
  const createdDate = new Date(invoice.createdAt || Date.now());

 
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950/20 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Back button clicked - navigating to /invoices');
                navigate('/invoices');
              }}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors duration-200 mb-4 z-50 relative cursor-pointer"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Invoices
            </button>
            <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-200 bg-clip-text text-transparent">
              Invoice Details
            </h1>
            <p className="text-gray-400 text-lg mt-2">Invoice #{invoice.clientId}</p>
          </div>
          {/* <div className="text-right">
            {getStatusBadge(invoice.status || 'active')}
          </div> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Base Amount</p>
                <p className="text-2xl font-bold text-white mt-1">{formatSui(mistToSui(invoice.amount))}</p>
                <p className="text-emerald-400 text-sm">SUI</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Surcharge</p>
                <p className="text-2xl font-bold text-white mt-1">{formatSui(surcharge)}</p>
                <p className="text-orange-400 text-sm">{(invoice.surchargeBps / 100).toFixed(2)}%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-400 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/25">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{formatSui(total)}</p>
                <p className="text-emerald-400 text-sm">SUI</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Created</p>
                <p className="text-lg font-bold text-white mt-1">{createdDate.toLocaleDateString()}</p>
                <p className="text-purple-400 text-sm">{createdDate.toLocaleTimeString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-400 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 12v-4m0 0a4 4 0 01-4-4V9a1 1 0 011-1h6a1 1 0 011 1v6a4 4 0 01-4 4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoice Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Details */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 border border-gray-700/50 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Invoice Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-emerald-400 mb-2 block">Invoice ID</label>
                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30">
                      <p className="text-white font-mono">{invoice.clientId}</p>
                    </div>
                  </div>
                  
                  {invoice.service && (
                    <div>
                      <label className="text-sm font-medium text-emerald-400 mb-2 block">Service</label>
                      <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30">
                        <p className="text-white">{invoice.service}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-emerald-400 mb-2 block">Payer Address</label>
                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30">
                      <p className="text-white font-mono text-sm break-all">{invoice.payer}</p>
                    </div>
                  </div>
                  
                  {invoice.description && (
                    <div>
                      <label className="text-sm font-medium text-emerald-400 mb-2 block">Description</label>
                      <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30">
                        <p className="text-white">{invoice.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">

            {/* Invoice Summary */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                Payment Summary
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
                  <span className="text-gray-400">Base Amount</span>
                  <span className="text-white font-medium">{formatSui(mistToSui(invoice.amount))} SUI</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
                  <span className="text-gray-400">Surcharge ({(invoice.surchargeBps / 100).toFixed(2)}%)</span>
                  <span className="text-orange-400 font-medium">+{formatSui(surcharge)} SUI</span>
                </div>
                <div className="flex justify-between items-center py-3 border-t border-gray-600/50">
                  <span className="text-lg font-bold text-white">Total Due</span>
                  <span className="text-xl font-bold text-emerald-400">{formatSui(total)} SUI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details - Full Width */}
        <div className="mt-8">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-400 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
              Technical Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-emerald-400 mb-2 block">Metadata Hash</label>
                <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-700/30">
                  <p className="text-white font-mono text-sm break-all">{invoice.metadataHash}</p>
                </div>
              </div>
              
              {invoice.objectId && (
                <div>
                  <label className="text-sm font-medium text-emerald-400 mb-2 block">Object ID</label>
                  <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-700/30">
                    <p className="text-white font-mono text-sm break-all">{invoice.objectId}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
