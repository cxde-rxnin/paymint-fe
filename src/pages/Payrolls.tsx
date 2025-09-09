import React, { useEffect, useState } from "react";
import { PayrollTable } from "../components/PayrollTable";
import { CreatePayrollModal } from "../components/CreatePayrollModal";
import Button from "../components/ui/Button";
import { usePayrollStore, type Payroll } from "../store/usePayrollStore";
import { useWalletStore } from "../store/useWalletStore";
import { mistToSui, formatSui } from "../utils/format";

export const Payrolls: React.FC = () => {
  const { address } = useWalletStore();
  const { payrolls, loading, error, fetchPayrolls } = usePayrollStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);

  useEffect(() => {
    if (address) {
      fetchPayrolls(address);
    }
  }, [address, fetchPayrolls]);

  const handleViewPayroll = (payroll: Payroll) => {
    setSelectedPayroll(payroll);
  };

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
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 bg-clip-text text-transparent mb-2">
            Team Payrolls
          </h1>
          <p className="text-gray-400 text-lg">
            Manage payrolls for your team and automatically distribute payments
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-1/2 md:w-1/6"
          style={{ zIndex: 20 }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Payroll
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-400">Error</h3>
              <div className="mt-2 text-sm text-red-300">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{stats.totalPayrolls}</h3>
          <p className="text-gray-400 text-sm">Total Payrolls</p>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{stats.pendingPayrolls}</h3>
          <p className="text-gray-400 text-sm">Pending</p>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{stats.paidPayrolls}</h3>
          <p className="text-gray-400 text-sm">Paid</p>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{formatSui(stats.totalAmount)}</h3>
          <p className="text-gray-400 text-sm">Total Value</p>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-xl font-bold text-white">Payroll History</h2>
        </div>
        {payrolls.length > 0 ? (
          <PayrollTable 
            payrolls={payrolls} 
            onViewPayroll={handleViewPayroll}
          />
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-400 text-lg mb-2">No payrolls yet</p>
            <p className="text-gray-500 text-sm mb-6">Create your first team payroll to automatically distribute payments</p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
            >
              Create First Payroll
            </Button>
          </div>
        )}
      </div>

      {/* Create Payroll Modal */}
      <CreatePayrollModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Payroll Details Modal */}
      {selectedPayroll && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-700/50 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {selectedPayroll.projectName}
                </h2>
                <button
                  onClick={() => setSelectedPayroll(null)}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Client Email</p>
                    <p className="text-white font-medium">{selectedPayroll.clientEmail}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                      selectedPayroll.status === "paid" 
                        ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}>
                      {selectedPayroll.status}
                    </span>
                  </div>
                </div>
                
                {selectedPayroll.description && (
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-2">Description</p>
                    <p className="text-white">{selectedPayroll.description}</p>
                  </div>
                )}
                
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-white">Team Members ({selectedPayroll.recipients.length})</h3>
                  </div>
                  <div className="space-y-3">
                    {selectedPayroll.recipients.map((recipient, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                        <div className="font-mono text-sm text-gray-300 truncate flex-1 mr-4">
                          {recipient.wallet}
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {formatSui(mistToSui(recipient.amount))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-white">Total Amount</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-400 bg-clip-text text-transparent">
                      {formatSui(mistToSui(selectedPayroll.totalAmount + (selectedPayroll.totalAmount * selectedPayroll.surchargeBps / 10000)))}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    Includes 2.5% platform fee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
