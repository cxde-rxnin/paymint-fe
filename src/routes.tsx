import { createBrowserRouter } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import InvoiceDetails from "./pages/InvoiceDetails";
import Transactions from "./pages/Transactions";
import PayInvoice from "./pages/PayInvoice";
import PaymentResult from "./pages/PaymentResult";
import { Payrolls } from "./pages/Payrolls";
import { PayrollDetails } from "./pages/PayrollDetails";
import { PayPayroll } from "./pages/PayPayroll";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/pay/:id", element: <PayInvoice /> },
  { path: "/pay-payroll/:id", element: <PayPayroll /> },
  { path: "/payment-result", element: <PaymentResult /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "invoices", element: <Invoices /> },
      { path: "invoices/:id", element: <InvoiceDetails /> },
      { path: "payrolls", element: <Payrolls /> },
      { path: "payrolls/:id", element: <PayrollDetails /> },
      { path: "transactions", element: <Transactions /> },
    ],
  },
]);
