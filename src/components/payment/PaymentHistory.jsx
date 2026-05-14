// components/payment/PaymentHistory.jsx
import React from 'react'
import { 
  Eye, 
  Pencil, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Receipt,
  Calendar,
  CreditCard,
  IndianRupee,
  Flag
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
    case 'flagged':
      return {
        color: 'text-orange-600 bg-orange-50 border-orange-200',
        icon: Flag,
        label: 'Flagged'
      }
    default:
      return {
        color: 'text-slate-600 bg-slate-50 border-slate-200',
        icon: Clock,
        label: status
      }
  }
}

const PaymentHistory = ({ payments, onView, onEdit, onDelete }) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Receipt className="w-5 h-5 text-indigo-600" />
        Payment History
      </h3>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-4 py-3.5 text-left font-semibold text-slate-600">Sl. No</th>
                <th className="px-4 py-3.5 text-left font-semibold text-slate-600">Amount</th>
                <th className="px-4 py-3.5 text-left font-semibold text-slate-600">UPI Transaction</th>
                <th className="px-4 py-3.5 text-left font-semibold text-slate-600">Date & Time</th>
                <th className="px-4 py-3.5 text-left font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3.5 text-right font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments?.map((payment, index) => {
                const statusConfig = getStatusConfig(payment.verification_status)
                const StatusIcon = statusConfig.icon
                
                return (
                  <tr 
                    key={payment.receipt_id} 
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-4 py-4 text-slate-500 font-medium">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {payment.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 font-mono text-xs bg-slate-100 px-2 py-1 rounded-lg w-fit">
                        <CreditCard className="w-3 h-3 text-slate-400" />
                        {payment.upi_transaction_no}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{payment.uploaded_on}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`
                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border
                        ${statusConfig.color}
                      `}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onView(payment.receipt_id)}
                          className="p-2 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {(payment.verification_status === 'pending' || payment.verification_status === 'flagged') && (
                          <button
                            onClick={() => onEdit(payment)}
                            className="p-2 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => onDelete(payment)}
                          className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {payments.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Receipt className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium">No payment history found</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {payments.map((payment, index) => {
          const statusConfig = getStatusConfig(payment.verification_status)
          const StatusIcon = statusConfig.icon
          
          return (
            <div
              key={payment.receipt_id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3"
            >
              {/* Header: SL & Status */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                  #{String(index + 1).padStart(2, '0')}
                </span>
                <span className={`
                  inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border
                  ${statusConfig.color}
                `}>
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.label}
                </span>
              </div>

              {/* Amount */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{payment.amount.toLocaleString()}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-xl p-2.5">
                  <p className="text-xs text-slate-400 mb-0.5">UPI Transaction</p>
                  <p className="font-mono text-slate-700 text-xs truncate">{payment.upi_transaction_no}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5">
                  <p className="text-xs text-slate-400 mb-0.5">Date & Time</p>
                  <p className="text-slate-700 text-xs">{payment.uploaded_on}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => onView(payment.receipt_id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Details
                </button>
                
                {payment.verification_status === 'pending' && (
                  <button
                    onClick={() => onEdit(payment)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                )}
                
                <button
                  onClick={() => onDelete(payment)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          )
        })}
        
        {payments.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-200">
            <Receipt className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium">No payment history found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentHistory