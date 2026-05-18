// pages/Register.jsx
import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  DoorOpen,
  Hash,
  Building2,
  Shield,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import { useAuth, useUser } from "@clerk/react";
import { RegisterUser } from "../services/Auth/Auth";
import { useNavigate } from "react-router";
import { FetchHostels } from "../services/References/Reference";
import { toast } from "sonner";

const Register = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roomNo: "",
    rollNo: "",
    hostel: "",
  });

  useEffect(() => {
    if (!user) return;

    setFormData((prev) => ({
      ...prev,
      name: user.fullName || "",
      email: user.primaryEmailAddress?.emailAddress || "",
    }));
  }, [user]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hostels, setHostels] = useState([])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const fetchHostels = async () => {
    const res = await FetchHostels()
    if (!res.success) {
      toast.error("Failed to fetch Hostels")
    }
    setHostels(res.data)
  }

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.length < 3)
      newErrors.name = "Name must be at least 3 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
      newErrors.phone = "Enter a valid 10-digit number";

    if (!formData.roomNo.trim()) newErrors.roomNo = "Room number is required";

    if (!formData.rollNo.trim()) newErrors.rollNo = "Roll number is required";

    if (!formData.hostel) newErrors.hostel = "Please select a hostel";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const token = await getToken();

      const result = await RegisterUser(token, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        room_no: formData.roomNo,
        roll_number: formData.rollNo,
        hostel_id: Number(formData.hostel),
      });

      if (!result.success) {
        console.error(result.error);
        alert(result.error); // or toast
        return;
      }

      setIsSuccess(true);

      setTimeout(async () => {
        setIsSuccess(false);
        await navigate("/dashboard");
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (field) => `
    w-full pl-10 pr-4 py-3 rounded-xl border text-sm
    bg-white/50 backdrop-blur-sm
    focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
    transition-all duration-200
    ${
      errors[field]
        ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20"
        : "border-slate-200 hover:border-slate-300"
    }
  `;

  useEffect(()=> {
    fetchHostels()
  },[])

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='1'%3E%3Cpath d='M36 34h-2v-4h2v4zm0-6v-4h-2v4h2zm-6 6h-4v2h4v-2zm0-6v-4h-4v4h4zm-6 6h-4v2h4v-2zm0-6v-4h-4v4h4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating Shapes */}
        <div className="absolute top-20 right-[15%] w-4 h-4 bg-indigo-400/20 rounded-full animate-pulse" />
        <div className="absolute top-40 left-[10%] w-3 h-3 bg-violet-400/20 rounded-full animate-pulse delay-700" />
        <div className="absolute bottom-32 right-[20%] w-5 h-5 bg-purple-400/20 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-[5%] w-2 h-2 bg-indigo-400/30 rounded-full animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Logo / Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-lg" />
                <div className="relative bg-gradient-to-br from-indigo-600 to-violet-600 p-3.5 rounded-2xl shadow-xl shadow-indigo-500/25">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  CHMS
                </h2>
                <p className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase leading-tight">
                  Student Registration
                </p>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Create Account
            </h1>
            <p className="text-sm text-slate-500">
              Register to access your hostel management portal
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl shadow-slate-200/50 overflow-hidden">
            {/* Card Header Gradient */}
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

            <div className="p-6 sm:p-8">
              {isSuccess ? (
                /* Success State */
                <div className="text-center py-8 animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    Registration Successful!
                  </h3>
                  <p className="text-sm text-slate-500">
                    Your details have been submitted. Check console for data.
                  </p>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        className={inputClasses("name")}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1 ml-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="you@example.com"
                        className={inputClasses("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1 ml-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        className={inputClasses("phone")}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1 ml-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Room & Roll Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Room No <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DoorOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={formData.roomNo}
                          onChange={(e) =>
                            handleChange("roomNo", e.target.value)
                          }
                          placeholder="e.g. A-101"
                          className={inputClasses("roomNo")}
                        />
                      </div>
                      {errors.roomNo && (
                        <p className="text-xs text-red-500 mt-1 ml-1">
                          {errors.roomNo}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Roll No <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={formData.rollNo}
                          onChange={(e) =>
                            handleChange("rollNo", e.target.value)
                          }
                          placeholder="e.g. 2101010"
                          className={inputClasses("rollNo")}
                        />
                      </div>
                      {errors.rollNo && (
                        <p className="text-xs text-red-500 mt-1 ml-1">
                          {errors.rollNo}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Hostel Dropdown */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Hostel <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={formData.hostel}
                        onChange={(e) => handleChange("hostel", e.target.value)}
                        className={`
                          w-full pl-10 pr-10 py-3 rounded-xl border text-sm appearance-none
                          bg-white/50 backdrop-blur-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                          transition-all duration-200
                          ${
                            errors.hostel
                              ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20"
                              : "border-slate-200 hover:border-slate-300"
                          }
                        `}
                      >
                          <option
                            value={0}
                            disabled={true}
                          >
                            {"Select Hostel"}
                          </option>
                        {hostels.map((h) => (
                          <option
                            key={h.hostel_id}
                            value={h.hostel_id}
                          >
                            {h.hostel_name}
                          </option>
                        ))}
                      </select>
                      {/* Custom Chevron */}
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.hostel && (
                      <p className="text-xs text-red-500 mt-1 ml-1">
                        {errors.hostel}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
                      text-sm font-bold text-white
                      bg-gradient-to-r from-indigo-600 to-violet-600
                      hover:from-indigo-700 hover:to-violet-700
                      active:scale-[0.98]
                      shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
                      transition-all duration-200
                      disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Security Note */}
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Your information is securely encrypted</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
