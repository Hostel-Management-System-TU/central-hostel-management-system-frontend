// components/AuthWrapper.jsx
import { Navigate, Outlet } from "react-router";
import { useUser } from "../../context/user_context";
import Loader from "../loaders/loader";
import Register from "../../pages/Register";

export default function AuthWrapper({ type }) {
  const { isLoading, isSignedIn, isRegistered } = useUser();

  if (isLoading) return <Loader />;

  // ❌ Not logged in → only landing allowed
  if (!isSignedIn) {
    if (type === "public") return <Outlet />;
    return <Navigate to="/" />;
  }

  // ⚠️ Logged in but NOT registered
  if (isSignedIn && !isRegistered) {
    return <Register />;
  }

  // ✅ Fully authenticated
  return <Outlet />;
}