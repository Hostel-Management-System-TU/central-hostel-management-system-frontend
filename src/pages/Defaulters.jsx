import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { 
  Search, 
  Download, 
  ChevronDown, 
  Users, 
  AlertCircle,
  Loader2,
  FileSpreadsheet,
  X
} from "lucide-react";
import { useAuth } from "@clerk/react";
import { FetchDefaulters } from "../services/Payment/Payment";
import ListLoader from "../components/loaders/ListLoader";



// ─── API ───────────────────────────────────────────────
const fetchDefaulters = async (token, period, paymentType, hostelId) => {
  const res = await FetchDefaulters(token, { 
    period, 
    payment_type: paymentType, 
    hostel_id: hostelId 
  });
  return res?.data ?? [];
};

const PERIODS = ["May_2026", "Apr_2026", "Mar_2026", "Feb_2026"];

// ─── Empty State ───────────────────────────────────────
const EmptyState = ({ searchQuery, onClear }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4">
    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
      <Users className="w-8 h-8 text-slate-300" />
    </div>
    <h3 className="text-base font-semibold text-slate-900 mb-1">
      {searchQuery ? "No matches found" : "No defaulters"}
    </h3>
    <p className="text-sm text-slate-500 text-center max-w-xs mb-4">
      {searchQuery 
        ? `No results for "${searchQuery}". Try a different search term.` 
        : "All students have paid for this period. Great job!"}
    </p>
    {searchQuery && (
      <button
        onClick={onClear}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
      >
        <X className="w-4 h-4" />
        Clear search
      </button>
    )}
  </div>
);

// ─── Error State ───────────────────────────────────────
const ErrorState = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4">
    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
      <AlertCircle className="w-8 h-8 text-red-400" />
    </div>
    <h3 className="text-base font-semibold text-slate-900 mb-1">Failed to load</h3>
    <p className="text-sm text-slate-500 text-center max-w-xs mb-4">
      Something went wrong while fetching defaulters.
    </p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition"
    >
      Try again
    </button>
  </div>
);

// ─── Mobile Card ───────────────────────────────────────
const MobileCard = ({ d, idx }) => (
  <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
    <div className="flex items-start justify-between">
      <div className="min-w-0">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          #{String(idx + 1).padStart(2, "0")}
        </span>
        <h3 className="text-[15px] font-semibold text-slate-900 mt-0.5 truncate">
          {d.name || "—"}
        </h3>
      </div>
      <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600">
        Unpaid
      </span>
    </div>

    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Roll</p>
        <p className="text-[13px] font-semibold text-slate-700 mt-0.5 uppercase truncate">
          {d.roll_number || "—"}
        </p>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Room</p>
        <p className="text-[13px] font-semibold text-slate-700 mt-0.5 truncate">
          {d.room_no || "—"}
        </p>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Phone</p>
        <p className="text-[13px] font-medium text-slate-600 mt-0.5 font-mono truncate">
          {d.phone || "—"}
        </p>
      </div>
    </div>
  </div>
);

