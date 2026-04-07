import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Bell, HelpCircle, Shield, Check, Eye, EyeOff, Loader2, Lock, AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/useAuth"
import { changePassword } from "@/api"
import { toast } from "sonner"

export default function ChangePassword() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const requirements = [
    { label: "Minimum 8 characters", met: formData.newPassword.length >= 8 },
    { label: "At least one uppercase letter", met: /[A-Z]/.test(formData.newPassword) },
    { label: "At least one number", met: /[0-9]/.test(formData.newPassword) },
    { label: "At least one special character", met: /[^A-Za-z0-9]/.test(formData.newPassword) }
  ]

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters long"
    if (!/[A-Z]/.test(password)) return "Password must contain at least one capital letter"
    if (!/[0-9]/.test(password)) return "Password must contain at least one number"
    if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character"
    return null
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    
    if (!formData.currentPassword) {
      toast.error("Please enter your current password")
      return
    }

    const error = validatePassword(formData.newPassword)
    if (error) {
      toast.error(error)
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    setLoading(true)
    try {
      await changePassword({
        user_id: user?.user_id || user?.id,
        role: user?.role || "patient",
        old_password: formData.currentPassword,
        new_password: formData.newPassword
      })
      toast.success("Password updated successfully")
      navigate("/dashboard/patient/profile")
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.error || "Failed to update password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 relative overflow-hidden">
      {/* Decorative Watermark */}
      <div className="absolute bottom-10 right-10 opacity-[0.03] pointer-events-none transform rotate-12">
        <Shield size={400} className="text-emerald-900" />
        <div className="absolute inset-0 flex items-center justify-center">
             <Check size={200} className="text-emerald-900" />
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <Link 
            to="/dashboard/patient/profile" 
            className="p-2.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2">
                CHANGE PASSWORD
                <Lock size={14} className="text-emerald-500" />
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">SECURE YOUR ACCOUNT</p>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto mt-10 px-6 relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
          {/* Requirements Box */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-white border border-emerald-100 text-emerald-600 rounded-xl shadow-sm">
                    <Shield size={20} />
                </div>
                <div>
                    <h2 className="text-sm font-black text-gray-900 tracking-tight">PASSWORD REQUIREMENTS</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">STRENGTH & COMPLEXITY</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-3 group whitespace-nowrap">
                   <div className={`p-1 rounded-full transition-all duration-300 ${req.met ? 'bg-emerald-500 text-white scale-110' : 'bg-white text-gray-300 border border-gray-200'}`}>
                      <Check size={10} strokeWidth={4} />
                   </div>
                   <span className={`text-[11px] font-black tracking-tight transition-colors ${req.met ? 'text-gray-900' : 'text-gray-400'}`}>
                      {req.label.toUpperCase()}
                   </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Current Password</label>
                <div className="relative group">
                    <input 
                        type={showCurrent ? "text" : "password"}
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                        className="w-full bg-gray-100 border-2 border-transparent focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 rounded-2xl py-4 px-6 transition-all font-black text-gray-900 text-sm placeholder:text-gray-300"
                        placeholder="••••••••"
                    />
                    <button 
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-emerald-600 transition-colors"
                    >
                        {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">New Password</label>
                <div className="relative group">
                    <input 
                        type={showNew ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                        className="w-full bg-gray-100 border-2 border-transparent focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 rounded-2xl py-4 px-6 transition-all font-black text-gray-900 text-sm placeholder:text-gray-300"
                        placeholder="••••••••"
                    />
                    <button 
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-emerald-600 transition-colors"
                    >
                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
                <div className="relative group">
                    <input 
                        type={showConfirm ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="w-full bg-gray-100 border-2 border-transparent focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 rounded-2xl py-4 px-6 transition-all font-black text-gray-900 text-sm placeholder:text-gray-300"
                        placeholder="••••••••"
                    />
                    <button 
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-emerald-600 transition-colors"
                    >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            {/* Update Button */}
            <button 
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:scale-100 flex items-center justify-center gap-3 mt-4"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={18} />}
                UPDATE PASSWORD
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  )
}
