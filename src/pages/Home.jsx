// pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Wallet,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Receipt,
  CreditCard,
  Zap,
  Droplets,
  Sofa,
  Sparkles,
  Shield,
  Volume2,
  UtensilsCrossed,
  HelpCircle,
  Bell,
  Calendar,
  IndianRupee,
} from "lucide-react";
import { useAuth } from "@clerk/react";
import { useUser } from "../context/user_context";
import { FetchUserPaymentHistory } from "../services/Payment/Payment";
import { FetchUserReports } from "../services/Report/Report";
import { toast } from "sonner";

const REPORT_TYPE_MAP = {
  1: { label: "Electricity", icon: Zap, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" },
  2: { label: "Water", icon: Droplets, color: "text-sky-500", bg: "bg-sky-50", border: "border-sky-100" },
  3: { label: "Furniture", icon: Sofa, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
  4: { label: "Cleanliness", icon: Sparkles, color: "text-teal-500", bg: "bg-teal-50", border: "border-teal-100" },
  5: { label: "Security", icon: Shield, color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100" },
  6: { label: "Noise", icon: Volume2, color: "text-pink-500", bg: "bg-pink-50", border: "border-pink-100" },
  7: { label: "Food", icon: UtensilsCrossed, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100" },
  8: { label: "Other", icon: HelpCircle, color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-100" },
};

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  dismissed: {
    label: "Dismissed",
    icon: AlertCircle,
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
};

const Home = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user_details } = useUser();
  const [payments, setPayments] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!getToken) return;
    setIsLoading(true);
    try {
      const token = await getToken();
      
      const [paymentRes, reportRes] = await Promise.all([
        FetchUserPaymentHistory(token),
        FetchUserReports(token),
      ]);

      if (paymentRes.success) {
        setPayments(Array.isArray(paymentRes.data) ? paymentRes.data : []);
      }
      if (reportRes.success) {
        setReports(Array.isArray(reportRes.data) ? reportRes.data : []);
      }
    } catch (err) {
      console.error("Dashboard load failed:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [getToken]);

  // ─── PAYMENT STATS ───
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalPayments = payments.length;

  // ─── REPORT STATS ───
  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status === "pending").length;
  const resolvedReports = reports.filter((r) => r.status === "resolved").length;
  const recentReports = reports.slice(0, 3);

  // ─── QUICK ACTIONS ───
  const quickActions = [
    {
      label: "New Payment",
      desc: "Pay hostel fees",
      icon: CreditCard,
      color: "from-indigo-600 to-violet-600",
      shadow: "shadow-indigo-500/25",
      hoverShadow: "hover:shadow-indigo-500/40",
      onClick: () => navigate("/payment"),
    },
    {
      label: "Report Issue",
      desc: "File a complaint",
      icon: ClipboardList,
      color: "from-rose-600 to-red-600",
      shadow: "shadow-rose-500/25",
      hoverShadow: "hover:shadow-rose-500/40",
      onClick: () => navigate("/report"),
    },
  ];

  const getStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${config.bg} ${config.text} ${config.border}`}>
        <span className={`w-1 h-1 rounded-full ${config.dot}`} />
        <Icon className="w-2.5 h-2.5" />
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-rose-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-[1200px] mx-auto">
      {/* ═══════ WELCOME HEADER ═══════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {user_details?.first_name || "User"}!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here is your hostel dashboard overview.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* ═══════ QUICK ACTIONS ═══════ */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`relative overflow-hidden rounded-2xl p-5 text-left
                bg-gradient-to-r ${action.color} text-white
                shadow-lg ${action.shadow} ${action.hoverShadow}
                hover:scale-[1.02] active:scale-[0.98]
                transition-all duration-200 group`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/60 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-lg font-bold">{action.label}</p>
                <p className="text-xs text-white/70 mt-0.5">{action.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ═══════ STATS OVERVIEW ═══════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Paid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform" />
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-2 shadow-lg shadow-indigo-500/20">
              <IndianRupee className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold text-slate-800">₹{totalPaid.toLocaleString("en-IN")}</p>
            <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">Total Paid</p>
          </div>
        </div>

        {/* Payments Made */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform" />
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-2 shadow-lg shadow-emerald-500/20">
              <Receipt className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold text-slate-800">{totalPayments}</p>
            <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">Payments</p>
          </div>
        </div>

        {/* Pending Reports */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform" />
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-2 shadow-lg shadow-amber-500/20">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold text-slate-800">{pendingReports}</p>
            <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">Pending Reports</p>
          </div>
        </div>

        {/* Resolved Reports */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform" />
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-2 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold text-slate-800">{resolvedReports}</p>
            <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">Resolved</p>
          </div>
        </div>
      </div>

      {/* ═══════ MAIN CONTENT GRID ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ─── LEFT: PAYMENTS (2/3) ─── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Payment Overview Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-indigo-600" />
                </div>
                <h2 className="text-base font-bold text-slate-800">Recent Payments</h2>
              </div>
              <button
                onClick={() => navigate("/payments")}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {payments.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <Receipt className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">No payments yet</p>
                <p className="text-xs text-slate-400 mt-1">Make your first payment to see it here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {payments.slice(0, 4).map((payment, index) => (
                  <div
                    key={payment.id || index}
                    className="flex items-center gap-4 p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 shadow-sm">
                      <Receipt className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {payment.payment_type === 1 ? "Mess Fee" : payment.payment_type === 2 ? "Additional Mess Fee" : "Fine"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {payment.month} {payment.year}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-800">₹{payment.amount?.toLocaleString("en-IN")}</p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full
                        ${payment.status === "verified" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : 
                          payment.status === "pending" ? "bg-amber-50 text-amber-700 border border-amber-100" : 
                          "bg-rose-50 text-rose-700 border border-rose-100"}`}>
                        {payment.status === "verified" ? <CheckCircle2 className="w-2.5 h-2.5" /> : 
                         payment.status === "pending" ? <Clock className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                        {payment.status || "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Trend Mini */}
          {payments.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-base font-bold text-slate-800">Payment Summary</h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <p className="text-2xl font-bold text-emerald-700">{payments.filter(p => p.status === "verified").length}</p>
                  <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider mt-1">Verified</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                  <p className="text-2xl font-bold text-amber-700">{payments.filter(p => p.status === "pending").length}</p>
                  <p className="text-[10px] text-amber-600 font-medium uppercase tracking-wider mt-1">Pending</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-rose-50/50 border border-rose-100">
                  <p className="text-2xl font-bold text-rose-700">{payments.filter(p => p.status === "rejected").length}</p>
                  <p className="text-[10px] text-rose-600 font-medium uppercase tracking-wider mt-1">Rejected</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── RIGHT: REPORTS (1/3) ─── */}
        <div className="space-y-4">
          {/* Recent Reports Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-rose-600" />
                </div>
                <h2 className="text-base font-bold text-slate-800">Recent Reports</h2>
              </div>
              <button
                onClick={() => navigate("/reports")}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {recentReports.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <ClipboardList className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">No reports yet</p>
                <p className="text-xs text-slate-400 mt-1">Report an issue to see it here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReports.map((report) => {
                  const typeConfig = REPORT_TYPE_MAP[report.report_type] || REPORT_TYPE_MAP[8];
                  const TypeIcon = typeConfig.icon;
                  return (
                    <div
                      key={report.id}
                      className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg ${typeConfig.bg} ${typeConfig.border} border flex items-center justify-center shrink-0`}>
                            <TypeIcon className={`w-3.5 h-3.5 ${typeConfig.color}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {typeConfig.label}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                              {report.comment || "—"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-50">
                        {getStatusBadge(report.status)}
                        <span className="text-[10px] text-slate-400">
                          {report.created_at
                            ? new Date(report.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Report Stats */}
          <div className="bg-gradient-to-br from-rose-600 to-red-700 rounded-2xl p-5 text-white shadow-lg shadow-rose-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-rose-200" />
              <h3 className="text-sm font-bold">Report Overview</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-rose-200">Total Reports</span>
                <span className="text-lg font-bold">{totalReports}</span>
              </div>
              <div className="h-px bg-white/20" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-rose-200">Pending</span>
                <span className="text-sm font-semibold">{pendingReports}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-rose-200">Resolved</span>
                <span className="text-sm font-semibold">{resolvedReports}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-rose-200">Dismissed</span>
                <span className="text-sm font-semibold">{reports.filter(r => r.status === "dismissed").length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;