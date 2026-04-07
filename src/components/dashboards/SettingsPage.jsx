import { 
  Bell, Lock, Save, Loader2, Key, Trash2, HelpCircle, 
  Phone, Mail, ChevronRight, AlertTriangle, Eye, EyeOff, CheckCircle,
  ArrowLeft
} from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { 
  getNotificationSettings, 
  updateNotificationSettings, 
  changePassword, 
  getSupportInfo, 
  deactivateAccount,
  reactivateAccount,
  getClinicianProfile,
  getPatientProfile
} from "@/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate, Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage({ user, role }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [supportInfo, setSupportInfo] = useState(null)
  const [profileData, setProfileData] = useState(null)
  
  // ... (keeping implementation logic same)
  
  // (Assuming I am looking at the truncated view, I need to be careful with replace_file_content)
  // I will replace from line 217 down to 236.

  // Patient notification settings from database
  const [settings, setSettings] = useState({
    oral_hygiene: true,
    appliance_care: true,
    appointment: true
  })

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  // Deactivate State
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [isReactivating, setIsReactivating] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const userId = user?.user_id || user?.id || user?.clinician_id || user?.patient_id
      
      // Fetch Profile to get is_active status
      let profileRes;
      if (role === "clinician") {
        profileRes = await getClinicianProfile(userId)
      } else if (role === "patient") {
        profileRes = await getPatientProfile(userId)
        await fetchNotificationSettings(userId)
      }
      
      if (profileRes?.data) {
        setProfileData(profileRes.data)
      }

      await fetchSupportData()
    } catch (err) {
      console.error("Failed to load settings data:", err)
    } finally {
      setLoading(false)
    }
  }, [role, user])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const fetchSupportData = async () => {
    try {
      const res = await getSupportInfo()
      setSupportInfo(res.data)
    } catch (err) {
      console.error("Failed to load support info:", err)
    }
  }

  const fetchNotificationSettings = async (id) => {
    try {
      const res = await getNotificationSettings(id)
      if (res.data) {
        setSettings({
          oral_hygiene: res.data.oral_hygiene ?? true,
          appliance_care: res.data.appliance_care ?? true,
          appointment: res.data.appointment ?? true
        })
      }
    } catch (err) {
      console.error("Failed to load settings:", err)
    }
  }

  const handleToggle = (field) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleSave = async () => {
    if (role !== "patient") return

    setSaving(true)
    try {
      await updateNotificationSettings({
        patient_id: user.patient_id,
        ...settings
      })
      toast.success("Settings saved successfully!")
    } catch (err) {
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Please fill all password fields")
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    setIsPasswordUpdating(true)
    try {
      await changePassword({
        user_id: user.user_id || user.id || user.clinician_id || user.patient_id,
        role: role,
        old_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword
      })
      toast.success("Password updated successfully!")
      setIsPasswordDialogOpen(false)
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update password")
    } finally {
      setIsPasswordUpdating(false)
    }
  }

  const handleDeactivate = async () => {
    setIsDeactivating(true)
    try {
        await deactivateAccount({ 
            user_id: user.user_id || user.id || user.clinician_id || user.patient_id,
            role: role 
        })
        toast.success("Account deactivated successfully")
        await fetchData()
    } catch (err) {
        toast.error("Failed to deactivate account")
    } finally {
        setIsDeactivating(false)
        setIsDeactivateDialogOpen(false)
    }
  }

  const handleReactivate = async () => {
    setIsReactivating(true)
    try {
        await reactivateAccount({ 
            user_id: user.user_id || user.id || user.clinician_id || user.patient_id,
            role: role 
        })
        toast.success("Account reactivated successfully!")
        await fetchData()
    } catch (err) {
        toast.error("Failed to reactivate account")
    } finally {
        setIsReactivating(false)
    }
  }

  const toggleVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      </div>
    )
  }

  const isActive = profileData?.is_active !== false

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-up pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 mb-4">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all shadow-sm">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-lg font-black text-gray-900 tracking-tight leading-none uppercase">Settings</h1>
            <p className="text-gray-400 text-[10px] font-bold mt-1 uppercase tracking-tight">Account Preferences</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status:</span>
          {isActive ? (
            <Badge className="bg-blue-50 text-blue-600 border-blue-100 px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-bold">
              <CheckCircle size={10} /> Active
            </Badge>
          ) : (
            <Badge className="bg-red-50 text-red-600 border-red-100 px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-bold">
              <AlertTriangle size={10} /> Inactive
            </Badge>
          )}
        </div>
      </div>

      {!isActive && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse-subtle">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm text-red-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-red-900 leading-tight">Your account is currently deactivated</p>
              <p className="text-xs text-red-700/70 mt-0.5">Reactivate your account to restore all features.</p>
            </div>
          </div>
          <Button 
            onClick={handleReactivate}
            disabled={isReactivating}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-8 shadow-lg shadow-red-500/20 h-11 min-w-[160px]"
          >
            {isReactivating ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            Reactivate Now
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Account & Security */}
        <div className="space-y-6">
          {/* Patient Notification Settings */}
          {role === "patient" && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-50">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Notifications</h3>
              </div>
              <div className="p-5 space-y-4">
                <ToggleRow
                  label="Oral Hygiene Reminders"
                  description="Receive reminders for daily oral care routines."
                  checked={settings.oral_hygiene}
                  onChange={() => handleToggle('oral_hygiene')}
                />
                <ToggleRow
                  label="Appliance Care Alerts"
                  description="Get notified about maintenance and cleaning."
                  checked={settings.appliance_care}
                  onChange={() => handleToggle('appliance_care')}
                />
                <ToggleRow
                  label="Appointment Reminders"
                  description="Receive notifications about upcoming visits."
                  checked={settings.appointment}
                  onChange={() => handleToggle('appointment')}
                />
                <div className="pt-4 border-t border-gray-50">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Preferences
                    </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Section */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-50">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Security</h3>
            </div>
            <div className="p-5">
              <button 
                onClick={() => setIsPasswordDialogOpen(true)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
                    <Lock size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">Change Password</p>
                    <p className="text-xs text-gray-400">Regularly update for better security</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Danger Zone Section */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-50">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account Status</h3>
            </div>
            <div className="p-5">
              {isActive ? (
                <button 
                  onClick={() => setIsDeactivateDialogOpen(true)}
                  className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100/80 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2.5 rounded-xl text-red-600 shadow-sm border border-red-100">
                      <Trash2 size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-red-700">Deactivate Account</p>
                      <p className="text-xs text-red-500/70">Temporarily disable your profile</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-red-300 group-hover:text-red-400 transition-transform group-hover:translate-x-1" />
                </button>
              ) : (
                <button 
                  onClick={handleReactivate}
                  disabled={isReactivating}
                  className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2.5 rounded-xl text-blue-600 shadow-sm border border-blue-100">
                      <CheckCircle size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-blue-700">Reactivate Account</p>
                      <p className="text-xs text-blue-500/70">Restore access to all features</p>
                    </div>
                  </div>
                  {isReactivating ? <Loader2 size={18} className="animate-spin text-blue-400" /> : <ChevronRight size={18} className="text-blue-300 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Help & Support (Unified & Matching Height) */}
        <div className="flex flex-col h-full">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1">
            <div className="w-full p-5 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Support & Resources</h3>
              <div className="px-3 py-1 bg-blue-100/50 text-blue-600 text-[10px] font-bold rounded-full">
                App v{supportInfo?.app_version || "2.5.0"}
              </div>
            </div>
            
            <div className="p-8 space-y-6 flex-1 flex flex-col justify-center">
                <div className="space-y-4">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Clinic Administration</div>
                    
                    <a href={`tel:${supportInfo?.admin_phone}`} className="flex items-center gap-5 p-6 bg-blue-50/50 hover:bg-blue-50 group rounded-3xl transition-all border border-blue-100/50 hover:border-blue-200">
                        <div className="bg-white text-blue-600 p-3.5 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                            <Phone size={22} />
                        </div>
                        <div>
                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Call Support (Primary)</p>
                            <p className="text-xl font-black text-blue-900 group-hover:tracking-tight transition-all">{supportInfo?.admin_phone || "+91 98765 43210"}</p>
                        </div>
                    </a>

                    <a href={`mailto:${supportInfo?.support_email}`} className="flex items-center gap-5 p-5 bg-gray-50/50 hover:bg-gray-100 group rounded-2xl transition-all border border-gray-100">
                        <div className="bg-white text-gray-400 group-hover:text-blue-500 p-2.5 rounded-xl shadow-sm transition-colors">
                            <Mail size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Email Support</p>
                            <p className="text-sm font-bold text-gray-700 group-hover:text-gray-900">{supportInfo?.support_email || "support-admin@orthoguide.com"}</p>
                        </div>
                    </a>
                </div>
            </div>

            <div className="p-5 bg-gray-50/30 border-t border-gray-50 text-center">
                <p className="text-[10px] text-gray-400 font-medium">For clinical emergencies, please visit the clinic directly.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl rounded-3xl p-8">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Key size={24} />
              </div> 
              Change Password
            </DialogTitle>
            <DialogDescription className="text-gray-500 pt-1 text-xs">
              Ensure your account is secure with a high-entropy password.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-6">
            <PasswordInput
              id="current"
              label="Current Password"
              value={passwordForm.currentPassword}
              onChange={(val) => setPasswordForm({ ...passwordForm, currentPassword: val })}
              show={showPasswords.current}
              onToggle={() => toggleVisibility('current')}
            />
            <PasswordInput
              id="new"
              label="New Password"
              value={passwordForm.newPassword}
              onChange={(val) => setPasswordForm({ ...passwordForm, newPassword: val })}
              show={showPasswords.new}
              onToggle={() => toggleVisibility('new')}
            />
            <PasswordInput
              id="confirm"
              label="Confirm New Password"
              value={passwordForm.confirmPassword}
              onChange={(val) => setPasswordForm({ ...passwordForm, confirmPassword: val })}
              show={showPasswords.confirm}
              onToggle={() => toggleVisibility('confirm')}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              variant="ghost"
              onClick={() => setIsPasswordDialogOpen(false)}
              className="rounded-2xl hover:bg-gray-100 text-gray-500 font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordChange}
              disabled={isPasswordUpdating}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 font-bold shadow-lg shadow-blue-500/20 h-12"
            >
              {isPasswordUpdating ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Dialog */}
      <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl rounded-3xl p-8">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-xl font-bold text-red-600">
                    <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                        <Trash2 size={24} />
                    </div> 
                    Deactivate Account?
                </DialogTitle>
                <DialogDescription className="text-gray-500 pt-1 leading-relaxed">
                    This will temporarily disable your profile. You can reactivate anytime from this dashboard or by contacting the administrator.
                </DialogDescription>
            </DialogHeader>

            <div className="mt-4 p-4 bg-amber-50 rounded-2xl flex gap-3 border border-amber-100">
                <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 font-medium tracking-tight">
                    Note: Your data will be preserved but you may lose access to active clinical workflows.
                </p>
            </div>

            <DialogFooter className="mt-8 flex flex-col-reverse sm:flex-row gap-3">
                <Button
                    variant="ghost"
                    onClick={() => setIsDeactivateDialogOpen(false)}
                    className="rounded-2xl flex-1 hover:bg-gray-100 text-gray-500 font-bold"
                >
                    Keep My Account
                </Button>
                <Button
                    onClick={handleDeactivate}
                    disabled={isDeactivating}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-2xl flex-1 px-8 font-bold shadow-lg shadow-red-500/10 h-12"
                >
                    {isDeactivating ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                    Confirm Deactivation
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PasswordInput({ id, label, value, onChange, show, onToggle }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</Label>
      <div className="relative group">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className="bg-gray-50 border-gray-100 rounded-xl h-12 px-4 pr-12 focus:ring-blue-500/20 transition-all"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  )
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl border border-gray-100/50">
      <div>
        <p className="text-sm font-semibold text-gray-900 leading-none mb-1.5">{label}</p>
        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider leading-none">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`w-11 h-6 rounded-full transition-all duration-300 relative ${checked ? "bg-blue-500 shadow-inner" : "bg-gray-300"
          }`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${checked ? "translate-x-[21px]" : "translate-x-0.5"
          }`} />
      </button>
    </div>
  )
}
