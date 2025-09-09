import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWalletStore } from "../store/useAuthStore";
import WalletConnect from "../components/WalletConnect";

export default function Landing() {
  const address = useWalletStore((s) => s.address);
  const navigate = useNavigate();

  // Redirect to dashboard when wallet is connected
  useEffect(() => {
    if (address) {
      navigate("/dashboard");
    }
  }, [address, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-400/5"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                         radial-gradient(circle at 75% 75%, rgba(5, 150, 105, 0.1) 0%, transparent 50%)`
      }}></div>
      
      {/* Navigation */}
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 w-full fixed z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">Paymint</h1>
                <p className="text-xs text-gray-400 -mt-1">Web3 Invoicing</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {address && (
                <Link 
                  to="/dashboard" 
                  className="hidden md:block text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
              )}
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative overflow-hidden pt-10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            {/* Hero Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                Built on Sui Blockchain
              </div>
              
              <h2 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">Create & Pay</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-green-400 bg-clip-text text-transparent">Web3 Invoices</span>
              </h2>
              
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                The next-generation invoice platform for crypto-native businesses. 
                Create transparent, secure invoices and receive instant payments on Sui blockchain.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <WalletConnect />
              
            </div>

          </div>
        </div>

        {/* Background Decorations */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-green-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-lg font-semibold text-white">Paymint</span>
          </div>
          <p className="text-gray-400">
            © {new Date().getFullYear()} Paymint — Built on Sui Blockchain
          </p>
        </div>
      </footer>
    </div>
  );
}
