// pages/ManageReports.jsx
import { useState, useEffect } from "react";
import {
    ClipboardList,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Clock,
    RotateCcw,
    Eye,
    Filter,
    AlertCircle,
    Image as ImageIcon,
    Download,        // ← ADD
    ChevronDown,     // ← ADD
} from "lucide-react";

import { useAuth } from "@clerk/react";
import { useUser } from "../context/user_context";
import Modal from "../components/modal/Modal";
import { toast } from "sonner";
import { FetchReportsList, UpdateStatus } from "../services/Report/Report";
import { getR2URL } from "../services/ApiUrls";
import ListLoader from "../components/loaders/ListLoader";

const REPORT_TYPE_MAP = {
    1: "Electricity",
    2: "Water",
    3: "Furniture",
    4: "Cleanliness",
    5: "Security",
    6: "Noise",
    7: "Food",
    8: "Other",
};

const STATUS_TABS = [
    { key: "pending", label: "Pending", color: "rose" },
    { key: "resolved", label: "Resolved", color: "emerald" },
    { key: "dismissed", label: "Dismissed", color: "slate" },
    { key: "all", label: "All", color: "indigo" },
];

const STATUS_CONFIG = {
    pending: {
        label: "PENDING",
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        dot: "bg-amber-500",
        icon: Clock,
    },
    resolved: {
        label: "RESOLVED",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
        icon: CheckCircle2,
    },
    dismissed: {
        label: "DISMISSED",
        bg: "bg-slate-50",
        text: "text-slate-600",
        border: "border-slate-200",
        dot: "bg-slate-400",
        icon: XCircle,
    },
};

const REPORT_TYPES = [
    { value: 1, label: "Electricity" },
    { value: 2, label: "Water" },
    { value: 3, label: "Furniture" },
    { value: 4, label: "Cleanliness" },
    { value: 5, label: "Security" },
    { value: 6, label: "Noise" },
    { value: 7, label: "Food" },
    { value: 8, label: "Other" },
];

