// components/payment/PaymentDetails.jsx
import React, { useEffect, useState } from "react";
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
  Download,
  Flag,
} from "lucide-react";
import { FetchPaymentDetails } from "../../services/Payment/Payment";
import { useAuth } from "@clerk/react";
import { getR2URL } from "../../services/ApiUrls";

const getStatusConfig = (status) => {
  switch (status) {
    case "pending":
      return {
        color: "text-amber-600 bg-amber-50 border-amber-200",
        icon: Clock,
        label: "Pending",
      };
    case "approved":
      return {
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        icon: CheckCircle2,
        label: "Approved",
      };
    case "rejected":
      return {
        color: "text-red-600 bg-red-50 border-red-200",
        icon: XCircle,
        label: "Rejected",
      };
    case "flagged":
      return {
        color: "text-orange-600 bg-orange-50 border-orange-200",
        icon: Flag,
        label: "Flagged",
      };
    default:
      return {
        color: "text-slate-600 bg-slate-50 border-slate-200",
        icon: Clock,
        label: status,
      };
  }
};

const PaymentDetails = ({ payment_id }) => {
  const { getToken } = useAuth();
  console.log(payment_id);

  const [payment, setPayment] = useState({
    receipt_id: 0,
    amount: 0,
    upi_transaction_no: "0",
    uploaded_on: "2026-05-04T11:57:05.189473Z",
    verification_status: "pending",
    name: "",
    roll_number: "",
    remarks: "",
  });

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      const token = await getToken();
      // Assuming you have a function to fetch payment details
      const result = await FetchPaymentDetails(token, payment_id);
      if (result.success) {
        setPayment(result.data);
      }
    };

    fetchPaymentDetails();
  }, [payment_id]);

  const statusConfig = getStatusConfig(payment.verification_status);
  const StatusIcon = statusConfig.icon;

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

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div
        className={`
        flex items-center gap-3 p-4 rounded-xl border
        ${statusConfig.color}
      `}
      >
        <StatusIcon className="w-6 h-6" />
        <div>
          <p className="text-sm font-semibold">
            Verification {statusConfig.label}
          </p>
          <p className="text-xs opacity-80">
            Transaction ID: {payment.upi_transaction_no}
          </p>
        </div>
      </div>

      {/* Amount Highlight */}
      <div className="text-center py-4">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
          Amount Paid
        </p>
        <p className="text-4xl font-bold text-slate-800 flex items-center justify-center gap-1">
          <IndianRupee className="w-8 h-8 text-indigo-600" />
          {payment.amount.toLocaleString()}
        </p>
        <p className="text-sm text-slate-500 mt-1 capitalize">
          {payment.payment_type === "mess-fee"
            ? "Mess Fee"
            : "Additional Mess Fee"}
        </p>
      </div>

      {(payment.verification_status === "flagged" ||
        payment.verification_status === "rejected") && (
        <div
          className={`mt-3 rounded-xl border px-4 py-3 text-sm font-bold text-center ${
            payment.verification_status === "flagged"
              ? "border-orange-200 bg-orange-50 text-orange-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {/* <span className="font-semibold">
     {" Remarks: "}
    </span> */}

          {payment.remarks?.charAt(0).toUpperCase() + payment.remarks?.slice(1)}
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
          <div className="flex items-center gap-2 mb-1.5">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Period
            </p>
          </div>
          <p className="text-sm font-semibold text-slate-800">
            {payment.month} {payment.year}
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
          <div className="flex items-center gap-2 mb-1.5">
            <CreditCard className="w-4 h-4 text-indigo-500" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              UPI Transaction
            </p>
          </div>
          <p className="text-sm font-mono font-semibold text-slate-800">
            {payment.upi_transaction_no}
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
          <div className="flex items-center gap-2 mb-1.5">
            <Clock className="w-4 h-4 text-indigo-500" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Submitted On
            </p>
          </div>
          <p className="text-sm font-semibold text-slate-800">
            {formatDate(payment.uploaded_on)}
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
          <div className="flex items-center gap-2 mb-1.5">
            <User className="w-4 h-4 text-indigo-500" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Payment ID
            </p>
          </div>
          <p className="text-sm font-mono font-semibold text-slate-800">
            #{String(payment.receipt_id).padStart(6, "0")}
          </p>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
        {payment.receipt_url ? (
          <div className="w-full h-64 overflow-auto">
            <img
              src={getR2URL(payment.receipt_url)}
              alt="Payment Receipt"
              className="w-full h-auto"
            />
          </div>
        ) : (
          <div className="w-full h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center">
              <Receipt className="w-8 h-8 text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500">
                Receipt Image
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Will be fetched from backend
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;
