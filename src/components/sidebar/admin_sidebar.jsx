// components/sidebar/AdminSidebar.jsx
import React from "react";
import {
  SignOutButton,
  UserAvatar,
  useUser as useClerkUser,
} from "@clerk/react";
import {
  LayoutDashboard,
  CreditCard,
  FileBarChart,
  Settings,
  LogOut,
  Shield,
  ChevronRight,
  Crown,
  AlertTriangle,
} from "lucide-react";
import { NavLink, useLocation } from "react-router";
import { useUser } from "../../context/user_context";

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/payments", label: "Payment Management", icon: CreditCard },
  { path: "/admin/payments/defaulters", label: "Defaulters", icon: AlertTriangle }, // 👈 added
  { path: "/admin/reports", label: "Report Management", icon: FileBarChart },
  { path: "/admin/settings", label: "Settings", icon: Settings },
  { path: "/dashboard", label: "Back", icon: LogOut }
];

const AdminSidebar = ({ isMobileOpen, onClose }) => {
  const { user } = useClerkUser();
  const { user_details } = useUser();
  const location = useLocation();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen
          w-[280px] bg-white border-r border-slate-200/80
          flex flex-col shadow-xl lg:shadow-none
          transition-transform duration-300 ease-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Desktop Intro Section - Hidden on Mobile */}
        <div className="hidden lg:block relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-rose-600 to-orange-600" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2aC00djJoNHYtMnptMC02di00aC00djRoNHptLTYgNmgtNHYyaDR2LTJ6bTAtNnYtNGgtNHY0aDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

          <div className="relative px-6 py-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
                <Shield className="w-7 h-7 text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white tracking-tight">
              Admin
            </h1>
            <p className="text-red-100 text-xs font-medium tracking-widest uppercase mt-1">
              Admin Control Panel
            </p>

            <div className="mt-4 flex items-center gap-2">
              <div className="h-px flex-1 bg-white/20" />
              <span className="text-white/60 text-xs font-semibold tracking-wider uppercase">
                {user_details?.HostelAbvr || "Hostel"}
              </span>
              <div className="h-px flex-1 bg-white/20" />
            </div>
          </div>
        </div>

        {/* Mobile Header - Shows close button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-red-600 to-rose-600 p-1.5 rounded-lg">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-800">Admin Menu</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3 lg:hidden">
            Navigation
          </div>

          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => onClose()}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl
                      transition-all duration-200 group
                      ${
                        isActive
                          ? "bg-red-50 text-red-700 shadow-sm ring-1 ring-red-100"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }
                    `}
                  >
                    <Icon
                      className={`
                        w-5 h-5 transition-colors
                        ${isActive ? "text-red-600" : "text-slate-400 group-hover:text-slate-600"}
                      `}
                    />
                    <span className="font-medium text-sm flex-1">
                      {item.label}
                    </span>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-red-400" />
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
            <div className="relative">
              <UserAvatar className="w-10 h-10 rounded-full ring-2 ring-red-100" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.fullName ||
                  user?.firstName ||
                  user_details?.name ||
                  "Admin"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.primaryEmailAddress?.emailAddress || "admin@example.com"}
              </p>
            </div>
          </div>

          <SignOutButton>
            <button
              className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl
              text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50
              transition-all duration-200 group"
            >
              <LogOut className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform" />
              <span>Sign Out</span>
            </button>
          </SignOutButton>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;