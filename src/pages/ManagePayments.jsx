// pages/ManagePayments.jsx
import { useNavigate } from "react-router";
import {
  Upload,
  RefreshCw,
  Settings,
  Wallet,
  Receipt,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  IndianRupee,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import Modal from "../components/modal/Modal";
import { paymentCategories } from "../constants";

// ─── Mock Data for Charts & Stats ───
const verificationStats = {
  verified: 142,
  pending: 38,
  rejected: 12,
  flagged: 7,
  total: 199,
};

const monthlyData = [
  { month: "Jan", verified: 45, pending: 12, rejected: 3 },
  { month: "Feb", verified: 52, pending: 8, rejected: 2 },
  { month: "Mar", verified: 38, pending: 15, rejected: 5 },
  { month: "Apr", verified: 48, pending: 10, rejected: 4 },
  { month: "May", verified: 55, pending: 6, rejected: 1 },
  { month: "Jun", verified: 62, pending: 9, rejected: 3 },
];

const categoryBreakdown = [
  { name: "Mess Fee", amount: 184500, count: 142, color: "bg-indigo-500", percent: 65 },
  { name: "Additional Mess", amount: 68400, count: 38, color: "bg-violet-500", percent: 24 },
  { name: "Fines", amount: 31500, count: 19, color: "bg-rose-500", percent: 11 },
];

const ManagePayments = () => {
  const navigate = useNavigate();
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({ verified: 0, pending: 0, rejected: 0, flagged: 0 });

  // Animate stats on mount
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedStats({
        verified: Math.round(verificationStats.verified * progress),
        pending: Math.round(verificationStats.pending * progress),
        rejected: Math.round(verificationStats.rejected * progress),
        flagged: Math.round(verificationStats.flagged * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const handleVerifyPayments = async () => {
    setIsVerifying(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsVerifying(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-[1600px] mx-auto">
      {/* ═══════ HEADER ═══════ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wallet className="w-7 h-7 text-indigo-600" />
            Payment Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and verify hostel payments — {verificationStats.total} total transactions
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsBankModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              bg-white border border-slate-200 text-slate-700 text-sm font-semibold
              hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]
              transition-all duration-200 shadow-sm"
          >
            <Upload className="w-4 h-4 text-indigo-500" />
            Upload Bank Statement
          </button>

          <button
            onClick={handleVerifyPayments}
            disabled={isVerifying}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold
              hover:from-indigo-700 hover:to-violet-700 active:scale-[0.98]
              shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isVerifying ? "animate-spin" : ""}`} />
            {isVerifying ? "Verifying..." : "Start Verify Worker"}
          </button>
        </div>
      </div>

      {/* ═══════ VERIFICATION STATUS CARDS ═══════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Verified", value: animatedStats.verified, total: verificationStats.verified, icon: CheckCircle2, color: "emerald", trend: "+12%", trendUp: true },
          { label: "Pending", value: animatedStats.pending, total: verificationStats.pending, icon: Clock, color: "amber", trend: "+5%", trendUp: true },
          { label: "Rejected", value: animatedStats.rejected, total: verificationStats.rejected, icon: XCircle, color: "rose", trend: "-2%", trendUp: false },
          { label: "Flagged", value: animatedStats.flagged, total: verificationStats.flagged, icon: AlertTriangle, color: "orange", trend: "+1%", trendUp: true },
        ].map((stat) => {
          const Icon = stat.icon;
          const percent = Math.round((stat.value / verificationStats.total) * 100);
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm 
                relative overflow-hidden group hover:shadow-md hover:border-slate-300
                transition-all duration-300"
            >
              <div className={`absolute top-0 right-0 w-20 h-20 bg-${stat.color}-100 rounded-full 
                -translate-y-1/2 translate-x-1/2 opacity-40 group-hover:scale-110 transition-transform duration-500`} />

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                  <span className={`inline-flex items-center gap-0.5 text-xs font-semibold 
                    ${stat.trendUp ? "text-emerald-600" : "text-rose-600"}`}>
                    {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.trend}
                  </span>
                </div>

                <p className="text-2xl sm:text-3xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5 uppercase tracking-wider">{stat.label}</p>

                <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full bg-${stat.color}-500 transition-all duration-1000 ease-out`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{percent}% of total</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════ MAIN CONTENT GRID ═══════ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">

        {/* ─── LEFT COLUMN (2/3) ─── */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">

          {/* Payment Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {paymentCategories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/admin/payments/${cat.id}`)}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm 
                  relative overflow-hidden group cursor-pointer
                  hover:shadow-lg hover:border-indigo-200 hover:-translate-y-0.5
                  transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100 to-violet-100 
                  rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform duration-500" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 
                      flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <Receipt className="w-5 h-5 text-white" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 
                      group-hover:translate-x-0.5 transition-all" />
                  </div>

                  <p className="text-2xl sm:text-3xl font-bold text-slate-800">
                    ₹{(cat.count * 1000).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 uppercase tracking-wider">
                    {cat.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{cat.count} payments</p>
                </div>
              </div>
            ))}
          </div>

          {/* Monthly Trend Chart (CSS Bar Chart) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-500" />
                  Monthly Verification Trends
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Payment verification status over last 6 months</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Verified
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Rejected
                </span>
              </div>
            </div>

            <div className="flex items-end justify-between gap-2 h-48 sm:h-56 px-2">
              {monthlyData.map((data) => {
                const maxVal = Math.max(...monthlyData.map((d) => d.verified + d.pending + d.rejected));
                const total = data.verified + data.pending + data.rejected;
                const vH = (data.verified / maxVal) * 100;
                const pH = (data.pending / maxVal) * 100;
                const rH = (data.rejected / maxVal) * 100;

                return (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <span className="text-[10px] font-semibold text-slate-600 opacity-0 group-hover:opacity-100 
                      transition-opacity -mb-1">
                      {total}
                    </span>
                    <div className="w-full max-w-[40px] flex flex-col-reverse rounded-lg overflow-hidden 
                      bg-slate-50 h-full relative">
                      <div className="bg-rose-400 transition-all duration-700" style={{ height: `${rH}%` }} />
                      <div className="bg-amber-400 transition-all duration-700" style={{ height: `${pH}%` }} />
                      <div className="bg-emerald-400 transition-all duration-700" style={{ height: `${vH}%` }} />
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 mt-1">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN (1/3) ─── */}
        <div className="space-y-4 sm:space-y-6">

          {/* Category Breakdown (Donut-style) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
              <PieChart className="w-4 h-4 text-indigo-500" />
              Category Breakdown
            </h3>

            {/* Donut Chart using conic-gradient */}
            <div className="flex justify-center mb-5">
              <div className="relative w-40 h-40">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: `conic-gradient(
                      #6366f1 0deg ${65 * 3.6}deg,
                      #8b5cf6 ${65 * 3.6}deg ${(65 + 24) * 3.6}deg,
                      #f43f5e ${(65 + 24) * 3.6}deg 360deg
                    )`,
                  }}
                />
                <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">
                  <IndianRupee className="w-4 h-4 text-slate-400 mb-0.5" />
                  <p className="text-lg font-bold text-slate-800">₹2.84L</p>
                  <p className="text-[10px] text-slate-500">Total Collected</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {categoryBreakdown.map((cat) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${cat.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-700 truncate">{cat.name}</p>
                      <p className="text-sm font-bold text-slate-800">₹{cat.amount.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-[10px] text-slate-400">{cat.count} payments</p>
                      <p className="text-[10px] font-medium text-slate-500">{cat.percent}%</p>
                    </div>
                    <div className="mt-1.5 w-full bg-slate-100 rounded-full h-1">
                      <div className={`h-1 rounded-full ${cat.color} transition-all duration-700`} 
                        style={{ width: `${cat.percent}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-4 sm:p-5 text-white shadow-lg shadow-indigo-500/20">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              This Month Overview
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">₹84,500</p>
                  <p className="text-xs text-indigo-200">Total Revenue</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                  <TrendingUp className="w-5 h-5 text-emerald-300" />
                </div>
              </div>

              <div className="h-px bg-white/20" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">142</p>
                  <p className="text-xs text-indigo-200">Verified Payments</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                </div>
              </div>

              <div className="h-px bg-white/20" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">38</p>
                  <p className="text-xs text-indigo-200">Pending Review</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                  <Clock className="w-5 h-5 text-amber-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Update Bank Address Action Card */}
          <button
            onClick={() => setIsBankModalOpen(true)}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 
              shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center 
              group-hover:bg-indigo-100 transition-colors">
              <Settings className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">Update Bank Address</p>
              <p className="text-xs text-slate-500">Configure UPI payment details</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 
              group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      </div>

      {/* ═══════ MODAL ═══════ */}
      <Modal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        title="Bank Payment Settings"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-sm font-medium text-slate-700 mb-1">Current UPI ID</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono text-slate-600">hostel@upi</p>
              <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700">Copy</button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Update UPI ID</label>
            <input
              type="text"
              placeholder="Enter new UPI ID"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300
                transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Account Holder Name</label>
            <input
              type="text"
              placeholder="Enter account holder name"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300
                transition-all"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => setIsBankModalOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium 
                text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsBankModalOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium 
                hover:bg-indigo-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManagePayments;
