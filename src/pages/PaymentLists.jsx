// pages/PaymentList.jsx
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
  Receipt,
  Calendar,
  User,
  Hash,
  IndianRupee,
  MoreHorizontal,
  Filter,
  Eye,
  FileSpreadsheet,
} from "lucide-react";
import { useAuth } from "@clerk/react";
import { useUser } from "../context/user_context";
import { FetchPaymentList } from "../services/Payment/Payment";
import Modal from "../components/modal/Modal";
import Payment from "./Payment";
import PaymentDetails from "../components/payment/PaymentDetails";
import { ChangePaymentStatus } from "../services/Verification/Verification";
import { toast } from "sonner";

// ─── API Service (replace with your actual import) ───
// import { FetchPaymentList } from "../services/Payment/Payment";

const ITEMS_PER_PAGE = 10;

const PaymentList = () => {
  const { payment_type } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user_details } = useUser();

  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("May_2026");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingPayment, setViewingPayment] = useState(null);
  const [selectedVerificationStatus, setSelectedVerificationStatus] =
    useState(null);
  const [verificationRemarks, setVerificationRemarks] = useState(null);

  // Generate months dynamically
  const generateMonths = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleString("default", { month: "long" });
      const year = d.getFullYear();
      months.push(`${monthName}_${year}`);
    }
    return months;
  };

  const availableMonths = generateMonths();

  // Stats
  const stats = {
    approved: payments.filter((p) => p.verification_status === "approved")
      .length,
    rejected: payments.filter((p) => p.verification_status === "rejected")
      .length,
    pending: payments.filter((p) => p.verification_status === "pending").length,
    flagged: payments.filter((p) => p.verification_status === "flagged").length,
  };

  // Fetch payments
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const token = await getToken();

      const res = await FetchPaymentList(token, {
        period: selectedMonth,
        payment_type: Number(payment_type),
        hostel_id: user_details?.hostel_id,
      });

      if (res.success) {
        // ✅ ALWAYS ensure array
        setPayments(Array.isArray(res.data) ? res.data : []);
      } else {
        setPayments([]); // fallback
      }
    } catch (err) {
      console.error("Failed to fetch payments:", err);
      setPayments([]); // ✅ important
    } finally {
      setLoading(false);
    }
  };

  // Filter & search
  useEffect(() => {
    let filtered = [...payments];

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.verification_status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.roll_number.toLowerCase().includes(q) ||
          p.upi_transaction_no.toLowerCase().includes(q),
      );
    }

    setFilteredPayments(filtered);
    setCurrentPage(1);
  }, [payments, statusFilter, searchQuery]);

  useEffect(() => {
    fetchPayments();
  }, [selectedMonth, payment_type]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPayments();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleDetails = (payment) => {
    setViewingPayment(payment.receipt_id);
    setSelectedVerificationStatus(payment.verification_status);
    setIsModalOpen(true);
  };

  const handleDetailsClose = () => {
    setViewingPayment(null);
    setSelectedVerificationStatus(null);
    setIsModalOpen(false);
  };

  const handleChangeStatus = (newStatus) => {
    setSelectedVerificationStatus(newStatus);
  };

  const handleUpdate = async () => {
    const payload = {
      receipt_id: viewingPayment,
      status: selectedVerificationStatus,
    };

    if (verificationRemarks) {
      payload.remarks = verificationRemarks;
    }

    try {
      const token = await getToken();

      const res = await ChangePaymentStatus(token, payload);

      if (res.success) {
        setIsModalOpen(false)
        handleRefresh()
        toast.success("Successfully Updated!")
      } else {
        toast.error("Something Went Wrong!")
      }
    } catch (err) {
      toast.error("Something Went Wrong!")
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const getStatusConfig = (status) => {
    const configs = {
      approved: {
        icon: CheckCircle2,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        label: "Approved",
        dot: "bg-emerald-500",
      },
      pending: {
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        label: "Pending",
        dot: "bg-amber-500",
      },
      rejected: {
        icon: XCircle,
        color: "text-rose-600",
        bg: "bg-rose-50",
        border: "border-rose-200",
        label: "Rejected",
        dot: "bg-rose-500",
      },
      flagged: {
        icon: AlertTriangle,
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
        label: "Flagged",
        dot: "bg-orange-500",
      },
    };
    return configs[status] || configs.pending;
  };

  const getCategoryName = (type) => {
    const names = { 1: "Mess Fee", 2: "Additional Mess Fee", 3: "Fines" };
    return names[type] || "Payments";
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = useCallback(() => {
    const rows = filteredPayments.map((d, i) => [
      i + 1,
      d.name || "",
      d.roll_number || "",
      d.amount || "",
      d.upi_transaction_no || "",
      d.verification_status || "",
      d.uploaded_on || ""
    ]);
    const csv = [
      ["Sl No", "Name", "Roll No", "Amount", "Transaction No.", "Status", "Uploaded On"],
      ...rows
    ].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Fee_${selectedMonth}_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [filteredPayments]);

  return (
    <div className="space-y-5 animate-in fade-in duration-300 max-w-[1400px] mx-auto">
      {/* ═══════ HEADER ═══════ */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/payments")}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-indigo-600" />
            {getCategoryName(payment_type)}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {payments.length} payments • {selectedMonth.replace("_", " ")}
          </p>
        </div>
      </div>

      {/* ═══════ STATS CARDS ═══════ */}
      {/* Desktop: 4 cards in a row | Mobile: 2x2 grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Approved",
            value: stats.approved,
            icon: CheckCircle2,
            color: "emerald",
          },
          {
            label: "Rejected",
            value: stats.rejected,
            icon: XCircle,
            color: "rose",
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "amber",
          },
          {
            label: "Flagged",
            value: stats.flagged,
            icon: AlertTriangle,
            color: "orange",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm 
                hover:shadow-md hover:border-slate-300 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-${stat.color}-100 flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════ FILTERS BAR ═══════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Month Dropdown */}
        <div className="relative">
          <div className="flex flex-wrap space-x-2">
            <button
              onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 
              text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
            >
              <Calendar className="w-4 h-4 text-indigo-500" />
              {selectedMonth.replace("_", " ")}
              {isMonthDropdownOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
            <button
              onClick={handleDownload}
              // disabled={filteredCount === 0 || loading}
              className="flex items-center gap-2 bg-red-900 hover:bg-red-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export
            </button>
          </div>

          {isMonthDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsMonthDropdownOpen(false)}
              />
              <div
                className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl border border-slate-200 
                shadow-lg z-40 max-h-60 overflow-y-auto py-1"
              >
                {availableMonths.map((month) => (
                  <button
                    key={month}
                    onClick={() => {
                      setSelectedMonth(month);
                      setIsMonthDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors
                      ${selectedMonth === month ? "text-indigo-600 font-medium bg-indigo-50" : "text-slate-700"}`}
                  >
                    {month.replace("_", " ")}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Status Filter + Refresh */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["all", "pending", "approved", "rejected", "flagged"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-2 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition-all
                ${statusFilter === filter
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
              >
                {filter === "approved" ? "Approved" : filter}
              </button>
            ),
          )}

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 
              hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* ═══════ TABLE / CARDS ═══════ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header with Search */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800">
              {selectedMonth.replace("_", " ")}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
              {filteredPayments.length}
            </span>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, roll no, UPI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 w-full sm:w-64
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300
                transition-all"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-12">
                  Sl
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Roll No
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <RefreshCw className="w-6 h-6 text-slate-300 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-slate-500">
                      Loading payments...
                    </p>
                  </td>
                </tr>
              ) : paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No payments found</p>
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((payment, idx) => {
                  const status = getStatusConfig(payment.verification_status);
                  const StatusIcon = status.icon;
                  const globalIndex =
                    (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;

                  return (
                    <tr
                      key={payment.receipt_id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      <td className="px-4 py-3.5 text-sm text-slate-500 font-medium">
                        {globalIndex}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 
                            flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0"
                          >
                            {payment.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-slate-800">
                            {payment.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {payment.roll_number}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-bold text-slate-800">
                          ₹{payment.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-mono text-slate-500">
                          {payment.upi_transaction_no}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">
                        {formatDate(payment.uploaded_on)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium 
                          ${status.bg} ${status.color} ${status.border} border`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleDetails(payment)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Eye className="w-4 h-4 text-grey-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-6 h-6 text-slate-300 animate-spin mx-auto mb-2" />
              <p className="text-sm text-slate-500">Loading payments...</p>
            </div>
          ) : paginatedPayments.length === 0 ? (
            <div className="p-8 text-center">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No payments found</p>
            </div>
          ) : (
            paginatedPayments.map((payment, idx) => {
              const status = getStatusConfig(payment.verification_status);
              const StatusIcon = status.icon;
              const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;

              return (
                <div
                  key={payment.receipt_id}
                  className="p-4 hover:bg-slate-50/60 transition-colors"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 
                        flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0"
                      >
                        {payment.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {payment.name}
                        </p>
                        <p className="text-xs font-mono text-slate-500">
                          {payment.roll_number}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium 
                      ${status.bg} ${status.color} ${status.border} border`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 rounded-lg p-2.5">
                      <p className="text-slate-400 mb-0.5 flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" /> Amount
                      </p>
                      <p className="font-bold text-slate-800 text-sm">
                        ₹{payment.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5">
                      <p className="text-slate-400 mb-0.5 flex items-center gap-1">
                        <Hash className="w-3 h-3" /> Transaction
                      </p>
                      <p className="font-mono text-slate-600 truncate">
                        {payment.upi_transaction_no}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5 col-span-2">
                      <p className="text-slate-400 mb-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Date & Time
                      </p>
                      <p className="text-slate-600">
                        {formatDate(payment.uploaded_on)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleDetails(payment)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Details
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredPayments.length)}{" "}
              of {filteredPayments.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4 text-slate-600" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all
                    ${currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleDetailsClose}
        title="Payment Details"
      >
        <div className="flex flex-col gap-5">
          {/* ─── CHANGE STATUS ─── */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Change Status
            </label>
            <div className="relative">
              <select
                name="status"
                value={selectedVerificationStatus || ""}
                onChange={(e) => handleChangeStatus(e.target.value)}
                className="w-full appearance-none border border-slate-300 rounded-lg pl-4 pr-10 py-2.5 bg-white text-slate-700 font-medium shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition cursor-pointer hover:border-slate-400"
              >
                <option value="pending">⏳ Pending</option>
                <option value="approved">✅ Approved</option>
                <option value="rejected">❌ Rejected</option>
                <option value="flagged">🚩 Flagged</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* ─── REMARKS (Conditional) ─── */}
          {(selectedVerificationStatus === "rejected" ||
            selectedVerificationStatus === "flagged") && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={verificationRemarks}
                  onChange={(e) => setVerificationRemarks(e.target.value)}
                  rows={3}
                  placeholder="Enter remarks..."
                  className="w-full border border-slate-300 rounded-lg p-3 bg-white text-slate-700 text-sm placeholder-slate-400 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none hover:border-slate-400"
                />
              </div>
            )}

          {/* ─── BUTTONS: Update | Delete ─── */}
          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm hover:shadow"
            >
              Update
            </button>

            <button
              // onClick={handleDelete}
              className="flex-1 bg-white border border-slate-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm hover:shadow"
            >
              Delete
            </button>
          </div>

          <PaymentDetails payment_id={viewingPayment} />
        </div>
      </Modal>
    </div>
  );
};

export default PaymentList;
