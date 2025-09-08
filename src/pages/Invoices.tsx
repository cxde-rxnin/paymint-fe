import { useEffect, useState } from "react";
import InvoiceTable from "../components/InvoiceTable";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import { toast } from 'react-toastify';
import { useInvoiceStore } from "../store/useInvoiceStore";
import { useWalletStore } from "../store/useWalletStore";
import { apiFetch } from "../utils/api";
import { suiToMist, mistToSui, formatSui } from "../utils/format";

export default function Invoices() {
  const invoices = useInvoiceStore((s) => s.invoices);
  const fetchInvoices = useInvoiceStore((s) => s.fetchInvoices);
  const walletAddress = useWalletStore((s) => s.address);
  const connected = useWalletStore((s) => s.connected);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  console.log("Wallet state:", { walletAddress, connected });

  console.log("Modal open state:", open);

  // form
  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [surchargeBps] = useState(250); // Fixed 2.5% surcharge
  const [dueDate, setDueDate] = useState("");
  const [clientId, setClientId] = useState<number>(0); // Invoice number
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setPayer("");
    setAmount("");
    setService("");
    setDescription("");
    setDueDate("");
    setStep(1);
    // Generate new invoice number
    setClientId(Math.floor(Math.random() * 10000) + 1000);
  };

  const closeModal = () => {
    setOpen(false);
    resetForm();
  };

  const openModal = () => {
    // Generate invoice number when opening modal
    setClientId(Math.floor(Math.random() * 10000) + 1000);
    setOpen(true);
  };

  useEffect(() => {
    fetchInvoices(walletAddress || undefined);
  }, [walletAddress]);

  const createInvoice = async () => { 
    console.log("Creating invoice with data:", { payer, amount, service, description, dueDate });
    console.log("Wallet address:", walletAddress);
    
    if (!payer || !amount || !service || !dueDate) {
      console.log("Missing required fields:", { payer, amount, service, dueDate });
      toast.error("Please complete all required fields");
      // Navigate back to the appropriate step
      if (!payer || !service || !dueDate) setStep(1);
      else if (!amount) setStep(2);
      return;
    }
    
    if (!walletAddress || !connected) {
      console.log("Wallet state check:", { walletAddress, connected });
      toast.error("Please connect your wallet first");
      return;
    }
    
    setIsLoading(true);
    
    const metadataHash = Array.from(new TextEncoder().encode("Paymint invoice"))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    
    try {
      console.log("Sending request to create invoice...");
      // Convert SUI amount to MIST (1 SUI = 1,000,000,000 MIST)
      const amountInMist = suiToMist(Number(amount));
      
      const result = await apiFetch("/api/invoices/create", {
        method: "POST",
        body: {
          payeeId: walletAddress, // The connected wallet is the payee
          payer,
          clientId: clientId, // Use the pre-generated invoice number
          amount: amountInMist,
          service,
          description,
          surchargeBps,
          metadataHash,
          dueDate: Math.floor(new Date(dueDate).getTime() / 1000),
        }
      });
      
      console.log("Invoice created successfully:", result);
      
      closeModal();
      fetchInvoices(walletAddress || undefined);
      toast.success("Invoice created successfully!");
    } catch (err: any) {
      console.error("Error creating invoice:", err);
      toast.error(`Failed to create invoice: ${err?.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" lg:p-8 min-h-screen">
      {/* Header Section */}
      <div className="mb-8 px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-green-400 bg-clip-text text-transparent">
                Invoices
              </h1>
              <p className="text-gray-400 text-lg mt-1">Manage your payment requests</p>
            </div>
          </div>
          
          <button 
            onClick={openModal}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            style={{ zIndex: 20 }}
          >
            Create Invoice
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{invoices.length}</p>
                <p className="text-gray-400 text-sm">Total Invoices</p>
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
                <p className="text-2xl font-bold text-white">{invoices.filter(inv => inv.status === "paid").length}</p>
                <p className="text-gray-400 text-sm">Paid</p>
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
                <p className="text-2xl font-bold text-white">{invoices.filter(inv => inv.status !== "paid").length}</p>
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
                  {formatSui(invoices.reduce((sum, inv) => sum + (inv.status === "paid" ? mistToSui(inv.amount) : 0), 0))}
                </p>
                <p className="text-gray-400 text-sm">SUI Received</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Table Section */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-xl font-bold text-white">Invoice List</h2>
        </div>
        <InvoiceTable invoices={invoices} />
      </div>

      <Modal isOpen={open} onClose={closeModal} size="lg">
        <div className="w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
          {/* Compact Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {step === 1 ? "Invoice Details" : step === 2 ? "Pricing & Description" : "Review Invoice"}
                </h3>
                <p className="text-gray-400 text-xs">
                  {step === 1 ? "Step 1 of 3" : step === 2 ? "Step 2 of 3" : "Step 3 of 3"}
                </p>
              </div>
            </div>
          </div>

          {step === 1 ? (
            // Step 1: Basic Details
            <div className="space-y-4">
              {/* Invoice Number */}
              <div className="bg-gray-800/30 p-3 rounded-xl border border-gray-700/50 text-center">
                <span className="text-emerald-400 font-mono font-semibold">
                  Invoice #{clientId || "####"}
                </span>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Client Email */}
                <div>
                  <label className="text-xs font-medium text-gray-300 mb-2 block">Client Email</label>
                  <Input 
                    type="email"
                    value={payer} 
                    onChange={(e) => setPayer(e.target.value)} 
                    placeholder="client@example.com" 
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500/50 transition-all duration-300 text-sm"
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="text-xs font-medium text-gray-300 mb-2 block">Due Date</label>
                  <Input 
                    type="date" 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)} 
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:border-emerald-500/50 transition-all duration-300 text-sm"
                  />
                </div>
              </div>

              {/* Service - Full Width */}
              <div>
                <label className="text-xs font-medium text-gray-300 mb-2 block">Service</label>
                <Input 
                  type="text"
                  value={service} 
                  onChange={(e) => setService(e.target.value)} 
                  placeholder="e.g. Web Development, UI/UX Design, Consulting..." 
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500/50 transition-all duration-300 text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={closeModal} 
                  className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-xl font-medium hover:bg-gray-600/50 transition-all duration-300 text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (!payer || !service || !dueDate) {
                      toast.error("Please fill in all required fields");
                      return;
                    }
                    setStep(2);
                  }}
                  disabled={!payer || !service || !dueDate}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Next →
                </button>
              </div>
            </div>
          ) : step === 2 ? (
            // Step 2: Pricing & Description
            <div className="space-y-4">
              {/* Amount */}
              <div>
                <label className="text-xs font-medium text-gray-300 mb-2 block">Amount (SUI)</label>
                <Input 
                  type="number" 
                  step="0.001"
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))} 
                  placeholder="0.000"
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500/50 transition-all duration-300 text-sm"
                />
              </div>

              {/* Description - Full Width */}
              <div>
                <label className="text-xs font-medium text-gray-300 mb-2 block">Description (Optional)</label>
                <Input 
                  type="text"
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Additional details about the service..." 
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500/50 transition-all duration-300 text-sm"
                />
              </div>

              {/* Price Summary */}
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
                <h5 className="text-white font-medium mb-3 text-sm">Price Breakdown</h5>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">Service Amount</span>
                  <span className="text-white font-medium">{amount || '0.00'} SUI</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-xs">Network Fee (2.5%)</span>
                  <span className="text-emerald-400 text-sm">
                    +{amount ? ((Number(amount) * surchargeBps) / 10000).toFixed(4) : '0.0000'} SUI
                  </span>
                </div>
                <div className="border-t border-gray-700/50 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total Amount</span>
                    <span className="text-emerald-400 font-bold text-lg">
                      {amount ? (Number(amount) + (Number(amount) * surchargeBps) / 10000).toFixed(4) : '0.0000'} SUI
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setStep(1)} 
                  className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-xl font-medium hover:bg-gray-600/50 transition-all duration-300 text-sm"
                >
                  ← Back
                </button>
                <button 
                  onClick={() => {
                    if (!amount) {
                      toast.error("Please enter an amount");
                      return;
                    }
                    setStep(3);
                  }}
                  disabled={!amount}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Review →
                </button>
              </div>
            </div>
          ) : (
            // Step 3: Final Review
            <div className="space-y-4">
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
                <h4 className="text-white font-semibold mb-3 text-sm">Final Invoice Review</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-300">Client</span>
                    <span className="text-white font-medium">{payer}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-300">Service</span>
                    <span className="text-white font-medium">{service}</span>
                  </div>
                  {description && (
                    <div className="flex justify-between items-start py-1 flex-col md:flex-row">
                      <span className="text-gray-300">Description</span>
                      <span className="text-white font-medium text-left max-w-xs break-words">{description}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-300">Due Date</span>
                    <span className="text-white font-medium">{new Date(dueDate).toLocaleDateString()}</span>
                  </div>
                  <hr className="border-gray-700/50 my-2" />
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-300">Service Amount</span>
                    <span className="text-white font-medium">{amount} SUI</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-400">Network Fee (2.5%)</span>
                    <span className="text-emerald-400">+{((Number(amount) * surchargeBps) / 10000).toFixed(4)} SUI</span>
                  </div>
                  <div className="flex justify-between items-center py-2 bg-emerald-500/10 rounded-lg px-3">
                    <span className="text-white font-semibold">Total Invoice Amount</span>
                    <span className="text-emerald-400 font-bold text-lg">
                      {(Number(amount) + (Number(amount) * surchargeBps) / 10000).toFixed(4)} SUI
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setStep(2)} 
                  className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-xl font-medium hover:bg-gray-600/50 transition-all duration-300 text-sm"
                >
                  ← Back
                </button>
                <button 
                  onClick={createInvoice} 
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isLoading ? 'Creating...' : 'Create Invoice'}
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
