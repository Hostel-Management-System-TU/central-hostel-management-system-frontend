// components/payment/PaymentForm.jsx
import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  Receipt,
  CreditCard,
  Utensils,
  Plus,
  FileText,
} from "lucide-react";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 9 }, (_, i) => currentYear - 5 + i);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const paymentTypes = [
  { value: "1", label: "Mess Fee", icon: Utensils },
  { value: "2", label: "Additional Mess Fee", icon: Plus },
];

const PaymentForm = ({ onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    month: "",
    year: currentYear,
    paymentType: "",
    amount: "",
    description: "",
    upiTransactionNo: "",
    receipt: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, receipt: "File must be under 5MB" }));
        return;
      }
      setFormData((prev) => ({ ...prev, receipt: file }));
      setPreviewUrl(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, receipt: "" }));
    }
  };

  const removeReceipt = () => {
    setFormData((prev) => ({ ...prev, receipt: null }));
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.month) newErrors.month = "Select a month";
    if (!formData.paymentType) newErrors.paymentType = "Select payment type";
    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "Enter valid amount";
    if (!formData.upiTransactionNo)
      newErrors.upiTransactionNo = "Enter UPI transaction number";
    if (!formData.receipt) newErrors.receipt = "Upload receipt image";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Month & Year Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Month <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.month}
            onChange={(e) => handleChange("month", e.target.value)}
            className={`
              w-full px-3 py-2.5 rounded-xl border bg-white text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
              transition-all duration-200
              ${errors.month ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-slate-300"}
            `}
          >
            <option value="">Select month</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {errors.month && (
            <p className="text-xs text-red-500 mt-1">{errors.month}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Year <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.year}
            onChange={(e) => handleChange("year", parseInt(e.target.value))}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
              hover:border-slate-300 transition-all duration-200"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Payment Type - Dropdown */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Payment Type <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.paymentType}
          onChange={(e) => handleChange("paymentType", e.target.value)}
          className={`
            w-full px-3 py-2.5 rounded-xl border bg-white text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
            transition-all duration-200
            ${errors.paymentType ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-slate-300"}
          `}
        >
          <option value="">Select payment type</option>
          {paymentTypes.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.paymentType && (
          <p className="text-xs text-red-500 mt-1">{errors.paymentType}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Description
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter description (optional)"
            rows={3}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
              hover:border-slate-300 transition-all duration-200 resize-none"
          />
        </div>
      </div>

      {/* Amount & UPI Transaction */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Amount (₹) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
              ₹
            </span>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="0.00"
              className={`
                w-full pl-8 pr-3 py-2.5 rounded-xl border text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                transition-all duration-200
                ${errors.amount ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-slate-300"}
              `}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            UPI Transaction No <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={formData.upiTransactionNo}
              onChange={(e) => handleChange("upiTransactionNo", e.target.value)}
              placeholder="e.g. 726586987982"
              className={`
                w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                transition-all duration-200
                ${errors.upiTransactionNo ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-slate-300"}
              `}
            />
          </div>
          {errors.upiTransactionNo && (
            <p className="text-xs text-red-500 mt-1">
              {errors.upiTransactionNo}
            </p>
          )}
        </div>
      </div>

      {/* Receipt Upload */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Receipt <span className="text-red-500">*</span>
        </label>

        {!previewUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-6 cursor-pointer
              flex flex-col items-center gap-2 text-center
              transition-all duration-200
              ${
                errors.receipt
                  ? "border-red-300 bg-red-50"
                  : "border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30"
              }
            `}
          >
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
              <Upload className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                Click to upload receipt
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                PNG, JPG up to 5MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
            <img
              src={previewUrl}
              alt="Receipt preview"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={removeReceipt}
                className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-red-600" />
              </button>
            </div>
            <button
              type="button"
              onClick={removeReceipt}
              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg hover:bg-white transition-colors shadow-sm lg:hidden"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded-lg text-white text-xs font-medium flex items-center gap-1">
              <Receipt className="w-3 h-3" />
              {formData.receipt?.name}
            </div>
          </div>
        )}
        {errors.receipt && (
          <p className="text-xs text-red-500 mt-1">{errors.receipt}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={
            isSubmitting
              ? `flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-300 to-violet-400 text-white text-sm font-semibold active:scale-[0.98] shadow-lg shadow-indigo-500/25 transition-all duration-200`
              : `flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold
            hover:from-indigo-700 hover:to-violet-700 active:scale-[0.98] shadow-lg shadow-indigo-500/25
            transition-all duration-200`
          }
        >
          {isSubmitting ? "Submitting ..." : "Submit Payment"}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
