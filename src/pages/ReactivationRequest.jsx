import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Info, Send } from "lucide-react"
import { toast } from "sonner"
import { submit_reactivation_request } from "@/api"

export default function ReactivationRequest() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState(null)
  
  const state = location.state || {}
  const [formData, setFormData] = useState({
    patient_id: state.userId || "",
    patient_name: "",
    contact_info: "",
    reason: "",
    user_role: state.role || "patient"
  })

  const isClinician = formData.user_role === "clinician"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmissionError(null)
    
    if (!formData.patient_name || !formData.contact_info || !formData.reason) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await submit_reactivation_request(formData)
      if (response.status === 201) {
        toast.success("Request Submitted Successfully")
        setTimeout(() => navigate("/login"), 2000)
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Handle pending request already exists from Axios error catch
        const errorMsg = error.response.data?.error || "A pending request already exists for this account."
        setSubmissionError(errorMsg)
        toast.error(errorMsg)
      } else {
        const errorMsg = error.response?.data?.error || "An error occurred. Please try again."
        toast.error(errorMsg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/30 flex flex-col items-center py-12 px-4 font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${isClinician ? 'bg-blue-50' : 'bg-green-50'} rounded-full blur-[120px] -mr-40 -mt-40 opacity-60 pointer-events-none`} />
      <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] ${isClinician ? 'bg-blue-50' : 'bg-green-50'} rounded-full blur-[120px] -ml-40 -mb-40 opacity-60 pointer-events-none`} />

      <div className="max-w-2xl w-full space-y-8 relative z-10 animate-fade-up">
        {/* Title Area */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className={`w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:${isClinician ? 'text-blue-600' : 'text-green-600'} transition-all shadow-sm hover:shadow-md`}
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reactivation Request</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-100/50 rounded-[32px] shadow-2xl shadow-gray-200/40 p-8 md:p-12 space-y-10 relative">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Account Details */}
            <div className="space-y-6">
              <div className={`flex items-center gap-4 text-sm font-semibold uppercase tracking-wider ${isClinician ? 'text-blue-600' : 'text-green-600'}`}>
                <span className="whitespace-nowrap">Account Details</span>
                <div className="h-px bg-gray-100 w-full" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wide">Your ID</label>
                  <input 
                    type="text" 
                    value={formData.patient_id}
                    onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                    placeholder={isClinician ? "DR123..." : "PAT123..."}
                    className={`w-full bg-gray-50 border border-gray-100/50 rounded-2xl px-6 py-4 text-sm font-semibold text-gray-700 focus:ring-2 ${isClinician ? 'focus:ring-blue-500/10 focus:border-blue-400' : 'focus:ring-green-500/10 focus:border-green-400'} outline-none transition-all placeholder:text-gray-300`}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wide">Official Full Name</label>
                  <input 
                    type="text" 
                    value={formData.patient_name}
                    onChange={(e) => setFormData({...formData, patient_name: e.target.value})}
                    placeholder="e.g. Johnathan Doe"
                    className={`w-full bg-gray-50 border border-gray-100/50 rounded-2xl px-6 py-4 text-sm font-semibold text-gray-700 focus:ring-2 ${isClinician ? 'focus:ring-blue-500/10 focus:border-blue-400' : 'focus:ring-green-500/10 focus:border-green-400'} outline-none transition-all placeholder:text-gray-300`}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className={`flex items-center gap-4 text-sm font-semibold uppercase tracking-wider ${isClinician ? 'text-blue-600' : 'text-green-600'}`}>
                <span className="whitespace-nowrap">Contact Info</span>
                <div className="h-px bg-gray-100 w-full" />
              </div>
              <input 
                type="text" 
                value={formData.contact_info}
                onChange={(e) => setFormData({...formData, contact_info: e.target.value})}
                placeholder="Email or Phone Number"
                className={`w-full bg-gray-50 border border-gray-100/50 rounded-2xl px-6 py-4 text-sm font-semibold text-gray-700 focus:ring-2 ${isClinician ? 'focus:ring-blue-500/10 focus:border-blue-400' : 'focus:ring-green-500/10 focus:border-green-400'} outline-none transition-all placeholder:text-gray-300`}
                required
              />
            </div>

            {/* Request Reason */}
            <div className="space-y-6">
              <div className={`flex items-center gap-4 text-sm font-semibold uppercase tracking-wider ${isClinician ? 'text-blue-600' : 'text-green-600'}`}>
                <span className="whitespace-nowrap">Request Reason</span>
                <div className="h-px bg-gray-100 w-full" />
              </div>
              <textarea 
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                placeholder="Please describe why you would like to reactivate your account..."
                className={`w-full bg-gray-50 border border-gray-100/50 rounded-3xl px-8 py-6 text-sm font-semibold text-gray-700 focus:ring-2 ${isClinician ? 'focus:ring-blue-500/10 focus:border-blue-400' : 'focus:ring-green-500/10 focus:border-green-400'} outline-none transition-all placeholder:text-gray-300 min-h-[140px] resize-none`}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${isClinician ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-blue-500/20' : 'bg-green-500 hover:bg-green-600 active:bg-green-700 shadow-green-500/20'} disabled:opacity-50 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl active:scale-[0.99] flex items-center justify-center gap-3 group`}
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="text-base tracking-wide uppercase">Submit Official Request</span>
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Status/Info Box (Hiding error alert to declutter) */}
          <div className={`${isClinician ? 'bg-blue-50/50 border-blue-100/30' : 'bg-green-50/50 border-green-100/30'} border rounded-[24px] p-6 flex items-start gap-4`}>
            <div className={`w-8 h-8 bg-white border ${isClinician ? 'border-blue-200' : 'border-green-200'} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm`}>
              <Info className={isClinician ? 'text-blue-500' : 'text-green-500'} size={16} />
            </div>
            <p className={`${isClinician ? 'text-blue-800' : 'text-green-800'} text-xs font-semibold leading-relaxed`}>
              Your request will be reviewed by the clinical administrator. You will be notified via your provided contact information once a decision is made.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
