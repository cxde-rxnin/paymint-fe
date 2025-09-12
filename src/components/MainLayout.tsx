import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import logo from "../assets/logo.svg";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-400/5"></div>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div className="flex">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <Sidebar isSidebarOpen={true} onClose={() => {}} />
        </div>
        
        {/* Mobile Sidebar - Slide in from left */}
        <div className={`fixed inset-y-0 left-0 z-100 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <Sidebar isSidebarOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </div>
        
        <main className="flex-1 md:ml-60">
          {/* Mobile Header with Hamburger */}
          <div className="lg:hidden relative">
            {/* Glassmorphic background */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xl border-b border-emerald-400/20 shadow-lg z-0" />
            <div className="fixed bg-black/75 backdrop-blur-3xl w-full z-30 flex items-center justify-between px-4 py-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-emerald-300 hover:text-white hover:bg-emerald-500/20 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow"
                aria-label="Open sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center gap-3">
                <img src={logo} alt="Paymint Logo" className="w-20 h-10" />
              </div>
            </div>
          </div>
          
          {/* Page Content */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
