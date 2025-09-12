import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWalletStore } from "../store/useAuthStore";
import WalletConnect from "../components/WalletConnect";
import logo from "../assets/logo.svg";

export default function Landing() {
  const address = useWalletStore((s) => s.address);
  const navigate = useNavigate();

  useEffect(() => {
    if (address) navigate("/dashboard");
  }, [address, navigate]);

  return (
    <div className="min-h-screen w-full relative">
      {/* Emerald Void */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)",
        }}
      />
      {/* Overlay only covers header and main */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: "calc(100vh - 120px)" }}
      >
        <div className="w-full h-full bg-black/80 z-0"></div>
      </div>

      {/* Navigation */}
      <header className="bg-black/50 backdrop-blur-2xl border-b border-gray-800 fixed w-full z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Paymint Logo" className="h-10 w-10" />
          </div>
          <div className="flex items-center gap-6">
            {address && (
              <Link
                to="/dashboard"
                className="hidden md:block text-gray-300 hover:text-emerald-400 font-medium transition-colors"
              >
                Dashboard
              </Link>
            )}
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 pt-28">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            Built on Sui Blockchain
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              The Future of
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-green-400 bg-clip-text text-transparent">
              On-Chain Payments
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Paymint makes it simple for freelancers and teams to issue invoices,
            manage payroll, and get paid instantly — fully on-chain, transparent,
            and without middlemen.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <WalletConnect />
          </div>
        </div>

        {/* Bento Grid Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 relative">
          <style>{`
            .glass-card {
              position: relative;
              overflow: hidden;
            }
            .glass-card::before {
              content: '';
              position: absolute;
              top: -40%;
              left: -40%;
              width: 180%;
              height: 180%;
              background: linear-gradient(120deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0.18) 100%);
              opacity: 0;
              transition: opacity 0.3s, transform 0.7s;
              pointer-events: none;
              z-index: 1;
              transform: translateX(-30%) skewX(-20deg);
            }
            .glass-card:hover::before {
              opacity: 1;
              transform: translateX(30%) skewX(-20deg);
              animation: shimmer 1.2s linear;
            }
            @keyframes shimmer {
              0% { opacity: 0.2; transform: translateX(-30%) skewX(-20deg); }
              100% { opacity: 0.5; transform: translateX(30%) skewX(-20deg); }
            }
          `}</style>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
            {/* Invoices */}
            <div className="glass-card md:col-span-3 bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/60 shadow-lg flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] hover:border-emerald-400/30">
              <div>
                <span className="inline-block px-3 py-1 mb-4 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
                  Invoicing
                </span>
                <h3 className="text-3xl font-bold mb-2">Create & Send Invoices</h3>
                <p className="text-gray-400">
                  Generate secure, verifiable invoices on-chain and share with your
                  clients via email or wallet address. Instant, borderless, and
                  transparent.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                <span>🔒 Trustless Transparency</span>
              </div>
            </div>

            {/* Streams */}
            <div className="glass-card md:col-span-3 bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/60 shadow-lg flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] hover:border-green-400/30">
              <div>
                <span className="inline-block px-3 py-1 mb-4 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                  Streams
                </span>
                <h3 className="text-3xl font-bold mb-2">Automated Payroll</h3>
                <p className="text-gray-400">
                  Pay multiple teammates in one go. Just create a stream, set
                  amounts, and funds are automatically split and sent on payment.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                <span>⚡ One-Click Team Payments</span>
              </div>
            </div>

            {/* Modern UI */}
            <div className="glass-card md:col-span-2 bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/60 shadow-lg flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] hover:border-purple-400/30">
              <div>
                <span className="inline-block px-3 py-1 mb-4 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold">
                  No borders, no delays.
                </span>
                <h3 className="text-2xl font-bold mb-2">Borderless Transactions</h3>
                <p className="text-gray-400">
                  Send and receive payments anywhere in the world with the speed and security of blockchain.
                </p>
              </div>
              <div className="mt-6 text-sm text-gray-500">🌍 Global Access</div>
            </div>

            {/* Fast & Secure */}
            <div className="glass-card md:col-span-4 bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/60 shadow-lg flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] hover:border-blue-400/30">
              <div>
                <span className="inline-block px-3 py-1 mb-4 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                  Payments
                </span>
                <h3 className="text-2xl font-bold mb-2">Fast & Secure</h3>
                <p className="text-gray-400">
                  Transactions settle instantly on Sui with best-in-class
                  performance, low fees, and robust security.
                </p>
              </div>
              <div className="mt-6 text-sm text-gray-500">🚀 Blockchain Powered</div>
            </div>
          </div>
          {/* Blurred gradient object for glassmorphism showcase */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-[300px] md:-mt-[450px] w-9/12 h-4/12 bg-gradient-to-r from-emerald-500/40 via-purple-400/30 to-emerald-400/40 rounded-3xl blur-3xl opacity-70 z-0"></div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-lg font-semibold">Paymint</span>
            <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
              Built on Sui
            </span>
          </div>
          <p className="text-gray-400 mb-2">
            The future of Web3 invoicing and payroll. Secure, instant, and
            transparent.
          </p>
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Paymint. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