// ─── Desktop Table ───────────────────────────────────
const DesktopTable = ({ data, loading, searchQuery, onClearSearch }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState searchQuery={searchQuery} onClear={onClearSearch} />;
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-slate-100">
          {["Sl No", "Name", "Roll No", "Room", "Phone"].map((h) => (
            <th
              key={h}
              className="text-left py-3.5 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((d, i) => (
          <tr
            key={d.user_id || i}
            className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/60 transition-colors"
          >
            <td className="py-4 px-6 text-sm font-medium text-slate-400 tabular-nums w-16">
              {String(i + 1).padStart(2, "0")}
            </td>
            <td className="py-4 px-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                  {(d.name || "?").charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {d.name || "Unknown"}
                </span>
              </div>
            </td>
            <td className="py-4 px-6 text-sm font-mono font-medium text-slate-600 uppercase">
              {d.roll_number || "—"}
            </td>
            <td className="py-4 px-6 text-sm font-medium text-slate-600">
              {d.room_no || "—"}
            </td>
            <td className="py-4 px-6 text-sm font-mono text-slate-500">
              {d.phone || "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// ─── Main Page ─────────────────────────────────────────
export default function DefaultersPage() {
  const [period, setPeriod] = useState("May_2026");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [periodOpen, setPeriodOpen] = useState(false);
  
  // Clerk auth — getToken is async, so we use sessionId as stable dep
  const { getToken } = useAuth();
  

  // ── Fetch Data ──
  const loadData = async () => {    
    setLoading(true);
    setError(null);
    
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }
      
      const result = await fetchDefaulters(token, period, 1, 1);
      const defaulters = Array.isArray(result) ? result : result?.data ?? result?.defaulters ?? [];
      setData(defaulters);
    } catch (err) {
      console.error("Fetch defaulters failed:", err);
      setError(err?.message || "Failed to load defaulters");
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  // ── Effect: Load on mount and when period changes ──
  useEffect(() => {
    loadData();
  }, [period]);

  
  // ── Filter ──
  const filtered = useMemo(() => {
    if (!searchQuery || !Array.isArray(data)) return data;
    const q = searchQuery.toLowerCase().trim();
    return data.filter((d) => {
      if (!d || typeof d !== "object") return false;
      return (
        (d.name || "").toLowerCase().includes(q) ||
        (d.roll_number || "").toLowerCase().includes(q) ||
        (d.room_no || "").toLowerCase().includes(q) ||
        (d.phone || "").includes(q)
      );
    });
  }, [data, searchQuery]);

  // ── Export CSV ──
  const handleDownload = useCallback(() => {
    const rows = filtered.map((d, i) => [
      i + 1,
      d.name || "",
      d.roll_number || "",
      d.room_no || "",
      d.phone || ""
    ]);
    const csv = [
      ["Sl No", "Name", "Roll No", "Room", "Phone"],
      ...rows
    ].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `defaulters_${period}_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [filtered, period]);

  const clearSearch = useCallback(() => setSearchQuery(""), []);

  const displayCount = Array.isArray(data) ? data.length : 0;
  const filteredCount = Array.isArray(filtered) ? filtered.length : 0;

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <div className="max-w-5xl mx-auto px-4 py-8 md:px-8 md:py-10">
        
        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Defaulters</h1>
          <p className="text-sm text-slate-500 mt-1">Students with pending payments</p>
        </div>

        {/* ── Top Bar: Stats + Controls ── */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          
          {/* Stat Pill */}
          <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-5 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] shrink-0">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <span className="text-base font-bold text-rose-600">{displayCount}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 leading-none">Defaulters</p>
              <p className="text-xs text-slate-400 mt-1">{period.replace("_", " ")}</p>
            </div>
          </div>

          <div className="flex-1" />

          {/* Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Period */}
            <div className="relative">
              <button
                onClick={() => setPeriodOpen(!periodOpen)}
                className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-slate-200/50"
              >
                {period.replace("_", " ")}
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${periodOpen ? "rotate-180" : ""}`} />
              </button>
              {periodOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setPeriodOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 z-20 overflow-hidden py-1">
                    {PERIODS.map((p) => (
                      <button
                        key={p}
                        onClick={() => { setPeriod(p); setPeriodOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition ${period === p ? "bg-slate-50 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
                      >
                        {p.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Export */}
            <button
              onClick={handleDownload}
              disabled={filteredCount === 0 || loading}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2.5 text-sm font-medium transition shadow-[0_1px_3px_rgba(0,0,0,0.1)] active:scale-[0.98]"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* ── Data Card ── */}
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-semibold text-slate-900">{period.replace("_", " ")}</h2>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {filteredCount}
              </span>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, roll, room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-56 pl-9 pr-9 py-2 bg-slate-50 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 transition"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>


          {/* ── Loading (non-error) ── */}
          {loading && !error && (
            <ListLoader comment={"Loading Defaulters..."} />
          )}

          {/* ── Mobile Cards ── */}
          {!loading && !error && (
            <div className="md:hidden p-4 space-y-3">
              {filtered.length === 0 ? (
                <EmptyState searchQuery={searchQuery} onClear={clearSearch} />
              ) : (
                filtered.map((d, i) => (
                  <MobileCard key={d?.user_id || i} d={d} idx={i} />
                ))
              )}
            </div>
          )}

          {/* ── Desktop Table ── */}
          {!loading && !error && (
            <div className="hidden md:block">
              <DesktopTable 
                data={filtered} 
                loading={loading} 
                searchQuery={searchQuery}
                onClearSearch={clearSearch}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}