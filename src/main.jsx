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
          {path: "payments", element: <ManagePayments />},
          {path: "payments/:payment_type", element: <PaymentList />}
        ],
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <ClerkProvider>
    <UserProvider>
      <RouterProvider router={routes} />,
    </UserProvider>
  </ClerkProvider>,
);
