import React, { useState } from "react";
import { CalendarDays, CreditCard, Play } from "lucide-react";
import { paymentCategories } from "../../constants";

const Verify = ({ onSubmit, onFinished, isVerifying }) => {
  const currentDate = new Date();

  const [errors] = useState({});

  const [formData, setFormData] = useState({
    month: currentDate.toLocaleString("default", {
      month: "long",
    }),
    year: currentDate.getFullYear(),
    paymentType: "",
  });

  const currentYear = currentDate.getFullYear();

  const years = Array.from(
    { length: 9 },
    (_, i) => currentYear - 5 + i
  );

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

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    await onSubmit(formData);
    onFinished();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className="rounded-3xl border border-slate-200/70 bg-white/90 backdrop-blur-xl
        shadow-[0_10px_40px_rgba(99,102,241,0.08)] overflow-hidden"
      >
        {/* Header */}
        <div
          className="px-6 py-5 border-b border-slate-100
          bg-gradient-to-r from-indigo-50 via-violet-50 to-fuchsia-50"
        >
          <div className="flex items-center gap-3">
            <div
              className="h-11 w-11 rounded-2xl bg-gradient-to-br
              from-indigo-600 to-violet-600 flex items-center justify-center
              shadow-lg shadow-indigo-500/20"
            >
              <CreditCard className="h-5 w-5 text-white" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Verify Payments
              </h2>

              <p className="text-sm text-slate-500 mt-0.5">
                Start automatic payment verification worker
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Month */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <CalendarDays className="h-4 w-4 text-indigo-500" />
                Month
              </label>

              <select
                value={formData.month}
                onChange={(e) =>
                  handleChange("month", e.target.value)
                }
                className={`
                  w-full rounded-2xl border bg-white px-4 py-3 text-sm
                  shadow-sm transition-all duration-200
                  focus:outline-none focus:ring-4 focus:ring-indigo-500/10
                  focus:border-indigo-500 appearance-none
                  ${
                    errors.month
                      ? "border-red-300 bg-red-50"
                      : "border-slate-200 hover:border-slate-300"
                  }
                `}
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              {errors.month && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.month}
                </p>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Year
              </label>

              <select
                value={formData.year}
                onChange={(e) =>
                  handleChange("year", parseInt(e.target.value))
                }
                className="
                  w-full rounded-2xl border border-slate-200 bg-white
                  px-4 py-3 text-sm shadow-sm transition-all duration-200
                  focus:outline-none focus:ring-4 focus:ring-indigo-500/10
                  focus:border-indigo-500 hover:border-slate-300
                "
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Payment Type
              </label>

              <select
                value={formData.paymentType}
                onChange={(e) =>
                  handleChange("paymentType", e.target.value)
                }
                className={`
                  w-full rounded-2xl border bg-white px-4 py-3 text-sm
                  shadow-sm transition-all duration-200
                  focus:outline-none focus:ring-4 focus:ring-indigo-500/10
                  focus:border-indigo-500 appearance-none
                  ${
                    errors.paymentType
                      ? "border-red-300 bg-red-50"
                      : "border-slate-200 hover:border-slate-300"
                  }
                `}
              >
                <option value="">Select type</option>

                {paymentCategories.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>

              {errors.paymentType && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.paymentType}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            className="pt-5 border-t border-slate-100
            flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm font-medium text-slate-700">
                Selected Period
              </p>

              <p className="text-sm text-slate-500 mt-1">
                {formData.month} {formData.year}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className={`
                inline-flex items-center justify-center gap-2
                rounded-2xl px-5 py-3
                bg-gradient-to-r from-indigo-600 to-violet-600
                text-white text-sm font-semibold
                shadow-lg shadow-indigo-500/25
                hover:shadow-indigo-500/40
                hover:from-indigo-700 hover:to-violet-700
                active:scale-[0.98]
                transition-all duration-200`}
            >
              <Play className="h-4 w-4" />
              {isVerifying ? "Starting..." : "Start Verify Worker"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verify;