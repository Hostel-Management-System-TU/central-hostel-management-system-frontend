// components/payment/PaymentDetails.jsx
import React from 'react'
import { 
  X, 
  Receipt, 
  Calendar, 
  CreditCard, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  XCircle,
  User,
  FileImage,
  Download
} from 'lucide-react'

const getStatusConfig = (status) => {
  switch (status) {
    case 'pending':
      return {
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        icon: Clock,
        label: 'Pending'
      }
    case 'approved':
      return {
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        icon: CheckCircle2,
        label: 'Approved'
      }
    case 'rejected':
      return {
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: XCircle,
        label: 'Rejected'
      }
    default:
      return {
        color: 'text-slate-600 bg-slate-50 border-slate-200',
        icon: Clock,
        label: status
      }
  }
}

const PaymentDetails = ({ payment, onClose }) => {
  if (!payment) return null

  const statusConfig = getStatusConfig(payment.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className={`
        flex items-center gap-3 p-4 rounded-xl border
        ${statusConfig.color}
      `}>
        <StatusIcon className="w-6 h-6" />
        <div>
          <p className="text-sm font-semibold">Payment {statusConfig.label}</p>
          <p className="text-xs opacity-80">Transaction ID: {payment.upiTransactionNo}</p>
        </div>
      </div>

      {/* Amount Highlight */}
      <div className="text-center py-4">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Amount Paid</p>
        <p className="text-4xl font-bold text-slate-800 flex items-center justify-center gap-1">
          <IndianRupee className="w-8 h-8 text-indigo-600" />
          {payment.amount.toLocaleString()}
        </p>
        <p className="text-sm text-slate-500 mt-1 capitalize">
          {payment.paymentType === 'mess-fee' ? 'Mess Fee' : 'Additional Mess Fee'}
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
          <div className="flex items-center gap-2 mb-1.5">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Period</p>
          </div>
          <p className="text-sm font-semibold text-slate-800">{payment.month} {payment.year}</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
          <div className="flex items-center gap-2 mb-1.5">
            <CreditCard className="w-4 h-4 text-indigo-500" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">UPI Transaction</p>
          </div>
          <p className="text-sm font-mono font-semibold text-slate-800">{payment.upiTransactionNo}</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
          <div className="flex items-center gap-2 mb-1.5">
            <Clock className="w-4 h-4 text-indigo-500" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted On</p>
          </div>
          <p className="text-sm font-semibold text-slate-800">{payment.dateTime}</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
          <div className="flex items-center gap-2 mb-1.5">
            <User className="w-4 h-4 text-indigo-500" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment ID</p>
          </div>
          <p className="text-sm font-mono font-semibold text-slate-800">#{String(payment.id).padStart(6, '0')}</p>
        </div>
      </div>

      {/* Receipt Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileImage className="w-4 h-4 text-indigo-500" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Receipt</p>
          </div>
          <button className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
        </div>
        
        {/* Placeholder for backend image */}
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
          {payment.receiptUrl ? (
            <img 
              src={payment.receiptUrl} 
              alt="Payment Receipt" 
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center">
                <Receipt className="w-8 h-8 text-slate-300" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500">Receipt Image</p>
                <p className="text-xs text-slate-400 mt-0.5">Will be fetched from backend</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold
          hover:bg-slate-200 active:scale-[0.98] transition-all duration-200"
      >
        Close
      </button>
    </div>
  )
}

export default PaymentDetails