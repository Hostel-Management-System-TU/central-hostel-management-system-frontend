// components/report/ReportDetails.jsx
import React, { useEffect, useState } from 'react'
import { Clock, CheckCircle2, XCircle, AlertCircle, ImageOff } from 'lucide-react'
import { FetchReportDetails } from '../../services/Report/Report'
import { useAuth } from '@clerk/react'
import { getR2URL } from '../../services/ApiUrls'

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
    desc: 'Your report is under review by the admin team.',
  },
  resolved: {
    label: 'Resolved',
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    desc: 'This issue has been resolved successfully.',
  },
  dismissed: {
    label: 'Dismissed',
    icon: XCircle,
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    desc: 'This report was dismissed after review.',
  },
}

const ReportDetails = ({ report_id }) => {
  if (!report_id) return null
  const { getToken } = useAuth()
  const [report, setReport] = useState({})

  const statusConfig = STATUS_CONFIG[report.status] || STATUS_CONFIG.pending
  const StatusIcon = statusConfig.icon

    useEffect(() => {
      const fetchReportDetails = async () => {
        const token = await getToken();
        // Assuming you have a function to fetch payment details
        const result = await FetchReportDetails(token, report_id);
        if (result.success) {
          setReport(result.data);
        }
      };
  
      fetchReportDetails();
    }, [report_id]);

  return (
    <div className="space-y-5">
      {/* Status Banner */}
      <div className={`rounded-xl border ${statusConfig.bg} ${statusConfig.border} p-4`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-white/60 ${statusConfig.text}`}>
            <StatusIcon className="w-5 h-5" />
          </div>
          <div>
            <p className={`text-sm font-semibold ${statusConfig.text}`}>{statusConfig.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{statusConfig.desc}</p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Report Type</p>
          <p className="text-sm font-semibold text-slate-800">
            {REPORT_TYPE_MAP[report.report_type] || 'Unknown'}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Reported On</p>
          <p className="text-sm font-semibold text-slate-800">
            {report.reported_on ? new Date(report.reported_on).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }) : '-'}
          </p>
        </div>
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Comment</p>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {report.comment || '-'}
          </p>
        </div>
      </div>

{/* Supporting Image */}
<div className="space-y-2">
  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
    Supporting Image
  </p>

  {report.supporting_image_url ? (
    <div className="rounded-xl overflow-auto border border-slate-200 bg-slate-50 max-h-[300px]">
      <img
        src={getR2URL(report.supporting_image_url)}
        alt="Supporting evidence"
        className="min-w-full object-contain"
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />

      <div className="hidden h-48 items-center justify-center flex-col gap-2 text-slate-400">
        <ImageOff className="w-8 h-8" />
        <span className="text-xs">Failed to load image</span>
      </div>
    </div>
  ) : (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 flex flex-col items-center gap-2 text-slate-400">
      <ImageOff className="w-8 h-8" />
      <span className="text-xs">No image attached</span>
    </div>
  )}
</div>

      {/* Report ID Footer */}
      <div className="pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-400 text-center">
          Report ID: <span className="font-mono text-slate-500">{report.report_id}</span>
        </p>
      </div>
    </div>
  )
}

export default ReportDetails