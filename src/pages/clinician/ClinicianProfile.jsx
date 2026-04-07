import { User, Mail, Phone, Edit, Shield, RotateCcw, AlertTriangle, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getClinicianProfile, deactivateAccount } from "@/api"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ClinicianProfile({ user }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [profileData, setProfileData] = useState(null)
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getClinicianProfile(user.user_id || user.id)
        setProfileData(res.data)
      } catch (err) {
        console.error(err)
        toast.error("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchProfile()
  }, [user])

  const handleDeactivate = async () => {
    setIsUpdating(true)
    try {
      await deactivateAccount({
        user_id: user?.user_id || user?.id,
        role: "clinician"
      })
      toast.success("Account deactivated successfully")
      setIsDeactivateDialogOpen(false)
      logout()
      navigate("/login")
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.error || "Failed to deactivate account")
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

  if (!profileData) return null

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Profile Section */}
      <div className="px-8 pt-8 pb-32 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-blue-500/40 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              {profileData.name?.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                Dr. {profileData.name}
              </h1>
              <p className="text-gray-500 font-medium mb-6 flex items-center gap-2">
                Orthodontist <span className="text-gray-300">|</span> ID: <span className="text-blue-600 font-bold">{profileData.clinician_id}</span>
              </p>
              
              <div className="flex gap-3">
                <span className="px-4 py-2 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-wider">
                  ACTIVE PROVIDER
                </span>
                <span className="px-4 py-2 bg-[#F0FBFA] text-[#0D9488] text-[10px] font-black rounded-full uppercase tracking-wider">
                  {profileData.specialization ? profileData.specialization.toUpperCase() : "ORTHODONTICS"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/dashboard/clinician/edit-profile")}
              className="px-6 py-3.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-colors shadow-lg active:scale-95 flex items-center gap-2.5"
            >
              <Edit size={16} /> 
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
          {/* Professional Information Column */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-4 flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <User size={16} />
              </div> 
              Professional Information
            </h3>
            <div className="space-y-4">
              <ModernInfoRow label="Full Name" value={profileData.name} icon={<User size={18} />} />
              <ModernInfoRow label="Email Address" value={profileData.email} icon={<Mail size={18} />} />
              <ModernInfoRow label="Phone Number" value={profileData.phone_number} icon={<Phone size={18} />} />
            </div>
          </div>

          {/* Manage Account Column */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-4 flex items-center gap-3">
              <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                  <Shield size={16} />
              </div> 
              Manage Account
            </h3>
            <div className="space-y-4">
               <AccountLink 
                  label="Change Password" 
                  icon={<RotateCcw size={18} className="text-blue-500" />}
                  onClick={() => navigate("/dashboard/clinician/change-password")}
               />
               <AccountLink 
                  label="Deactivate Account" 
                  icon={<AlertTriangle size={18} className="text-red-500" />}
                  danger
                  onClick={() => setIsDeactivateDialogOpen(true)}
               />
            </div>
          </div>
        </div>
      </div>

      {/* Deactivate Account Confirmation Dialog */}
      <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white border-0 shadow-2xl rounded-3xl p-0 overflow-hidden">
          <div className="p-8 flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 relative">
                 <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20"></div>
                 <div className="w-14 h-14 bg-red-100/50 rounded-full flex items-center justify-center">
                    <AlertTriangle size={32} className="text-red-600" />
                 </div>
             </div>

             <DialogTitle className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                Deactivate Account?
             </DialogTitle>
             
             <p className="text-sm font-bold text-gray-500 leading-relaxed mb-10 px-4">
                This will deactivate your profile. You will be logged out and will need to contact administration to reactivate your access.
             </p>

             <div className="grid grid-cols-2 gap-4 w-full">
                <button 
                  onClick={() => setIsDeactivateDialogOpen(false)}
                  className="py-4 rounded-2xl border-2 border-gray-100 text-gray-500 font-black text-sm hover:bg-gray-50 transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeactivate}
                  disabled={isUpdating}
                  className="py-4 rounded-2xl bg-red-600 text-white font-black text-sm hover:bg-red-700 shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 size={18} className="animate-spin" /> : "Deactivate"}
                </button>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ModernInfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-5 p-5 bg-gray-100 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
      <div className="p-3 bg-white text-gray-400 rounded-xl shadow-sm border border-gray-100 group-hover:text-blue-600 transition-colors">
        {icon}
      </div>
      <div className="flex-grow text-left">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-black text-gray-900 tracking-tight">{value || "Not Provided"}</p>
      </div>
    </div>
  )
}

function AccountLink({ icon, label, onClick, danger }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-5 p-5 bg-gray-100 rounded-2xl border border-transparent hover:border-gray-200 hover:bg-white transition-all group group"
    >
      <div className={`p-3 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform ${danger ? 'text-red-500' : 'text-blue-500'}`}>
        {icon}
      </div>
      <div className="flex-grow text-left">
        <p className={`text-sm font-black tracking-tight ${danger ? 'text-red-600' : 'text-gray-900'}`}>{label}</p>
      </div>
      <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
    </button>
  )
}

function Loader2({ className, size }) {
  return <RotateCcw className={`animate-spin ${className}`} size={size} />
}
