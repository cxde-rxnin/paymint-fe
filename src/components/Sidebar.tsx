import { Link, useLocation } from "react-router-dom";
import { useWalletStore } from "../store/useWalletStore";
import { truncateAddress } from "../utils/wallet";
import WalletConnect from "./WalletConnect";

export default function Sidebar() {
  const location = useLocation();
  const address = useWalletStore((s) => s.address);

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
    },
    {
      name: "Invoices",
      href: "/invoices",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: "Transactions",
      href: "/transactions",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 md:fixed z-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/25">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
        </div>
        <div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">Paymint</h1>
        <p className="text-xs text-gray-400 -mt-1">Web3 Invoicing</p>
        </div>
      </div>
      </div>

      {/* User Info */}
      {address && (
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">Connected</p>
          <p className="text-xs text-gray-400 truncate">{truncateAddress(address)}</p>
        </div>
        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
        </div>
      </div>
      )}

      {/* Navigation */}
      <nav className="p-6">
      <div className="space-y-2">
        {navigation.map((item) => {
        const isActive = location.pathname === item.href || 
          (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
        
        return (
          <Link
          key={item.name}
          to={item.href}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
            isActive
            ? "bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10"
            : "text-gray-300 hover:text-white hover:bg-gray-700/50 border border-transparent hover:border-gray-600/50"
          }`}
          >
          <div className={`transition-colors duration-300 ${
            isActive ? "text-emerald-400" : "text-gray-400 group-hover:text-white"
          }`}>
            {item.icon}
          </div>
          <span className="font-medium">{item.name}</span>
          {isActive && (
            <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full"></div>
          )}
          </Link>
        );
        })}
      </div>

      
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700/50 flex flex-col items-center">

      <WalletConnect />
      
      <div className="text-center mt-10">
        <p className="text-xs text-gray-400">
        Built on Sui Blockchain
        </p>
        <div className="flex items-center justify-center gap-1 mt-2">
        <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
        <p className="text-xs text-gray-500">Network: Testnet</p>
        </div>
      </div>
      </div>
    </div>
  );
}
