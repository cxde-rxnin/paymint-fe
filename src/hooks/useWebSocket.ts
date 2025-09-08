import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useWalletStore } from '../store/useWalletStore';
import { useInvoiceStore } from '../store/useInvoiceStore';
import { useTransactionStore } from '../store/useTransactionStore';

const SOCKET_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const address = useWalletStore((s) => s.address);
  const connected = useWalletStore((s) => s.connected);
  const fetchInvoices = useInvoiceStore((s) => s.fetchInvoices);
  const fetchTxs = useTransactionStore((s) => s.fetchTxs);

  useEffect(() => {
    if (!connected || !address) {
      // Disconnect if wallet is not connected
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Connect to WebSocket
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server');
      // Join the wallet-specific room
      socketRef.current?.emit('join-wallet', address);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    // Listen for invoice events
    socketRef.current.on('invoice-created', (data) => {
      console.log('New invoice created:', data);
      toast.success(`New invoice created: ${data.invoice.service}`);
      
      // Refresh invoices list
      if (address) {
        fetchInvoices(address);
      }
    });

    socketRef.current.on('invoice-paid', (data) => {
      console.log('Invoice paid:', data);
      toast.success(`Payment received for: ${data.invoice.service}`);
      
      // Refresh both invoices and transactions
      if (address) {
        fetchInvoices(address);
        fetchTxs(address);
      }
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [connected, address, fetchInvoices, fetchTxs]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false
  };
}
