import React from "react";
import {
  Show,
  SignInButton
} from "@clerk/react";
import { NavLink } from "react-router";
import {
  Shield,
  Building2,
  Users,
  CreditCard,
  FileText,
  AlertTriangle,
  Download,
  Archive,
  Database,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

// --- Feature Data ---
const features = [
  {
    module: "User Management",
    icon: Users,
    color: "from-rose-500 to-red-600",
    bgColor: "bg-rose-50",
    textColor: "text-rose-700",
    borderColor: "border-rose-200",
    reqs: [
      "Student registration via roll number, email & phone",
      "Role-based secure authentication (Admin / Student)",
      "Profile viewing & updating capabilities",
      "Admin boarder list access & management",
    ],
  },
  {
    module: "Payment & Reconciliation",
    icon: CreditCard,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    reqs: [
      "Submit payment details with UPI Txn ID & receipt upload",
      "Edit/delete submissions while pending",
      "Admin bank statement upload (CSV/Excel)",
      "Automated matching worker & categorization",
      "Manual verification & defaulter identification",
    ],
  },
  {
    module: "Grievance / Report Management",
    icon: AlertTriangle,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    reqs: [
      "Lodge complaints under predefined categories",
      "Attach supporting images to reports",
      "Track report status in real-time",
      "Admin filtering by category/hostel & status updates",
    ],
  },
  {
    module: "Utilities & Exportation",
    icon: Database,
    color: "from-indigo-500 to-violet-600",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-700",
    borderColor: "border-indigo-200",
    reqs: [
      "Export payment data, reports & defaulters to Excel",
      "Download archived zipped receipt bundles",
      "Trigger database backups with retention policies",
      "Secure data handling & deletion workflows",
    ],
  },
];

// --- Component ---
const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-rose-100 selection:text-rose-900">

      {/* ==================== NAVBAR ==================== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/60"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-lg shadow-lg shadow-violet-600/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                  CHMS
                </span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider leading-none mt-0.5 hidden sm:block">
                  Central Hostel Mgmt
                </span>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">
                Features
              </a>
              <a href="#modules" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">
                Modules
              </a>

              <Show when={"signed-in"}>
                <NavLink
                  to="/dashboard"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <Shield className="w-4 h-4" />
                  Dashboard
                </NavLink>
              </Show>

              <Show when={"signed-out"}>
                <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 active:scale-95 transition-all duration-200">
                    Log In
                  </button>
                </SignInButton>
              </Show>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 font-medium">
                Features
              </a>
              <a href="#modules" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 font-medium">
                Modules
              </a>
              <div className="pt-2 border-t border-slate-100">
                <Show when={"signed-in"}>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg"
                  >
                    <Shield className="w-4 h-4" />
                    Go to Dashboard
                  </NavLink>
                </Show>
                <Show when={"signed-out"}>
                  <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                    <button className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold">
                      Log In
                    </button>
                  </SignInButton>
                </Show>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-rose-50 to-orange-50 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-200 text-indigo-600 text-sm font-semibold mb-8 shadow-sm">
            <Shield className="w-4 h-4" />
            <span>Secure. Efficient. Centralized.</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6">
            Central Hostel
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Management System
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed">
            Streamline payments, track grievances, and manage boarders 
            all in one powerful, secure platform built for modern hostel administration.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Show when={"signed-in"}>
              <NavLink
                to="/dashboard"
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-lg font-bold shadow-xl shadow-violet-600/25 hover:shadow-violet-600/40 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </NavLink>
            </Show>

            <Show when={"signed-out"}>
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-lg font-bold shadow-xl shadow-violet-600/25 hover:shadow-violet-600/40 hover:scale-105 active:scale-95 transition-all duration-300">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignInButton>
            </Show>

            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 text-lg font-semibold hover:border-rose-300 hover:text-rose-700 hover:bg-rose-50/50 transition-all duration-200"
            >
              Explore Features
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { label: "Modules", value: "4" },
              { label: "Features", value: "15+" },
              { label: "Secure", value: "100%" },
              { label: "Uptime", value: "99.9%" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES GRID ==================== */}
      <section id="features" className="py-20 lg:py-28 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to manage your hostel operations efficiently, from payments to grievances.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "User Management", desc: "Registration, roles & profiles", color: "text-rose-600", bg: "bg-rose-100" },
              { icon: CreditCard, title: "Payments", desc: "UPI reconciliation & verification", color: "text-amber-600", bg: "bg-amber-100" },
              { icon: FileText, title: "Reports", desc: "Grievance tracking & resolution", color: "text-emerald-600", bg: "bg-emerald-100" },
              { icon: Download, title: "Exports", desc: "Excel, ZIP & backup utilities", color: "text-indigo-600", bg: "bg-indigo-100" },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== DETAILED MODULES ==================== */}
      <section id="modules" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              System Modules
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive functional requirements organized into four core modules.
            </p>
          </div>

          <div className="space-y-8">
            {features.map((mod, idx) => (
              <div
                key={mod.module}
                className={`relative overflow-hidden rounded-3xl border ${mod.borderColor} ${mod.bgColor} p-8 lg:p-10 transition-all duration-300 hover:shadow-lg`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
                  {/* Icon */}
                  <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center shadow-lg`}>
                    <mod.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-2xl font-bold text-slate-900">{mod.module}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${mod.bgColor} ${mod.textColor} border ${mod.borderColor}`}>
                        Module {idx + 1}
                      </span>
                    </div>

                    <ul className="grid sm:grid-cols-2 gap-3">
                      {mod.reqs.map((req, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-3">
                          <CheckCircle2 className={`w-5 h-5 ${mod.textColor} shrink-0 mt-0.5`} />
                          <span className="text-sm text-slate-700 leading-relaxed">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 lg:p-16 text-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2aC00djJoNHYtMnptMC02di00aC00djRoNHptLTYgNmgtNHYyaDR2LTJ6bTAtNnYtNGgtNHY0aDR6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
            </div>

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to streamline your hostel?
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
                Join thousands of students and administrators using CHMS for seamless hostel management.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Show when={"signed-in"}>
                  <NavLink
                    to="/dashboard"
                    className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-slate-900 text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    <span>Access Dashboard</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </NavLink>
                </Show>

                <Show when={"signed-out"}>
                  <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                    <button className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-slate-900 text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300">
                      <span>Get Started Now</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </SignInButton>
                </Show>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-br from-rose-600 to-red-700 p-1.5 rounded-lg">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">CHMS</span>
              <span className="text-sm text-slate-500">© 2026</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span>Central Hostel Management System</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Built with security in mind</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
