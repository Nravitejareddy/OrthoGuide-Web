import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, User, Mail, Phone, Stethoscope, ChevronDown, Save, Loader2, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { getClinicianProfile, updateClinicianProfile } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

export default function ClinicianEditProfile() {
  const navigate = useNavigate()
  const { user, updateUserData } = useAuth()
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    specialization: ""
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getClinicianProfile(user.user_id || user.id)
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          phone_number: res.data.phone_number || "",
          specialization: res.data.specialization || "Orthodontics"
        })
      } catch (err) {
        console.error(err)
        toast.error("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchProfile()
  }, [user])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    try {
      const response = await updateClinicianProfile({
        clinician_id: user.user_id || user.id,
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        specialization: formData.specialization,
        // Omitting license and address as requested
        clinic_address: "Not Provided", 
        license_number: "Not Provided"
      })

      if (response.data?.user) {
        updateUserData(response.data.user)
      }

      toast.success("Profile updated successfully")
      navigate("/dashboard/clinician/profile")
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.error || "Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 relative overflow-hidden">
      {/* Decorative Watermark */}
      <div className="absolute bottom-10 right-10 opacity-[0.03] pointer-events-none transform rotate-12">
        <User size={400} className="text-blue-900" />
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <Link 
            to="/dashboard/clinician/profile" 
            className="p-2.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2">
                EDIT PROFILE
                <User size={14} className="text-blue-500" />
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">UPDATE PROFESSIONAL DETAILS</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto mt-10 px-6 relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
          {/* Quick Note Card */}
          <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white text-blue-600 rounded-2xl shadow-sm border border-blue-100">
                    <Shield size={24} />
                </div>
                <div className="flex-grow">
                   <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/20">
                        {formData.name?.split(' ').map(n => n[0]).join('') || "--"}
                      </div>
                      <div className="text-right">
                         <h2 className="text-sm font-black text-gray-900 tracking-tight">ESSENTIAL DETAILS ONLY</h2>
                         <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight leading-relaxed">
                            Update your primary information.
                         </p>
                      </div>
                   </div>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight leading-relaxed border-t border-blue-100 pt-4">
                      Clinical credentials are managed by administration.
                   </p>
                </div>
            </div>
          </div>

          {/* Form Card */}
          <form onSubmit={handleUpdate} className="bg-white border border-gray-100 rounded-[2rem] p-10 shadow-xl shadow-slate-200/40 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full Name */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <div className="relative group">
                        <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                        <input 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-4 pl-14 pr-6 transition-all font-bold text-gray-900 text-sm"
                            placeholder="Dr. Ravi Teja"
                        />
                    </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Role</label>
                    <div className="relative group">
                        <Stethoscope size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors pointer-events-none z-10" />
                        <select 
                            value={formData.specialization}
                            onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-4 pl-14 pr-10 transition-all font-bold text-gray-900 text-sm appearance-none cursor-pointer relative z-0"
                        >
                            <option value="" disabled>Select Role</option>
                            <option value="Orthodontist">Orthodontist</option>
                            <option value="Dentist">Dentist</option>
                            <option value="Assistant">Assistant</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-blue-600 transition-colors z-10" />
                    </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                        <input 
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-4 pl-14 pr-6 transition-all font-bold text-gray-900 text-sm"
                            placeholder="doctor@orthoguide.com"
                        />
                    </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                    <div className="relative group">
                        <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                        <input 
                            value={formData.phone_number}
                            onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-4 pl-14 pr-6 transition-all font-bold text-gray-900 text-sm"
                            placeholder="+91 98765 43210"
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
                <Link 
                    to="/dashboard/clinician/profile"
                    className="flex-1 py-4 text-center rounded-2xl border-2 border-gray-100 text-gray-500 font-black text-sm hover:bg-gray-50 transition-all"
                >
                    CANCEL
                </Link>
                <button 
                    type="submit"
                    disabled={isUpdating}
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {isUpdating ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                    SAVE CHANGES
                </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  )
}
