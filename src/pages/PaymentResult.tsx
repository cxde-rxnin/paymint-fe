import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatSui } from "../utils/format";

export default function PaymentResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const type = searchParams.get('type') || 'invoice'; // 'invoice' or 'payroll'
  const status = searchParams.get('status'); // 'success' or 'error'
  const txDigest = searchParams.get('txDigest');
  const amount = searchParams.get('amount');
  const service = searchParams.get('service');
  const projectName = searchParams.get('projectName');
  const recipientCount = searchParams.get('recipientCount');
  const error = searchParams.get('error');

  // Legacy support for old URL format
  const success = status === 'success' || searchParams.get('success') === 'true';

  useEffect(() => {
    // Auto redirect after 10 seconds
    const timeout = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 max-w-md w-full text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-4">
            {type === 'payroll' ? 'Payroll Payment Successful!' : 'Payment Successful!'}
          </h1>
          
          <div className="space-y-3 mb-6">
            {type === 'payroll' ? (
              <>
                {projectName && (
                  <p className="text-gray-300">
                    <span className="text-gray-400">Project: </span>
                    {projectName}
                  </p>
                )}
                {recipientCount && (
                  <p className="text-gray-300">
                    <span className="text-gray-400">Team Members: </span>
                    {recipientCount}
                  </p>
                )}
                <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
                  <p className="text-blue-400 text-sm">
                    💡 Funds have been automatically distributed to all team members on the Sui blockchain
                  </p>
                </div>
              </>
            ) : (
              <>
                {service && (
                  <p className="text-gray-300">
                    <span className="text-gray-400">Service: </span>
                    {service}
                  </p>
                )}
              </>
            )}
            {amount && (
              <p className="text-gray-300">
                <span className="text-gray-400">Amount: </span>
                {formatSui(parseFloat(amount))}
              </p>
            )}
            {txDigest && (
              <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/30">
                <p className="text-xs text-gray-400 mb-1">Transaction Hash:</p>
                <p className="text-xs font-mono text-emerald-400 break-all">{txDigest}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                navigate('/', { replace: true });
              }}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:transform hover:-translate-y-0.5"
            >
              Return to Home
            </button>
            
            {txDigest && (
              <a
                href={`https://testnet.suivision.xyz/txblock/${txDigest}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block px-6 py-3 bg-gray-700/50 text-gray-300 font-medium rounded-lg border border-gray-600/50 hover:bg-gray-600/50 transition-all duration-300"
              >
                View on Sui Explorer
              </a>
            )}
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            Automatically redirecting in 10 seconds...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/25">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">
          {type === 'payroll' ? 'Payroll Payment Failed' : 'Payment Failed'}
        </h1>
        
        <div className="space-y-3 mb-6">
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <p className="text-gray-400 text-sm">
            {type === 'payroll' 
              ? 'Your payroll payment could not be processed. Please try again or contact support if the problem persists.'
              : 'Your payment could not be processed. Please try again or contact support if the problem persists.'
            }
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:transform hover:-translate-y-0.5"
          >
            Try Again
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-gray-700/50 text-gray-300 font-medium rounded-lg border border-gray-600/50 hover:bg-gray-600/50 transition-all duration-300"
          >
            Return to Home
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          Automatically redirecting in 10 seconds...
        </p>
      </div>
    </div>
  );
}
