import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ConnectButton, 
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { toast } from 'react-toastify';
import { useWalletStore } from "../store/useWalletStore";
import { apiFetch } from "../utils/api";
import { mistToSui, formatSui } from "../utils/format";

export default function PayInvoice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const address = useWalletStore((s) => s.address);
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        // Use MongoDB ID endpoint since email links use MongoDB ID
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

  const handlePay = async () => {
    const walletAddress = currentAccount?.address || address;
    
    if (!walletAddress) {
      alert("Connect wallet to pay");
      return;
    }

    console.log('Attempting payment with address:', walletAddress);
    
    setPayLoading(true);
    try {
      // Calculate total amount in MIST (smallest unit)
      const totalAmountMist = invoice.amount + Math.floor((invoice.amount * invoice.surchargeBps) / 10000);
      
      // Get the package ID and other contract details from backend
      const contractInfo = await apiFetch('/api/invoices/contracts/info');
      
      // Create a new transaction
      const tx = new Transaction();
      
      // Get coins from the wallet to pay with
      const coins = await suiClient.getCoins({
        owner: walletAddress,
        coinType: "0x2::sui::SUI",
      });

      if (!coins.data.length) {
        throw new Error("No SUI coins found in your wallet.");
      }

      console.log('Available coins:', coins.data.map(c => ({ id: c.coinObjectId, balance: parseInt(c.balance) / 1_000_000_000 })));
      console.log('Payment needed:', totalAmountMist / 1_000_000_000, 'SUI');

      // Check if we have enough total balance
      const totalBalance = coins.data.reduce((sum, coin) => sum + parseInt(coin.balance), 0);
      if (totalBalance < totalAmountMist) {
        throw new Error(`Insufficient balance. Need ${totalAmountMist / 1_000_000_000} SUI, have ${totalBalance / 1_000_000_000} SUI`);
      }

      // Don't set gas budget manually - let Sui handle it
      // tx.setGasBudget(gasReserve);

      // Use the payment coin directly for the transaction
      // The Sui SDK will automatically handle gas from other coins
      const [paymentCoin] = tx.splitCoins(tx.gas, [totalAmountMist]);

      // Call the smart contract pay_invoice function
      // Function signature: pay_invoice<CoinType>(invoice_obj: &mut Invoice, payment: Coin<CoinType>, platform_recipient: address, ctx: &mut TxContext)
      tx.moveCall({
        target: `${contractInfo.packageId}::invoice::pay_invoice`,
        typeArguments: ['0x2::sui::SUI'], // Specify the coin type
        arguments: [
          tx.object(invoice.objectId), // invoice object (&mut Invoice) - shared object
          paymentCoin, // payment coin (Coin<SUI>)
          tx.pure.address(contractInfo.platformRecipient) // platform recipient address (gets the surcharge)
        ],
      });

      // Execute the transaction with user's wallet
      console.log('Executing transaction with automatic gas handling');
      
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: async (result) => {
            console.log('Payment successful:', result);
            
            try {
              // Update invoice status in backend
              await apiFetch(`/api/invoices/${invoice._id}/mark-paid`, {
                method: "POST",
                body: { txDigest: result.digest }
              });
              
              toast.success('Payment successful! Redirecting...');
              
              // Navigate to success page with transaction details
              const params = new URLSearchParams({
                success: 'true',
                txDigest: result.digest,
                amount: mistToSui(totalAmountMist).toString(),
                service: invoice.service
              });
              
              setTimeout(() => {
                navigate(`/payment-result?${params.toString()}`);
              }, 1500);
              
            } catch (updateError) {
              console.error('Failed to update invoice status:', updateError);
              toast.warning(`Payment successful but failed to update status. Transaction: ${result.digest}`);
              
              // Still navigate to success page but with a warning
              const params = new URLSearchParams({
                success: 'true',
                txDigest: result.digest,
                amount: mistToSui(totalAmountMist).toString(),
                service: invoice.service
              });
              
              setTimeout(() => {
                navigate(`/payment-result?${params.toString()}`);
              }, 2000);
            }
          },
          onError: (error) => {
            console.error('Payment failed:', error);
            
            // Provide more specific error messages
            let errorMessage = error.message;
            if (errorMessage.includes('Insufficient gas')) {
              errorMessage = 'Insufficient SUI for gas fees. Please ensure you have at least 0.01 SUI extra for transaction fees.';
            } else if (errorMessage.includes('Insufficient funds')) {
              errorMessage = 'Insufficient SUI balance. Please add more SUI to your wallet.';
            } else if (errorMessage.includes('rejected')) {
              errorMessage = 'Transaction was rejected. Please try again.';
            }
            
            toast.error(errorMessage);
            
            // Navigate to error page
            const params = new URLSearchParams({
              success: 'false',
              error: errorMessage
            });
            
            setTimeout(() => {
              navigate(`/payment-result?${params.toString()}`);
            }, 1500);
          }
        }
      );
    } catch (e: any) {
      console.error('Payment error:', e);
      toast.error(e?.message || "Payment failed");
      
      // Navigate to error page
      const params = new URLSearchParams({
        success: 'false',
        error: e?.message || "Payment failed"
      });
      
      setTimeout(() => {
        navigate(`/payment-result?${params.toString()}`);
      }, 1500);
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading invoice...</p>
      </div>
    </div>
  );
  
  if (!invoice) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center">
        <p className="text-gray-400">Invoice not found</p>
      </div>
    </div>
  );

  // Convert MIST to SUI for display
  const amountInSui = mistToSui(invoice.amount);
  const surchargeInSui = (amountInSui * invoice.surchargeBps) / 10000;
  const totalInSui = amountInSui + surchargeInSui;

  // Get the current wallet address
  const walletAddress = currentAccount?.address || address;
  const isWalletConnected = !!walletAddress;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-400/5"></div>
      
      <div className="flex items-center justify-center min-h-screen p-4 lg:p-6">
        <div className="relative w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-green-400 bg-clip-text text-transparent mb-3">
                Pay Invoice
              </h1>
              <p className="text-gray-400 text-lg">
                Invoice #{invoice.clientId}
              </p>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            {/* Invoice Details */}
            <div className="space-y-6 mb-8">
              <div className="text-center pb-6 border-b border-gray-700/50">
                <p className="text-sm text-gray-400 mb-3 font-medium">Total Amount Due</p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <p className="text-4xl font-bold text-white">{formatSui(totalInSui)}</p>
                </div>
              </div>

              </div>

            {/* Wallet State - Disconnected */}
            {!isWalletConnected && (
              <div className="text-center space-y-6">
                <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
                  <p className="text-gray-400 mb-6">
                    Connect your Sui wallet to proceed with the payment. Your wallet must have sufficient SUI tokens to complete this transaction.
                  </p>
                  <ConnectButton 
                    connectText="Connect Wallet"
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 text-white font-bold rounded-xl shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:transform hover:-translate-y-1 border border-blue-500/30"
                  />
                </div>
                
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure blockchain payment</span>
                </div>
              </div>
            )}

            {/* Wallet State - Connected */}
            {isWalletConnected && (
              <div className="space-y-6">
                {/* Connected Status */}
                <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl border border-emerald-500/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-emerald-300 font-semibold">Wallet Connected</p>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-emerald-400/70 text-sm font-mono">
                        {walletAddress?.slice(0, 12)}...{walletAddress?.slice(-8)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Ready to pay</p>
                      <p className="text-emerald-400 font-bold">{formatSui(totalInSui)}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <button 
                  onClick={handlePay} 
                  disabled={payLoading}
                  className="w-full group relative overflow-hidden px-8 py-6 bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-500 text-white font-bold text-lg rounded-xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg border border-emerald-400/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  
                  {payLoading ? (
                    <span className="relative flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing Payment...</span>
                    </span>
                  ) : (
                    <span className="relative flex items-center justify-center gap-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Pay Invoice • {formatSui(totalInSui)}</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Footer Info */}
            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Secured by Sui Blockchain</span>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2 leading-relaxed">
                This payment will be processed on the Sui blockchain. Ensure you have sufficient SUI tokens in your wallet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
