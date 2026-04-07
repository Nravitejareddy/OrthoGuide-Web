import React, { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Lock, HelpCircle, Send, ArrowLeft, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { submit_reactivation_request } from "@/api"
import Logo from "../components/Logo"

export default function AccountInactive() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  
  // Data passed from login attempt
  const state = location.state || {}
  const isClinician = state.role === "clinician"

  const [formData, setFormData] = useState({
    patient_id: state.userId || "",
    patient_name: "",
    contact_info: "",
    reason: "",
    user_role: state.role || "patient"
  })

  const handleSubmitRequest = async (e) => {
    e.preventDefault()
    if (!formData.patient_name || !formData.contact_info || !formData.reason) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await submit_reactivation_request(formData)
      
      if (response.status === 201) {
        toast.success("Reactivation request submitted successfully")
        setShowForm(false)
      } else {
        toast.error(response.data?.error || "Failed to submit request")
      }
    } catch (error) {
      console.error("Error submitting reactivation request:", error)
      toast.error("An error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden bg-gray-50/30">
      {/* Background Gradients - subtle and modern */}
      <div className={`absolute top-0 right-0 w-[400px] h-[400px] ${isClinician ? 'bg-blue-50/50' : 'bg-green-50/50'} rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none`} />
      <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] ${isClinician ? 'bg-blue-50/50' : 'bg-green-50/50'} rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none`} />

      <div className="max-w-md w-full relative z-10 animate-fade-up">
        {/* Main Content Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-8">
          
          {/* Status Icon */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`w-16 h-16 ${isClinician ? 'bg-blue-100' : 'bg-green-100'} rounded-full flex items-center justify-center`}>
              <div className={`w-12 h-12 ${isClinician ? 'bg-blue-600 shadow-blue-100' : 'bg-green-500 shadow-green-100'} rounded-full flex items-center justify-center shadow-lg`}>
                <Lock className="text-white" size={24} />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Account Inactive
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed px-4">
                Your account has been deactivated by the administrator system. 
                You cannot access your dashboard at this moment.
              </p>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Action Section */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 text-center space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-gray-800">Want to reactivate?</h3>
                <p className="text-gray-500 text-xs">
                  Submit a request to the administrator for review.
                </p>
              </div>
              <button 
                onClick={() => navigate("/reactivation-request", { state: { userId: state.userId, role: state.role } })}
                className={`w-full ${isClinician ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm group`}
              >
                <Send size={16} className="group-hover:translate-x-0.5 transition-transform" />
                Request Reactivation
              </button>
            </div>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <button 
              onClick={() => navigate("/login")}
              className={`text-sm font-medium ${isClinician ? 'text-blue-600 hover:text-blue-700' : 'text-green-600 hover:text-green-700'} inline-flex items-center gap-1.5 transition-colors`}
            >
              <ArrowLeft size={14} />
              Back to Sign In
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <Link to="/support" className={`hover:${isClinician ? 'text-blue-600' : 'text-green-600'} transition-colors`}>Support</Link>
          <Link to="/privacy-policy" className={`hover:${isClinician ? 'text-blue-600' : 'text-green-600'} transition-colors`}>Privacy</Link>
          <Link to="/terms" className={`hover:${isClinician ? 'text-blue-600' : 'text-green-600'} transition-colors`}>Terms</Link>
        </div>
      </div>
    </div>
  )
}
