import { useWalletStore } from "../store/useWalletStore";
import { ConnectButton } from "@mysten/dapp-kit";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const WalletConnect = () => {
  const account = useCurrentAccount();
  const { setAddress, setConnected } = useWalletStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (account?.address) {
      setAddress(account.address);
      setConnected(true);
    } else {
      setAddress(null);
      setConnected(false);
      // Redirect to landing page if disconnected and currently on a protected route
      const protectedRoutes = ["/dashboard", "/invoices", "/transactions"];
      const isOnProtectedRoute = protectedRoutes.some(route => 
        location.pathname.startsWith(route)
      );
      
      if (isOnProtectedRoute) {
        navigate("/");
      }
    }
  }, [account, setAddress, setConnected, navigate, location.pathname]);


  return (
    <div className="flex items-center gap-3">
      
      <ConnectButton
        connectText={account?.address ? "Connected" : "Connect Wallet"}
        className="
          px-6 py-3 
          bg-emerald-500
          text-white font-semibold 
          rounded-lg shadow-lg 
          transition-all duration-300 
          hover:transform hover:-translate-y-0.5
          focus:outline-none focus:ring-4 focus:ring-emerald-500/20
        "
      />
    </div>
  );
};

export default WalletConnect;
