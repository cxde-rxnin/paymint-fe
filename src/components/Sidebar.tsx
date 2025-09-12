import { Link, useLocation } from "react-router-dom";
import WalletConnect from "./WalletConnect";
import logo from "../assets/logo1.svg";

interface SidebarProps {
  isSidebarOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isSidebarOpen, onClose }: SidebarProps) {
  const location = useLocation();

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
      name: "Payrolls",
      href: "/payrolls",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-label="Close sidebar overlay"
      />
      <aside className={`w-72 md:w-60 min-h-screen bg-black border-r border-gray-800/60 fixed z-40 flex flex-col transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Emerald Gradient Accent */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-500/30 via-green-400/20 to-emerald-400/30 blur-2xl opacity-60 z-0"></div>
        {/* Logo/Header */}
        <div className="relative z-10 flex items-center gap-3 px-8 py-8 border-b border-gray-800/60">
          <img src={logo} alt="Paymint Logo" className="h-16 w-40" />
          {/* X icon for mobile close */}
          <button
            className="ml-auto lg:hidden p-2 text-gray-400 hover:text-white rounded-full transition-colors"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 px-8 py-8 flex-1">
          <div className="space-y-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`glass-card flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-300 cursor-pointer border shadow-lg backdrop-blur-xl text-base font-medium ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 border-emerald-400/30 text-emerald-400 shadow-emerald-500/10 scale-[1.03]"
                      : "bg-black/60 border-gray-800/60 text-gray-300 hover:text-white hover:border-emerald-400/20 hover:scale-[1.02]"
                  }`}
                >
                  <span className={`transition-colors duration-300 ${isActive ? "text-emerald-400" : "text-gray-400 group-hover:text-white"}`}>{item.icon}</span>
                  <span>{item.name}</span>
                  {isActive && <span className="ml-auto w-2 h-2 bg-emerald-400 rounded-full"></span>}
                </Link>
              );
            })}
          </div>
        </nav>
        {/* Footer */}
        <footer className="relative z-10 mt-auto px-8 py-6 border-t border-gray-800/60 flex flex-col items-center">
          <WalletConnect />
          <div className="text-center mt-8">
            <p className="text-xs text-gray-400">Built on Sui Blockchain</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-xs text-gray-500">Network: Testnet</span>
            </div>
          </div>
        </footer>
      </aside>
    </>
  );
}
