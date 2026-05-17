// pages/Report.jsx
import React, { useEffect, useState } from 'react'
import { Plus, ClipboardList, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import Modal from '../components/modal/Modal'
import ReportForm from '../components/report/ReportForm'
import ReportHistory from '../components/report/ReportHistory'
import ReportDetails from '../components/report/ReportDetails'
import { useAuth } from '@clerk/react'
import { useUser } from '../context/user_context'
import { FetchUserReports, RegisterReport } from '../services/Report/Report'

const Report = () => {
  const { getToken } = useAuth()
  const { user_details } = useUser()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [reports, setReports] = useState([])
  const [viewingReport, setViewingReport] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Stats
  const totalReports = reports?.length || 0
  const pendingCount = reports?.filter(r => r.report_status === 'pending').length || 0
  const resolvedCount = reports?.filter(r => r.report_status === 'resolved').length || 0

  const fetchReports = async () => {
    const token = await getToken()
    const res = await FetchUserReports(token)
    if (!res.success) {
      alert(res.error)
      return
    }
    setReports(Array.isArray(res.data) ? res.data : [])
  }

  const handleSubmitReport = async (reportData) => {
    setIsSubmitting(true)
    const token = await getToken()
    const payload = new FormData()

    payload.append('report_type', Number(reportData.reportType))
    payload.append('comment', reportData.comment)
    payload.append('hostel_id', Number(user_details.hostel_id))
    if (reportData.supportingImage) {
      payload.append('supporting_image', reportData.supportingImage)
    }

    const result = await RegisterReport(token, payload)
    if (!result.success) {
      setIsSubmitting(false)
      alert(result.error)
      return
    }
    await fetchReports()
    setIsSubmitting(false)
    setIsModalOpen(false)
  }

  const handleDelete = async (report) => {
    // if (!window.confirm('Are you sure you want to delete this report?')) return
    
    // const token = await getToken()
    // const res = await DeleteReport(token, report.id)
    // if (!res.success) {
    //   alert(res.error)
    //   return
    // }
    // setReports(prev => prev.filter(r => r.id !== report.id))
  }

  const handleView = (report_id) => {
    setViewingReport(report_id)
    setIsDetailsOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)
  const closeDetails = () => {
    setIsDetailsOpen(false)
    setViewingReport(null)
  }

  useEffect(() => {
    const loadReports = async () => {
      try {
        if (!getToken) return
        await fetchReports()
      } catch (err) {
        console.error('Failed to fetch reports:', err)
      }
    }
    loadReports()
  }, [getToken])

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-rose-600" />
            Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">Register and track hostel issues</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
            bg-gradient-to-r from-rose-600 to-red-600 text-white text-sm font-semibold
            hover:from-rose-700 hover:to-red-700 active:scale-[0.98]
            shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40
            transition-all duration-200 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Report Issue
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-rose-100 to-red-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform duration-300" />
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center mb-2 shadow-lg shadow-rose-500/20">
              <ClipboardList className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{totalReports}</p>
            <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Total</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform duration-300" />
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-2 shadow-lg shadow-amber-500/20">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{pendingCount}</p>
            <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Pending</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform duration-300" />
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-2 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{resolvedCount}</p>
            <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Resolved</p>
          </div>
        </div>
      </div>

      {/* History Section */}
      <ReportHistory
        reports={reports}
        onView={handleView}
        onDelete={handleDelete}
      />

      {/* Report Issue Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Report an Issue"
        maxWidth="max-w-md"
      >
        <ReportForm
          onSubmit={handleSubmitReport}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={closeDetails}
        title="Report Details"
        maxWidth="max-w-lg"
      >
        <ReportDetails report_id={viewingReport} />
      </Modal>
    </div>
  )
}

export default Report