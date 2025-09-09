import { useState } from "react";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import { toast } from 'react-toastify';
import { usePayrollStore, type CreatePayrollData, type PayrollRecipient } from "../store/usePayrollStore";
import { useWalletStore } from "../store/useWalletStore";

interface CreatePayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePayrollModal: React.FC<CreatePayrollModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { address } = useWalletStore();
  const { createPayroll, loading } = usePayrollStore();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    clientEmail: "",
    dueDate: "",
    surchargeBps: 250, // 2.5% platform fee
  });
  
  const [recipients, setRecipients] = useState<PayrollRecipient[]>([
    { wallet: "", amount: 0 }
  ]);

  const resetForm = () => {
    setFormData({
      projectName: "",
      description: "",
      clientEmail: "",
      dueDate: "",
      surchargeBps: 250, // 2.5% platform fee
    });
    setRecipients([{ wallet: "", amount: 0 }]);
    setStep(1);
  };

  const closeModal = () => {
    onClose();
    resetForm();
  };

  const handleAddRecipient = () => {
    setRecipients([...recipients, { wallet: "", amount: 0 }]);
  };

  const handleRemoveRecipient = (index: number) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index));
    }
  };

  const handleRecipientChange = (index: number, field: keyof PayrollRecipient, value: string | number) => {
    const updated = [...recipients];
    if (field === "amount") {
      updated[index][field] = typeof value === "string" ? parseFloat(value) || 0 : value;
    } else {
      updated[index][field] = value as string;
    }
    setRecipients(updated);
  };

  const calculateTotalAmount = () => {
    return recipients.reduce((sum, recipient) => sum + recipient.amount, 0);
  };

  const calculateSurcharge = () => {
    const total = calculateTotalAmount();
    return (total * formData.surchargeBps) / 10000;
  };

  const calculateFinalTotal = () => {
    return calculateTotalAmount() + calculateSurcharge();
  };

  const handleSubmit = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!formData.projectName || !formData.clientEmail || !formData.dueDate) {
      toast.error("Please complete all required fields");
      if (!formData.projectName || !formData.clientEmail || !formData.dueDate) setStep(1);
      return;
    }

    if (recipients.length === 0 || recipients.some(r => !r.wallet.trim() || r.amount <= 0)) {
      toast.error("Please add at least one valid team member");
      if (step !== 2) setStep(2);
      return;
    }

    try {
      const dueDate = Math.floor(new Date(formData.dueDate).getTime() / 1000);
      
      // Convert amounts to MIST (multiply by 1e9)
      const recipientsInMist = recipients.map(r => ({
        wallet: r.wallet,
        amount: Math.floor(r.amount * 1_000_000_000)
      }));

      const payrollData: CreatePayrollData = {
        issuer: address,
        clientEmail: formData.clientEmail,
        recipients: recipientsInMist,
        surchargeBps: formData.surchargeBps,
        metadataHash: "0x" + btoa(JSON.stringify({
          projectName: formData.projectName,
          description: formData.description,
        })),
        dueDate,
        projectName: formData.projectName,
        description: formData.description,
      };

      await createPayroll(payrollData);
      closeModal();
      toast.success("Payroll created successfully!");
    } catch (error) {
      console.error("Error creating payroll:", error);
      toast.error("Failed to create payroll");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="lg">
      <div className="w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        {/* Compact Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {step === 1 ? "Payroll Details" : step === 2 ? "Team Members" : "Review Payroll"}
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
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project Name */}
              <div>
                <label className="text-xs font-medium text-gray-300 mb-2 block">Project Name</label>
                <Input 
                  type="text"
                  value={formData.projectName} 
                  onChange={(e) => setFormData({...formData, projectName: e.target.value})} 
                  placeholder="e.g. Q4 2024 Sprint" 
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500/50 transition-all duration-300 text-sm"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="text-xs font-medium text-gray-300 mb-2 block">Due Date</label>
                <Input 
                  type="date" 
                  value={formData.dueDate} 
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})} 
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:border-emerald-500/50 transition-all duration-300 text-sm"
                />
              </div>
            </div>

            {/* Client Email - Full Width */}
            <div>
              <label className="text-xs font-medium text-gray-300 mb-2 block">Client Email</label>
              <Input 
                type="email"
                value={formData.clientEmail} 
                onChange={(e) => setFormData({...formData, clientEmail: e.target.value})} 
                placeholder="client@example.com" 
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500/50 transition-all duration-300 text-sm"
              />
            </div>

            {/* Description - Full Width */}
            <div>
              <label className="text-xs font-medium text-gray-300 mb-2 block">Description (Optional)</label>
              <Input 
                type="text"
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Project details, milestones, etc..." 
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
                  if (!formData.projectName || !formData.clientEmail || !formData.dueDate) {
                    toast.error("Please fill in all required fields");
                    return;
                  }
                  if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
                    toast.error("Please enter a valid email address");
                    return;
                  }
                  setStep(2);
                }}
                disabled={!formData.projectName || !formData.clientEmail || !formData.dueDate}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next →
              </button>
            </div>
          </div>
        ) : step === 2 ? (
          // Step 2: Team Members
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-medium text-sm">Team Members</h4>
              <button
                onClick={handleAddRecipient}
                className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/30 transition-all duration-300"
              >
                + Add Member
              </button>
            </div>

            {/* Recipients List */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {recipients.map((recipient, index) => (
                <div key={index} className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gray-400 text-xs">Member {index + 1}</span>
                    {recipients.length > 1 && (
                      <button
                        onClick={() => handleRemoveRecipient(index)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-gray-300 mb-1 block">Wallet Address</label>
                      <Input
                        type="text"
                        value={recipient.wallet}
                        onChange={(e) => handleRecipientChange(index, "wallet", e.target.value)}
                        placeholder="0x..."
                        className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500/50 transition-all duration-300 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-300 mb-1 block">Amount (SUI)</label>
                      <Input
                        type="number"
                        step="0.001"
                        value={recipient.amount}
                        onChange={(e) => handleRecipientChange(index, "amount", e.target.value)}
                        placeholder="0.000"
                        className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500/50 transition-all duration-300 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
              <h5 className="text-white font-medium mb-3 text-sm">Payment Summary</h5>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Total Amount</span>
                <span className="text-emerald-400 font-bold text-lg">
                  {calculateTotalAmount().toFixed(4)} SUI
                </span>
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
                  if (recipients.length === 0 || recipients.some(r => !r.wallet.trim() || r.amount <= 0)) {
                    toast.error("Please add at least one valid team member");
                    return;
                  }
                  setStep(3);
                }}
                disabled={recipients.length === 0 || recipients.some(r => !r.wallet.trim() || r.amount <= 0)}
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
              <h4 className="text-white font-semibold mb-3 text-sm">Final Payroll Review</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-300">Project</span>
                  <span className="text-white font-medium">{formData.projectName}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-300">Client</span>
                  <span className="text-white font-medium">{formData.clientEmail}</span>
                </div>
                {formData.description && (
                  <div className="flex justify-between items-start py-1 flex-col md:flex-row">
                    <span className="text-gray-300">Description</span>
                    <span className="text-white font-medium text-left max-w-xs break-words">{formData.description}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-300">Due Date</span>
                  <span className="text-white font-medium">{formData.dueDate}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-300">Team Members</span>
                  <span className="text-white font-medium">{recipients.length}</span>
                </div>
              </div>
            </div>

            {/* Team Members Summary */}
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
              <h5 className="text-white font-medium mb-3 text-sm">Team Payment Breakdown</h5>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {recipients.map((recipient, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="text-gray-300 text-xs font-mono">{recipient.wallet.slice(0, 8)}...</span>
                    <span className="text-white font-medium">{recipient.amount.toFixed(4)} SUI</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-700/50 pt-2 mt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">Team Payment</span>
                  <span className="text-white font-medium">{calculateTotalAmount().toFixed(4)} SUI</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-xs">Platform Fee (2.5%)</span>
                  <span className="text-emerald-400 text-sm">+{calculateSurcharge().toFixed(4)} SUI</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-600/50 pt-2">
                  <span className="text-white font-semibold">Total Amount</span>
                  <span className="text-emerald-400 font-bold text-lg">
                    {calculateFinalTotal().toFixed(4)} SUI
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
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? "Creating..." : "Create Payroll"}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
