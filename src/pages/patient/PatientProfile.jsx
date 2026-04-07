import { User, Mail, Phone, Calendar, Shield, Edit, Loader2, X, ArrowLeft, RotateCcw, AlertTriangle, ChevronRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { usePatientData } from "../../hooks/usePatientData"
import { useState, useEffect } from "react"
import { updatePatientProfile, deactivateAccount } from "@/api"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function PatientProfile({ user }) {
  const navigate = useNavigate()
  const { profileData, loading, error, refetch } = usePatientData(user?.user_id || user?.id);
  const { updateUserData, logout } = useAuth()
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: ""
  })

  // Synchronize form data when profileData changes
  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || "",
        email: profileData.email || "",
        phone_number: profileData.phone || ""
      })
    }
  }, [profileData])

  if (!user) return null

  const handleDeactivate = async () => {
    setIsUpdating(true)
    try {
        await deactivateAccount({
            user_id: user?.user_id,
            role: "patient"
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
        <Loader2 className="h-10 w-10 animate-spin text-green-600" />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <p className="text-gray-500 font-medium text-lg">Failed to load profile details.</p>
        <button className="text-green-600 hover:underline font-semibold" onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      const response = await updatePatientProfile({
        patient_id: user?.user_id || user?.id,
        ...formData
      })
      
      // Update local state and auth context
      if (refetch) await refetch();
      if (updateUserData && response.data?.user) {
        updateUserData(response.data.user);
      }
      
      toast.success("Profile updated successfully")
      setIsEditDialogOpen(false)
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.error || "Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-up min-h-screen relative">
      {/* Premium Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-50/50 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-blue-50/30 blur-[100px]"></div>
      </div>

      {/* Standard Header - Sticky */}
      <div className="sticky top-0 flex items-center gap-4 py-4 px-2 border-b border-gray-100/50 bg-white/80 backdrop-blur-md shrink-0 z-40">
        <Link to="/dashboard" className="p-2.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all shadow-sm">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2">
            MY PROFILE
            <User size={14} className="text-green-500" />
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">PERSONAL & CLINICAL DETAILS</p>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-md p-8 shadow-xl shadow-slate-200/50">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="w-28 h-28 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-md flex items-center justify-center text-4xl font-semibold shadow-xl shadow-green-200 rotate-3 hover:rotate-0 transition-transform cursor-default">
            {profileData.name?.charAt(0) || "P"}
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h2 className="text-3xl font-semibold text-gray-900 mb-1">{profileData.name}</h2>
            <p className="text-sm text-gray-500 font-medium">Patient ID: <span className="font-mono text-green-600 font-semibold">{profileData.patient_id}</span></p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
              <span className={`inline-flex text-[10px] font-semibold uppercase tracking-widest px-4 py-2 rounded-full ${profileData.is_active ? 'text-green-700 bg-green-50 border border-green-100' : 'text-red-700 bg-red-50 border border-red-100'}`}>
                {profileData.is_active ? 'Active Treatment' : 'Inactive'}
              </span>
              <span className="inline-flex text-[10px] font-semibold uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
                {profileData.treatment_stage}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIsEditDialogOpen(true)}
            className="group relative bg-slate-900 overflow-hidden text-white font-bold px-8 py-4 rounded-xl text-sm transition-all hover:shadow-2xl hover:shadow-slate-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative flex items-center gap-2">
              <Edit size={16} className="group-hover:rotate-12 transition-transform" /> Edit Profile
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
        {/* Personal Information Column */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-8 flex items-center gap-3">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <User size={16} />
            </div> 
            Personal Information
          </h3>
          <div className="space-y-4">
            <ModernInfoRow 
                label="Full Name" 
                value={profileData.name} 
                icon={<User size={18} className="text-gray-400" />} 
            />
            <ModernInfoRow 
                label="Email Address" 
                value={profileData.email} 
                icon={<Mail size={18} className="text-gray-400" />} 
            />
            <ModernInfoRow 
                label="Phone Number" 
                value={profileData.phone} 
                icon={<Phone size={18} className="text-gray-400" />} 
            />
          </div>
        </div>

        {/* Manage Account Column */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-8 flex items-center gap-3">
            <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                <Shield size={16} />
            </div> 
            Manage Account
          </h3>
          <div className="space-y-4">
             <AccountLink 
                label="Change Password" 
                icon={<RotateCcw size={18} className="text-emerald-500" />}
                onClick={() => navigate("/dashboard/patient/change-password")}
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

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white [&>button]:hidden border-0 shadow-2xl rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="p-6 bg-gradient-to-r from-green-600 to-green-700 text-white">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Edit size={20} /> Update Personal Profile
              </DialogTitle>
              <button onClick={() => setIsEditDialogOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <DialogDescription className="text-green-50/80 mt-1">
              Keep your contact information up to date for clinical follow-ups.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:bg-white focus:border-green-500 transition-all font-medium text-gray-900"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:bg-white focus:border-green-500 transition-all font-medium text-gray-900"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
              <div className="relative group">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                <input
                  value={formData.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:bg-white focus:border-green-500 transition-all font-medium text-gray-900"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3 sm:flex-row">
            <button
              onClick={() => setIsEditDialogOpen(false)}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-green-500/25 disabled:opacity-50"
            >
              {isUpdating ? <Loader2 className="animate-spin" size={16}/> : <Shield size={16}/>}
              Save Profile Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Account Confirmation Dialog */}
      <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white border-0 shadow-2xl rounded-3xl p-0 overflow-hidden">
          <div className="p-8 flex flex-col items-center text-center">
             {/* Warning Icon Overlay style */}
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
                This will deactivate your account on this device. 
                You will need to contact the clinic to reactivate it.
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
    <div className="flex items-center gap-5 p-5 bg-gray-100 rounded-2xl border border-transparent hover:border-green-100 hover:bg-white transition-all group">
      <div className="p-3 bg-white text-gray-400 rounded-xl shadow-sm border border-gray-100 group-hover:text-green-600 transition-colors">
        {icon}
      </div>
      <div className="flex-grow">
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
      <div className={`p-3 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform ${danger ? 'text-red-500' : 'text-emerald-500'}`}>
        {icon}
      </div>
      <div className="flex-grow text-left">
        <p className={`text-sm font-black tracking-tight ${danger ? 'text-red-600' : 'text-gray-900'}`}>{label}</p>
      </div>
      <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
    </button>
  )
}
