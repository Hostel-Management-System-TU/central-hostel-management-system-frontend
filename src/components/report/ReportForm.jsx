// components/report/ReportForm.jsx
import React, { useState } from 'react'
import { Upload, X, AlertTriangle } from 'lucide-react'

const REPORT_TYPES = [
  { value: 1, label: 'Electricity' },
  { value: 2, label: 'Water' },
  { value: 3, label: 'Furniture' },
  { value: 4, label: 'Cleanliness' },
  { value: 5, label: 'Security' },
  { value: 6, label: 'Noise' },
  { value: 7, label: 'Food' },
  { value: 8, label: 'Other' },
]

const ReportForm = ({ onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    reportType: '',
    comment: '',
    supportingImage: null,
  })
  const [previewUrl, setPreviewUrl] = useState(null)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, supportingImage: 'File size must be less than 5MB' }))
      return
    }

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, supportingImage: 'Please upload an image file' }))
      return
    }

    setFormData(prev => ({ ...prev, supportingImage: file }))
    setPreviewUrl(URL.createObjectURL(file))
    setErrors(prev => ({ ...prev, supportingImage: '' }))
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, supportingImage: null }))
    setPreviewUrl(null)
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.reportType) newErrors.reportType = 'Please select a report type'
    if (!formData.comment.trim()) newErrors.comment = 'Please enter a comment'
    if (formData.comment.trim().length < 10) newErrors.comment = 'Comment must be at least 10 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Report Type */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Report Type <span className="text-rose-500">*</span>
        </label>
        <select
          name="reportType"
          value={formData.reportType}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 rounded-xl border ${errors.reportType ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'} 
            bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400
            transition-all duration-200`}
        >
          <option value="">Select issue type...</option>
          {REPORT_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        {errors.reportType && (
          <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> {errors.reportType}
          </p>
        )}
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Comment <span className="text-rose-500">*</span>
        </label>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          rows={4}
          placeholder="Describe your issue in detail (min. 10 characters)..."
          className={`w-full px-4 py-2.5 rounded-xl border ${errors.comment ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'} 
            bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400
            transition-all duration-200 resize-none`}
        />
        {errors.comment && (
          <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> {errors.comment}
          </p>
        )}
        <p className="text-xs text-slate-400 mt-1 text-right">{formData.comment.length} chars</p>
      </div>

      {/* Supporting Image */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Supporting Image <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        
        {!previewUrl ? (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="report-image"
            />
            <label
              htmlFor="report-image"
              className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed 
                border-slate-300 hover:border-rose-400 bg-slate-50 hover:bg-rose-50/50
                cursor-pointer transition-all duration-200 group"
            >
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-rose-500 mb-2 transition-colors" />
              <span className="text-sm text-slate-500 group-hover:text-rose-600">Click to upload image</span>
              <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</span>
            </label>
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
            <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white 
                hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {errors.supportingImage && (
          <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> {errors.supportingImage}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium
            hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 
            text-white text-sm font-semibold hover:from-rose-700 hover:to-red-700
            shadow-lg shadow-rose-500/25 active:scale-[0.98]
            transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Report'
          )}
        </button>
      </div>
    </form>
  )
}

export default ReportForm