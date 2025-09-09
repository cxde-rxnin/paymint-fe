import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { usePayrollStore } from "../store/usePayrollStore";
import { formatDate } from "../utils/format";

export const PayrollDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activePayroll, loading, error, fetchPayroll } = usePayrollStore();

  useEffect(() => {
    if (id) {
      fetchPayroll(id);
    }
  }, [id, fetchPayroll]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !activePayroll) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-6xl mb-4">❌</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Payroll not found</h3>
        <p className="text-gray-500 mb-4">{error || "The requested payroll could not be found."}</p>
        <Button onClick={() => navigate("/payrolls")}>
          Back to Payrolls
        </Button>
      </div>
    );
  }

  const baseAmount = activePayroll.totalAmount / 1_000_000_000;
  const surcharge = (baseAmount * activePayroll.surchargeBps) / 10000;
  const totalDue = baseAmount + surcharge;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/payrolls")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Payrolls
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{activePayroll.projectName}</h1>
          <p className="text-gray-600">Payroll Details</p>
        </div>
        <div className="flex items-center space-x-3">
          <span
            className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
              activePayroll.status
            )}`}
          >
            {activePayroll.status}
          </span>
          {activePayroll.status === "unpaid" && (
            <Button onClick={() => window.open(`/pay-payroll/${activePayroll._id}`, '_blank')}>
              Share Payment Link
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <p className="text-gray-900 font-medium">{activePayroll.projectName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Client Email</label>
                <p className="text-gray-900">{activePayroll.clientEmail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <p className="text-gray-900">{formatDate(activePayroll.dueDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Created</label>
                <p className="text-gray-900">{formatDate(activePayroll.createdAt)}</p>
              </div>
            </div>
            {activePayroll.description && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-gray-900 mt-1">{activePayroll.description}</p>
              </div>
            )}
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Team Members ({activePayroll.recipients.length})
            </h2>
            <div className="space-y-3">
              {activePayroll.recipients.map((recipient, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Member {index + 1}</p>
                    <p className="font-mono text-sm text-gray-900 truncate">
                      {recipient.wallet}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {(recipient.amount / 1_000_000_000).toFixed(4)} SUI
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Details */}
          {activePayroll.status === "paid" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h2>
              <div className="space-y-3">
                {activePayroll.paymentTx && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Transaction</label>
                    <p className="font-mono text-sm text-gray-900 break-all">
                      {activePayroll.paymentTx}
                    </p>
                  </div>
                )}
                {activePayroll.paidAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Paid At</label>
                    <p className="text-gray-900">
                      {new Date(activePayroll.paidAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Team Payment:</span>
                <span className="font-medium">{baseAmount.toFixed(4)} SUI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Fee:</span>
                <span className="font-medium">{surcharge.toFixed(4)} SUI</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total Due:</span>
                  <span className="font-bold text-blue-600">{totalDue.toFixed(4)} SUI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-3">
              {activePayroll.status === "unpaid" && (
                <>
                  <Button 
                    className="w-full"
                    onClick={() => window.open(`/pay-payroll/${activePayroll._id}`, '_blank')}
                  >
                    Open Payment Page
                  </Button>
                  <Button 
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      const paymentUrl = `${window.location.origin}/pay-payroll/${activePayroll._id}`;
                      navigator.clipboard.writeText(paymentUrl);
                      alert("Payment link copied to clipboard!");
                    }}
                  >
                    Copy Payment Link
                  </Button>
                </>
              )}
              
              {activePayroll.paymentTx && (
                <Button 
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    // Open blockchain explorer - you might want to adjust this URL
                    const explorerUrl = `https://suiexplorer.com/txblock/${activePayroll.paymentTx}?network=testnet`;
                    window.open(explorerUrl, '_blank');
                  }}
                >
                  View on Explorer
                </Button>
              )}
            </div>
          </div>

          {/* Platform Info */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 How it works</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Client pays the total amount</li>
              <li>• Smart contract splits payment automatically</li>
              <li>• Each team member receives their share instantly</li>
              <li>• All transactions are recorded on Sui blockchain</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
