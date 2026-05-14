// pages/Payment.jsx
import React, { useEffect, useState } from 'react'
import { Plus, Receipt, Wallet, CreditCard } from 'lucide-react'
import Modal from '../components/modal/Modal'
import PaymentForm from '../components/payment/PaymentForm'
import PaymentHistory from '../components/payment/PaymentHistory'
import PaymentDetails from '../components/payment/PaymentDetails'
import { useAuth } from '@clerk/react'
import { useUser } from '../context/user_context'
import { FetchUserPaymentHistory, UploadPaymentDetails } from '../services/Payment/Payment'

const Payment = () => {
  const { getToken } = useAuth()
  const {user_details} = useUser()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [payments, setPayments] = useState([])
  const [editingPayment, setEditingPayment] = useState(null)
  const [viewingPayment, setViewingPayment] = useState(null)
  const [isSubmitting,setIsSubmitting] = useState(false)

  // Stats calculations
  const totalPaid = payments? payments.reduce((sum, p) => sum + p.amount, 0): 0
  const totalPayments = payments? payments.length : 0

  const fetchPaymentHistory = async () => {
    const token = await getToken()
    const res = await FetchUserPaymentHistory(token)
    if (!res.success){
      alert(res.error); // or toast
      return;
    }
  setPayments(Array.isArray(res.data) ? res.data : [])  }

  const handleAddPayment = async (paymentData) => {
    setIsSubmitting(true)
    const token = await getToken()
    const payload = new FormData()

    payload.append("month",paymentData.month)
    payload.append("year",paymentData.year)
    payload.append("payment_type",Number(paymentData.paymentType))
    payload.append("description",paymentData.description)
    payload.append("hostel_id",Number(user_details.hostel_id))
    payload.append("amount",paymentData.amount)
    payload.append("upi_transaction_no",paymentData.upiTransactionNo)
    payload.append("receipt",paymentData.receipt)
    const result = await UploadPaymentDetails(token, payload);
    
    if (!result.success) {
      setIsSubmitting(false)
            alert(result.error);
            return;
    }
    await fetchPaymentHistory()
    setIsSubmitting(false)
    setIsModalOpen(false)
    setEditingPayment(null)
  }

  const handleEdit = (payment) => {
    setEditingPayment(payment)
    setIsModalOpen(true)
  }

  const handleDelete = (payment) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      setPayments(prev => prev.filter(p => p.id !== payment.id))
    }
  }

  const handleView = (payment_id) => {
    setViewingPayment(payment_id)
    setIsDetailsOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingPayment(null)
  }

  const closeDetails = () => {
    setIsDetailsOpen(false)
    setViewingPayment(null)
  }

useEffect(() => {
  const loadPayments = async () => {
    try {
      if (!getToken) return; // safety check
      await fetchPaymentHistory();
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    }
  };

  loadPayments();
}, [getToken]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wallet className="w-7 h-7 text-indigo-600" />
            Payments
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage your hostel fee payments</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
            bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold
            hover:from-indigo-700 hover:to-violet-700 active:scale-[0.98]
            shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
            transition-all duration-200 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Payment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform duration-300" />
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/20">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <p className="text-3xl font-bold text-slate-800">₹{totalPaid.toLocaleString()}</p>
            <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Total Paid</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform duration-300" />
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{totalPayments}</p>
            <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">No. of Payments</p>
          </div>
        </div>
      </div>

      {/* History Section */}
      <PaymentHistory 
        payments={payments} 
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingPayment ? 'Edit Payment' : 'New Payment'}
        maxWidth="max-w-md"
      >
        <PaymentForm 
          onSubmit={handleAddPayment} 
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={closeDetails}
        title="Payment Details"
        maxWidth="max-w-lg"
      >
        <PaymentDetails 
          payment_id={viewingPayment} 
        />
      </Modal>
    </div>
  )
}

export default Payment