const ManageReports = () => {
    const { getToken } = useAuth();
    const { user_details } = useUser();
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [activeTab, setActiveTab] = useState("pending");
    const [isLoading, setIsLoading] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [typeFilter, setTypeFilter] = useState(1)

    const fetchReports = async () => {
        if (!user_details?.hostel_id) return;
        setIsLoading(true);
        const token = await getToken();
        const payload = {
            hostel_id: Number(user_details.hostel_id),
            report_type: Number(typeFilter)
        }
        const res = await FetchReportsList(token, payload);
        if (!res.success) {
          toast.error(res.error);
          setIsLoading(false);
          return;
        }
        setReports(Array.isArray(res.data) ? res.data : []);
        setIsLoading(false);
    };

      useEffect(() => {
        if (activeTab === "all") {
          setFilteredReports(reports);
        } else {
          setFilteredReports(reports.filter((r) => r.report_status === activeTab));
        }
      }, [activeTab, reports]);

      useEffect(() => {
        if (user_details?.hostel_id) {
          fetchReports();
        }
      }, [user_details, typeFilter]);

    const handleStatusUpdate = async (reportId, newStatus) => {
        setIsUpdating(true);
        const token = await getToken();
        const payload = {
            report_id: reportId,
            report_status: newStatus
        }
        const res = await UpdateStatus(token, payload);
        if (!res.success) {
          toast.error(res.error);
          setIsUpdating(false);
          return;
        }
        toast.success(`Report marked as ${newStatus}`);
        await fetchReports();
        setIsUpdating(false);
    };

    const handleViewImage = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsImageModalOpen(true);
    };

    const getStatusBadge = (status) => {
        const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
        const Icon = config.icon;
        return (
            <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.bg} ${config.text} ${config.border}`}
            >
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                <Icon className="w-3 h-3" />
                {config.label}
            </span>
        );
    };

    const stats = {
        pending: reports.filter((r) => r.report_status === "pending").length,
        resolved: reports.filter((r) => r.report_status === "resolved").length,
        dismissed: reports.filter((r) => r.report_status === "dismissed").length,
        total: reports.length,
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1200px] mx-auto">
            {/* ═══════ HEADER ═══════ */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <ClipboardList className="w-7 h-7 text-rose-600" />
                        Report Management
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Review and resolve user-reported issues.
                    </p>
                </div>

                <button
                    onClick={fetchReports}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
            bg-white border border-slate-200 text-slate-700 text-sm font-semibold
            hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]
            transition-all duration-200 shadow-sm disabled:opacity-50"
                >
                    <RefreshCw
                        className={`w-4 h-4 text-slate-500 ${isLoading ? "animate-spin" : ""}`}
                    />
                    Refresh
                </button>
            </div>

            {/* ═══════ FILTERS + DOWNLOAD ═══════ */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Status Tabs */}
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                        {STATUS_TABS.map((tab) => {
                            const isActive = activeTab === tab.key;
                            const count =
                                tab.key === "all"
                                    ? reports.length
                                    : reports.filter((r) => r.report_status === tab.key).length;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
              ${isActive
                                            ? "bg-white text-rose-600 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    {tab.label}
                                    <span
                                        className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-md font-bold
              ${isActive
                                                ? "bg-rose-100 text-rose-700"
                                                : "bg-slate-200 text-slate-500"
                                            }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Type Dropdown */}
                    <div className="relative">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 
          bg-white text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 
          focus:ring-rose-500/20 focus:border-rose-400 transition-all duration-200
          cursor-pointer"
                        >
                            {REPORT_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Download Button */}
                <button
                    // onClick={downloadExcel}
                    // disabled={filteredReports.length === 0}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
      bg-white border border-slate-200 text-slate-700 text-sm font-semibold
      hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700
      active:scale-[0.98] transition-all duration-200 shadow-sm
      disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Download className="w-4 h-4" />
                    Export Excel
                </button>
            </div>

            {/* ═══════ REPORT CARDS ═══════ */}
            <div className="space-y-4">
                {isLoading ? (
                    <ListLoader comment={"Loading Reports..."} />
                ) : filteredReports.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 shadow-sm text-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                                <Filter className="w-7 h-7 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-base font-semibold text-slate-600">
                                    No {activeTab !== "all" ? activeTab : ""} reports found
                                </p>
                                <p className="text-sm text-slate-400 mt-1">
                                    {activeTab === "pending"
                                        ? "Great! All reports have been handled."
                                        : "Switch to another tab to see reports."}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    filteredReports.map((report) => (
                        <div
                            key={report.report_id}
                            className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm 
                hover:shadow-md hover:border-slate-300 transition-all duration-300"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                                {/* LEFT: Report Info */}
                                <div className="flex-1 min-w-0 space-y-4">
                                    {/* Top Row: Status + Type + Date */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        {getStatusBadge(report.report_status)}
                                         <span
                                            className="inline-flex items-center px-2.5 py-1 rounded-lg 
                        bg-rose-50 text-rose-700 text-xs font-medium border border-rose-100"
                                        >
                                            {report.room_no}
                                        </span>
                                        
                                        <span className="text-xs text-slate-400 ml-auto">
                                            {report.reported_on
                                                ? new Date(report.reported_on).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    }
                                                )
                                                : "—"}
                                        </span>
                                    </div>

                                    {/* User Info */}
                                    <div>
                                        <h3 className="text-base font-bold text-rose-700">
                                            {report.name}
                                        </h3>
                                        {report.phone && (
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {report.phone}
                                            </p>
                                        )}
                                    </div>

                                    {/* Comment */}
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                            {report.comment || "—"}
                                        </p>
                                    </div>

                                    {/* View Image Button (Conditional) */}
                                    {report.supporting_image_url && (
                                        <button
                                            onClick={() => handleViewImage(report.supporting_image_url)}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                        bg-indigo-50 text-indigo-700 text-sm font-medium
                        border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200
                        transition-all duration-200"
                                        >
                                            <ImageIcon className="w-4 h-4" />
                                            View Image
                                        </button>
                                    )}
                                </div>

                                {/* RIGHT: Actions */}
                                <div className="flex lg:flex-col items-center lg:items-stretch gap-2 lg:w-40 shrink-0">
                                    {report.report_status === "pending" ? (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleStatusUpdate(report.report_id, "resolved")
                                                }
                                                disabled={isUpdating}
                                                className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 
                          px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold
                          hover:bg-emerald-700 active:scale-[0.98] shadow-lg shadow-emerald-500/20
                          transition-all duration-200 disabled:opacity-50"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                Resolve
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleStatusUpdate(report.report_id, "dismissed")
                                                }
                                                disabled={isUpdating}
                                                className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 
                          px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 
                          text-sm font-semibold hover:bg-slate-50 hover:border-slate-300
                          active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Dismiss
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleStatusUpdate(report.report_id, "pending")}
                                            disabled={isUpdating}
                                            className="w-full inline-flex items-center justify-center gap-2 
                        px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 
                        text-sm font-semibold hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700
                        active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Reopen
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ═══════ IMAGE MODAL ═══════ */}
            <Modal
                isOpen={isImageModalOpen}
                onClose={() => {
                    setIsImageModalOpen(false);
                    setSelectedImage(null);
                }}
                title="Supporting Image"
                maxWidth="max-w-3xl"
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="w-full max-h-[70vh] overflow-auto rounded-xl border border-slate-200 bg-slate-50">
                        {selectedImage ? (
                            <img
                                src={getR2URL(selectedImage)}
                                alt="Supporting evidence"
                                className="w-full h-auto object-contain"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                }}
                            />
                        ) : null}
                        <div className="hidden h-64 items-center justify-center flex-col gap-3 text-slate-400">
                            <AlertCircle className="w-10 h-10" />
                            <span className="text-sm">Failed to load image</span>
                        </div>
                    </div>
                    <a
                        href={getR2URL(selectedImage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
              bg-indigo-600 text-white text-sm font-semibold
              hover:bg-indigo-700 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        Open in New Tab
                    </a>
                </div>
            </Modal>
        </div>
    );
};

export default ManageReports;