// components/report/ReportHistory.jsx
import React from 'react'
import { Eye, Trash2, AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react'

const REPORT_TYPE_MAP = {
  1: 'Electricity',
  2: 'Water',
  3: 'Furniture',
  4: 'Cleanliness',
  5: 'Security',
  6: 'Noise',
  7: 'Food',
  8: 'Other',
}

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    icon: Clock,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  resolved: {
    label: 'Resolved',
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  dismissed: {
    label: 'Dismissed',
    icon: XCircle,
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  },
}

const ReportHistory = ({ reports, onView, onDelete }) => {
  const getStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    )
  }

  const truncateComment = (text, max = 50) => {
    if (!text) return '-'
    return text.length > max ? text.slice(0, max) + '...' : text
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">SL No.</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Report Type</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Comment</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">No reports found</p>
                      <p className="text-xs text-slate-400 mt-0.5">Click "Report Issue" to register a new complaint</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              reports.map((report, index) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors duration-150 group">
                  <td className="px-5 py-4 text-sm font-medium text-slate-700">#{index + 1}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium border border-rose-100">
                      {REPORT_TYPE_MAP[report.report_type] || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 max-w-xs">
                    <span className="line-clamp-1" title={report.comment}>
                      {truncateComment(report.comment)}
                    </span>
                  </td>
                  <td className="px-5 py-4">{getStatusBadge(report.report_status)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView(report.report_id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(report.report_id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-slate-100">
        {reports.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">No reports found</p>
                <p className="text-xs text-slate-400 mt-0.5">Click "Report Issue" to register a new complaint</p>
              </div>
            </div>
          </div>
        ) : (
          reports.map((report, index) => (
            <div key={report.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">#{index + 1}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-xs font-medium border border-rose-100">
                    {REPORT_TYPE_MAP[report.report_type] || 'Unknown'}
                  </span>
                </div>
                {getStatusBadge(report.status)}
              </div>

              <p className="text-sm text-slate-600 line-clamp-2" title={report.comment}>
                {truncateComment(report.comment, 80)}
              </p>

              <div className="flex items-center justify-end gap-1 pt-1">
                <button
                  onClick={() => onView(report.report_id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Details
                </button>
                <button
                  onClick={() => onDelete(report)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ReportHistory