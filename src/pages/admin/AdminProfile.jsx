import { Shield, Mail, Phone, Key, Edit, Server, Loader2, Calendar, X, Save, User, LifeBuoy, ChevronRight, Lock, HelpCircle, MessageCircle, Clock, RotateCcw, AlertTriangle, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { updateAdminProfile, getAdminProfile, changePassword, deactivateAccount } from "@/api"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function AdminProfile() {
  const { user, updateUserData } = useAuth()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isHelpSupportDialogOpen, setIsHelpSupportDialogOpen] = useState(false)
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [fullProfile, setFullProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: ""
  })

  // Password Change Form State
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const id = user.user_id || user.id
        const res = await getAdminProfile(id)
        setFullProfile(res.data)
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          phone_number: res.data.phone_number || ""
        })
      } catch (err) {
        console.error("Failed to load admin profile", err)
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchProfile()
  }, [user])

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      const response = await updateAdminProfile({
        id: user.user_id || user.id,
        ...formData
      })
      
      const updatedUserData = response.data.user;
      updateUserData(updatedUserData)
      
      setFullProfile({
        ...fullProfile,
        name: updatedUserData.name,
        email: updatedUserData.email,
        phone_number: updatedUserData.phone_number,
        admin_id: updatedUserData.user_id
      })
      
      toast.success("Profile updated successfully")
      setIsEditDialogOpen(false)
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.error || "Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters long"
    if (!/[A-Z]/.test(password)) return "Password must contain at least one capital letter"
    if (!/[0-9]/.test(password)) return "Password must contain at least one number"
    if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character"
    return null
  }

  const handlePasswordChange = async () => {
    if (!passwordForm.current_password) {
      toast.error("Please enter your current password")
      return
    }

    const error = validatePassword(passwordForm.new_password)
    if (error) {
      toast.error(error)
      return
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("New passwords do not match")
      return
    }

    setIsUpdating(true)
    try {
      await changePassword({
        id: user.user_id || user.id,
        role: "admin",
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      })
      toast.success("Password changed successfully")
      setIsPasswordDialogOpen(false)
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" })
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to change password")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeactivate = async () => {
    setIsUpdating(true)
    try {
        await deactivateAccount({
            user_id: user?.user_id || user?.id,
            role: "admin"
        })
        toast.success("Account deactivated successfully")
        setIsDeactivateDialogOpen(false)
        if (typeof window !== 'undefined') {
          localStorage.clear();
          window.location.href = "/login";
        }
    } catch (err) {
        console.error(err)
        toast.error(err.response?.data?.error || "Failed to deactivate account")
    } finally {
        setIsUpdating(false)
    }
  }

  if (!user || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up min-h-screen relative pb-20">
      {/* Premium Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-50/50 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-50/30 blur-[100px]"></div>
      </div>

      <div>
        <h1 className="text-3xl font-semibold text-gray-900 leading-tight tracking-tight">System Admin</h1>
        <p className="text-gray-500 text-sm mt-1">Manage global platform controls and security identity.</p>
      </div>

      {/* Profile Header */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-md p-8 shadow-xl shadow-slate-200/50">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="w-28 h-28 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-md flex items-center justify-center text-4xl font-semibold shadow-xl shadow-purple-200 rotate-3 hover:rotate-0 transition-transform cursor-default">
            {user.name?.charAt(0) || "A"}
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h2 className="text-3xl font-semibold text-gray-900 mb-1">{fullProfile?.name || user?.name}</h2>
            <p className="text-sm text-gray-500 font-medium">System Superuser <span className="text-gray-300 mx-2">|</span> ID: <span className="font-mono text-purple-600 font-semibold">{fullProfile?.admin_id || user?.user_id}</span></p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest px-4 py-2 rounded-full text-white bg-red-600 shadow-sm shadow-red-200">
                <Shield size={10}/> Root Access
              </span>
              <span className="inline-flex text-[10px] font-semibold uppercase tracking-widest text-purple-700 bg-purple-50 border border-purple-100 px-4 py-2 rounded-full">
                Full Permissions
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIsEditDialogOpen(true)}
            className="group relative bg-slate-900 overflow-hidden text-white font-bold px-8 py-4 rounded-xl text-sm transition-all hover:shadow-2xl hover:shadow-slate-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative flex items-center gap-2">
              <Edit size={16} className="group-hover:rotate-12 transition-transform" /> Edit Profile
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Information Column */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 self-start">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-8 flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <User size={16} />
            </div> 
            Personal Information
          </h3>
          <div className="space-y-4">
            <ModernInfoRow 
                label="Full Name" 
                value={fullProfile?.name || user?.name} 
                icon={<User size={18} className="text-gray-400" />} 
            />
            <ModernInfoRow 
                label="Admin Email" 
                value={fullProfile?.email || user?.email} 
                icon={<Mail size={18} className="text-gray-400" />} 
            />
            <ModernInfoRow 
                label="Phone Contact" 
                value={fullProfile?.phone_number} 
                icon={<Phone size={18} className="text-gray-400" />} 
            />
          </div>
        </div>

        {/* Manage Account Column */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 self-start">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-8 flex items-center gap-3">
            <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                <Shield size={16} />
            </div> 
            Manage Account
          </h3>
          <div className="space-y-4">
             <AccountLink 
                label="Change Password" 
                icon={<RotateCcw size={18} className="text-purple-500" />}
                onClick={() => setIsPasswordDialogOpen(true)}
             />
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white [&>button]:hidden border-0 shadow-2xl rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="p-6 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Edit size={20} /> Update Admin Profile
              </DialogTitle>
              <button onClick={() => setIsEditDialogOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
          </DialogHeader>
          
          <div className="p-8 space-y-6">
            <InputField label="Full Name" icon={<User size={18}/>} value={formData.name} onChange={(v) => setFormData({...formData, name: v})} color="purple" />
            <InputField label="Email Address" icon={<Mail size={18}/>} value={formData.email} onChange={(v) => setFormData({...formData, email: v})} color="purple" />
            <InputField label="Phone Number" icon={<Phone size={18}/>} value={formData.phone_number} onChange={(v) => setFormData({...formData, phone_number: v})} color="purple" />
          </div>

          <DialogFooter className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3 sm:flex-row">
            <button onClick={() => setIsEditDialogOpen(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold">Cancel</button>
            <button onClick={handleUpdate} disabled={isUpdating} className="px-8 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/25">
              {isUpdating ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white [&>button]:hidden border-0 shadow-2xl rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="p-6 bg-purple-600 text-white">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Lock size={20} /> Change Password
              </DialogTitle>
              <button onClick={() => setIsPasswordDialogOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <DialogDescription className="text-purple-50 mt-1 opacity-80">
                Update your administrative access credentials securely.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-8 space-y-5">
            <InputField label="Current Password" type="password" icon={<Lock size={18}/>} value={passwordForm.current_password} onChange={(v) => setPasswordForm({...passwordForm, current_password: v})} color="purple" />
            <div className="h-px bg-gray-100 my-2"></div>
            <InputField label="New Password" type="password" icon={<Key size={18}/>} value={passwordForm.new_password} onChange={(v) => setPasswordForm({...passwordForm, new_password: v})} color="purple" />
            <InputField label="Confirm New Password" type="password" icon={<Lock size={18}/>} value={passwordForm.confirm_password} onChange={(v) => setPasswordForm({...passwordForm, confirm_password: v})} color="purple" />
          </div>

          <DialogFooter className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3 sm:flex-row">
            <button onClick={() => setIsPasswordDialogOpen(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold">Cancel</button>
            <button onClick={handlePasswordChange} disabled={isUpdating} className="px-8 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/25">
              {isUpdating ? <Loader2 className="animate-spin" size={16}/> : <Shield size={16}/>} Update Password
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Help & Support Dialog */}
      <Dialog open={isHelpSupportDialogOpen} onOpenChange={setIsHelpSupportDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white [&>button]:hidden border-0 shadow-2xl rounded-3xl p-0 overflow-hidden">
          <div className="relative p-8 text-center bg-purple-600 text-white overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <LifeBuoy size={48} className="mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-black mb-1">Help Center</h2>
              <p className="text-purple-100 text-sm font-medium">How can we assist you today?</p>
          </div>

          <div className="p-8 space-y-4">
            <a href="tel:+919876543210" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-purple-50 border border-transparent hover:border-purple-100 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-white border border-transparent shadow-sm">
                    <Phone size={18} />
                </div>
                <div className="text-left flex-grow">
                    <p className="text-sm font-bold text-gray-900">Call Us</p>
                    <p className="text-xs text-gray-500 font-medium">+91 98765 43210</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-purple-600" />
            </a>

            <a href="mailto:support@orthoguide.com" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-purple-50 border border-transparent hover:border-purple-100 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-white border border-transparent shadow-sm">
                    <Mail size={18} />
                </div>
                <div className="text-left flex-grow">
                    <p className="text-sm font-bold text-gray-900">Email Support</p>
                    <p className="text-xs text-gray-500 font-medium">support@orthoguide.com</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-purple-600" />
            </a>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-white text-gray-400 flex items-center justify-center shadow-sm">
                    <Clock size={18} />
                </div>
                <div className="text-left">
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-widest leading-none mb-1">Response Time</p>
                    <p className="text-xs text-gray-400 font-medium">Typically within 24 hours</p>
                </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 text-center">
              <button 
                onClick={() => setIsHelpSupportDialogOpen(false)} 
                className="text-sm font-bold text-gray-400 hover:text-purple-600 transition-colors uppercase tracking-widest"
              >
                Close Help Center
              </button>
          </div>
        </DialogContent>
      </Dialog>

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
                Deactivate Admin?
             </DialogTitle>
             
             <p className="text-sm font-bold text-gray-500 leading-relaxed mb-10 px-4">
                This will deactivate your administrative access. 
                You will need to contact another superuser to reactivate your credentials.
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
    <div className="flex items-center gap-5 p-5 bg-gray-100 rounded-2xl border border-transparent hover:border-purple-100 hover:bg-white transition-all group">
      <div className="p-3 bg-white text-gray-400 rounded-xl shadow-sm border border-gray-100 group-hover:text-purple-600 transition-colors">
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
      className={`w-full flex items-center gap-5 p-5 bg-white rounded-2xl border ${danger ? 'border-red-100 hover:border-red-200' : 'border-purple-100/50 hover:border-purple-200'} shadow-sm hover:shadow-md transition-all group active:scale-[0.98]`}
    >
      <div className={`p-3 bg-gray-50 rounded-xl shadow-sm border border-transparent group-hover:scale-110 transition-transform ${danger ? 'text-red-500 bg-red-50' : 'text-purple-600 bg-purple-50'}`}>
        {icon}
      </div>
      <div className="flex-grow text-left">
        <p className={`text-sm font-black tracking-tight ${danger ? 'text-red-600' : 'text-gray-900 group-hover:text-purple-700'}`}>{label}</p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-none mt-1">Update Security Credentials</p>
      </div>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${danger ? 'border-red-50 text-red-300 group-hover:bg-red-600 group-hover:text-white' : 'border-purple-50 text-purple-300 group-hover:bg-purple-600 group-hover:text-white'}`}>
        <ChevronRight size={16} />
      </div>
    </button>
  )
}

function InputField({ label, icon, value, onChange, readOnly, color, type = "text" }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const actualType = isPassword ? (showPassword ? "text" : "password") : type

  const focusClass = color === "purple" ? "focus:ring-purple-500/20 focus:border-purple-500" : "focus:ring-green-500/20 focus:border-green-500"
  const iconClass = color === "purple" ? "group-focus-within:text-purple-600" : "group-focus-within:text-green-600"

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">{label}</label>
      <div className="relative group">
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors ${iconClass}`}>
          {icon}
        </div>
        <input
          type={actualType}
          value={value}
          readOnly={readOnly}
          onChange={(e) => !readOnly && onChange(e.target.value)}
          className={`w-full ${isPassword ? 'pl-12 pr-12' : 'pl-12 pr-4'} py-3.5 border border-transparent rounded-xl text-sm focus:outline-none transition-all font-medium ${
            readOnly ? "bg-gray-100 cursor-not-allowed text-gray-500" : `bg-gray-50 ${focusClass} focus:bg-white text-gray-900`
          }`}
        />
        {isPassword && !readOnly && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors p-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  )
}


