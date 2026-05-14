import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import UserLayout from "./layouts/user_layout";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import { ClerkProvider, useAuth as useClerkAuth } from "@clerk/react";
import Payment from "./pages/Payment";
import Report from "./pages/Report";
import { UserProvider } from "./context/user_context";
import AuthWrapper from "./components/Auth/AuthWrapper";
import AdminLayout from "./layouts/admin_layout";
import ManagePayments from "./pages/ManagePayments";
import PaymentList from "./pages/PaymentLists";
import DefaultersPage from "./pages/Defaulters";
import { Toaster } from "sonner";
import AdminDashboard from "./pages/AdminDashboard";

const routes = createBrowserRouter([
  // 🌍 Public routes
  {
    element: <AuthWrapper type="public" />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
    ],
  },

  // 🔒 Protected routes
  {
    element: <AuthWrapper />,
    children: [
      {
        element: <UserLayout />,
        children: [
          { path: "/dashboard", element: <Home /> },
          { path: "/payment", element: <Payment /> },
          { path: "/report", element: <Report /> },
        ],
      },
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {path: "dashboard", element: <AdminDashboard />},
          {path: "payments", element: <ManagePayments />},
          {path: "payments/list/:payment_type", element: <PaymentList />},
          {path: "payments/defaulters", element: <DefaultersPage />},
        ],
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <>
  <Toaster
        position="top-right"
        richColors
        closeButton
      />
  <ClerkProvider>
    <UserProvider>
      <RouterProvider router={routes} />,
    </UserProvider>
  </ClerkProvider>
  </>
);
